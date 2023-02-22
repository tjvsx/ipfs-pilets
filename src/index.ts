#!/usr/bin/env node
import * as fs from "fs";
import { push } from "./push";

const usage = () => {
  console.log(`
  Usage:

  WEB3STORAGE_TOKEN=<destination directory> \
  usedapp-generate-hooks ./dist/<build file>
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
