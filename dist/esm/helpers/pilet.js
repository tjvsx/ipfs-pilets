import { dirname, basename } from 'path';
import { formatAuthor } from './author';
import { untar } from './untar';
import { computeHash, computeIntegrity } from './hash';
const packageRoot = 'package/';
const checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
const checkV2 = /^\/\/\s*@pilet\s+v:2\s*\(([A-Za-z0-9\_\:\-]+)\s*,\s*(.*)\)/;
const checkVx = /^\/\/\s*@pilet\s+v:x\s*(?:\((.*)\))?/;
let iter = 1;
function getPackageJson(files) {
    const fileName = `${packageRoot}package.json`;
    const fileContent = files[fileName];
    const content = fileContent.toString('utf8');
    return JSON.parse(content);
}
export function getContent(path, files) {
    const content = path && files[path];
    return content && content.toString('utf8');
}
export async function generateLinks(data, files, ipfs) {
    const name = data.name;
    const version = data.preview ? `${data.version}-pre.${iter++}` : data.version;
    try {
        await ipfs.files.stat(`/files/${name}/${version}`);
    }
    catch (_a) {
        await ipfs.files.mkdir(`/files/${name}/${version}`, { parents: true });
    }
    const arr = Array.from(Object.keys(files));
    arr.forEach(async (file, index) => {
        const filename = file.replace(/^.*[\\\/]/, '');
        if (!filename.match(/(\w*)\.tgz$/)) {
            const content = getContent(file, files);
            if (content.length > 0) {
                await ipfs.files.write(`/files/${name}/${version}/${filename}`, content, { create: true });
            }
        }
    });
    const { cid } = await ipfs.files.stat(`/files/${name}/${version}`);
    return `${cid.toString()}/index.js`;
}
function getPiletMainPath(data, files) {
    const paths = [
        data.main,
        `dist/${data.main}`,
        `${data.main}/index.js`,
        `dist/${data.main}/index.js`,
        'index.js',
        'dist/index.js',
    ];
    return paths.map(filePath => `${packageRoot}${filePath}`).filter(filePath => !!files[filePath])[0];
}
function getDependencies(deps) {
    try {
        const depMap = JSON.parse(deps);
        if (depMap && typeof depMap === 'object') {
            if (Object.keys(depMap).every(m => typeof depMap[m] === 'string')) {
                return depMap;
            }
        }
    }
    catch (_a) { }
    return {};
}
export async function extractPiletMetadata(data, main, file, files, link) {
    const name = data.name;
    const version = data.preview ? `${data.version}-pre.${iter++}` : data.version;
    const author = formatAuthor(data.author);
    const license = {
        type: data.license || 'ISC',
        text: getContent(`${packageRoot}LICENSE`, files) || '',
    };
    if (checkV1.test(main)) {
        // uses single argument; requireRef (required)
        //@ts-ignore
        const [, requireRef] = checkV1.exec(main);
        return {
            name,
            version,
            type: 'v1',
            requireRef,
            description: data.description,
            custom: data.custom,
            author,
            integrity: computeIntegrity(main),
            link,
            license,
        };
    }
    else if (checkV2.test(main)) {
        // uses two arguments; requireRef and dependencies as JSON (required)
        //@ts-ignore
        const [, requireRef, plainDependencies] = checkV2.exec(main);
        return {
            name,
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
        };
    }
    else if (checkVx.test(main)) {
        // uses single argument; spec identifier (optional)
        //@ts-ignore
        const [, spec] = checkVx.exec(main);
        return {
            name,
            version,
            type: `vx`,
            spec,
            description: data.description || '',
            integrity: computeIntegrity(main),
            author: formatAuthor(data.author),
            custom: data.custom,
            link,
            license,
        };
    }
    else {
        return {
            name,
            version,
            type: 'v0',
            description: data.description,
            custom: data.custom,
            author,
            hash: computeHash(main),
            link,
            license,
        };
    }
}
export function getPiletDefinition(stream, node) {
    return untar(stream).then(async (files) => {
        const data = getPackageJson(files);
        const path = getPiletMainPath(data, files);
        const root = dirname(path);
        const file = basename(path);
        const main = getContent(path, files);
        const link = await generateLinks(data, files, node);
        const meta = await extractPiletMetadata(data, main, file, files, link);
        return {
            meta,
            root,
            files,
        };
    });
}
