import { createHash } from 'crypto';
import { config } from 'dotenv';
import * as fs from 'fs';
import { basename, dirname } from 'path';
import { Readable } from 'stream';
import { Blob, File, Web3Storage } from 'web3.storage';
import { PackageData, PackageFiles, Pilet, PiletMetadata } from './types';
import { formatAuthor } from './utils/author';
import { makeStorageClient } from './utils/ipfs';
import { untar } from './utils/untar';
config();

const checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
const checkV2 = /^\/\/\s*@pilet\s+v:2\s*\(([A-Za-z0-9\_\:\-]+)\s*,\s*(.*)\)/;
const checkVx = /^\/\/\s*@pilet\s+v:x\s*(?:\((.*)\))?/;
let iter = 1;

export async function push(buildFile: fs.PathOrFileDescriptor) {
  const buffer = fs.readFileSync(buildFile);
  const file = Readable.from(buffer);

  const ipfs = makeStorageClient();

  const pilet = await getPiletDefinition(file, ipfs);
  console.log(`💎 pushing ${pilet.meta.name} to ipfs...`);

  //convert file to Blob, preserve json format
  const blob = new Blob([Buffer.from(JSON.stringify(pilet.meta))], {
    type: 'application/json',
  });
  // convert Blob to File and preserve json format
  const fileObj = new File([blob], 'pilet.json', { type: 'application/json' });
  const cid = await ipfs.put([fileObj]);
  try {
    const res = await ipfs.get(cid);
    const files = res && (await res.files());
    const file = files && files[0];
    if (file && file.name === 'pilet.json') {
      console.info(file.cid);
    }
  } catch (e) {
    console.error(e);
  }
}

function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `package.json`;
  const fileContent = files[fileName];
  const content = fileContent.toString('utf8');
  return JSON.parse(content);
}

export function getContent(path: string, files: PackageFiles) {
  const content = path && files[path];
  return content && content.toString('utf8');
}

export async function generateLink(
  data: PackageData,
  files: PackageFiles,
  ipfs: Web3Storage
) {
  let newFiles: any[] = [];
  for (const file of Object.keys(files)) {
    const blob = new Blob([files[file]], { type: 'application/json' });
    const fileObj = new File([blob], file, { type: 'application/json' });
    newFiles.push(fileObj);
  }
  const cid = await ipfs.put(newFiles);
  return `${cid.toString()}`;
}

function getPiletMainPath(data: PackageData, files: PackageFiles) {
  const paths = [
    data.main,
    `dist/${data.main}`,
    `${data.main}/index.js`,
    `dist/${data.main}/index.js`,
    'index.js',
    'dist/index.js',
  ];
  return paths
    .map((filePath) => `${filePath}`)
    .filter((filePath) => !!files[filePath])[0];
}

function getDependencies(deps: string) {
  try {
    const depMap = JSON.parse(deps);

    if (depMap && typeof depMap === 'object') {
      if (Object.keys(depMap).every((m) => typeof depMap[m] === 'string')) {
        return depMap;
      }
    }
  } catch {}
  return {};
}

function getFilesOfFolder(folder: string, files: PackageFiles) {
  return Object.keys(files).reduce((acc, key) => {
    acc[key.replace(folder, '')] = files[key];
    return acc;
  }, {});
}

export async function getPiletDefinition(
  stream: NodeJS.ReadableStream,
  node: Web3Storage
): Promise<Pilet> {
  return untar(stream).then(async (f) => {
    // remove 'package/' from the beginning of the file paths
    const files = getFilesOfFolder('package/', f);

    const packageJson = getPackageJson(files);
    // parse files to find main entry file
    const mainPath = getPiletMainPath(packageJson, files);

    // get 'dist' (folder) and 'index.js' (file) names
    const root = dirname(mainPath);
    const file = basename(mainPath);

    // get main (the entry file) of the pilet
    const main = getContent(mainPath, files);

    // generate link to place in pilet.json
    const link = await generateLink(packageJson, files, node);

    // format pilet.json
    const meta = await extractPiletMetadata(
      packageJson,
      main,
      file,
      files,
      link
    );
    return {
      meta,
      root,
      files,
    };
  });
}

export async function extractPiletMetadata(
  data: PackageData,
  main: string,
  file: string,
  files: PackageFiles,
  link: string
): Promise<PiletMetadata> {
  const version = data.preview ? `${data.version}-pre.${iter++}` : data.version;
  const author = formatAuthor(data.author);
  const license = {
    type: data.license || 'ISC',
    text: getContent(`LICENSE`, files) || '',
  };

  if (checkV1.test(main)) {
    // uses single argument; requireRef (required)
    //@ts-ignore
    const [, requireRef] = checkV1.exec(main);
    return {
      name: data.name,
      version,
      type: 'v1',
      requireRef,
      description: data.description,
      custom: data.custom,
      author,
      integrity: computeIntegrity(main),
      link,
      license,
      spec: 'v1',
    };
  } else if (checkV2.test(main)) {
    // uses two arguments; requireRef and dependencies as JSON (required)
    //@ts-ignore
    const [, requireRef, plainDependencies] = checkV2.exec(main);
    return {
      name: data.name,
      version,
      type: 'v2',
      requireRef,
      description: data.description || '',
      integrity: computeIntegrity(main),
      author: formatAuthor(data.author),
      custom: data.custom,
      dependencies: getDependencies(plainDependencies),
      link,
      license,
      spec: 'v2',
    };
  } else if (checkVx.test(main)) {
    // uses single argument; spec identifier (optional)
    //@ts-ignore
    const [, spec] = checkVx.exec(main);
    return {
      name: data.name,
      version,
      type: `vx`,
      spec: 'vx',
      description: data.description || '',
      integrity: computeIntegrity(main),
      author: formatAuthor(data.author),
      custom: data.custom,
      link,
      license,
    };
  } else {
    throw new Error(
      `The main file "${file}" does not contain a valid pilet API.`
    );
  }
}

export function computeIntegrity(content: string) {
  const sum = createHash('sha256');
  sum.update(content || '');
  return `sha256-${sum.digest('base64')}`;
}
