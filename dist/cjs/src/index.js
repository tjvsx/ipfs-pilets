"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const { Readable } = require('stream');
const helpers_1 = require("./helpers");
async function main(buildFile) {
    const buffer = fs.readFileSync(buildFile);
    const file = Readable.from(buffer);
    const { create } = await Promise.resolve().then(() => require('ipfs-http-client'));
    const ipfs = create({ url: `http:localhost:5005/api/v0` });
    const pilet = await (0, helpers_1.getPiletDefinition)(file, ipfs);
    console.log(`💎 pushing ${pilet.meta.name} to ipfs...`);
    const { cid } = await ipfs.add(JSON.stringify(pilet));
    console.info(cid);
}
var args = process.argv.slice(2);
main(args[0]);
//# sourceMappingURL=index.js.map