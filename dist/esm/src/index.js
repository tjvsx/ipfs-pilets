import * as fs from 'fs';
const { Readable } = require('stream');
import { getPiletDefinition } from './helpers';
async function main(buildFile) {
    const buffer = fs.readFileSync(buildFile);
    const file = Readable.from(buffer);
    const { create } = await import('ipfs-http-client');
    const ipfs = create({ url: `http:localhost:5005/api/v0` });
    const pilet = await getPiletDefinition(file, ipfs);
    console.log(`💎 pushing ${pilet.meta.name} to ipfs...`);
    const { cid } = await ipfs.add(JSON.stringify(pilet));
    console.info(cid);
}
var args = process.argv.slice(2);
main(args[0]);
//# sourceMappingURL=index.js.map