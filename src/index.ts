#!/usr/bin/env node
import * as fs from 'fs';
import { push } from './push';

console.log('EXPERIMENTAL: UseDApp automatic hook generation tool');

const usage = () => {
  console.log(`
  Usage:

  WEB3STORAGE_TOKEN=<destination directory> \
  BUILD_FILE_PATH=<build file path> \
  usedapp-generate-hooks
  `);
};

if (!process.env.WEB3STORAGE_TOKEN) {
  usage();
  process.exit(-1);
}

async function main(buildFile: fs.PathOrFileDescriptor) {
  try {
    await push(buildFile);
  } catch (e) {
    console.error(e);
  }
}

var args = process.argv.slice(2);
main(args[0]);
