"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const { Readable } = require('stream');
const helpers_1 = require("./helpers");
async function main(buildFile) {
    const buffer = fs.readFileSync(buildFile);
    const file = Readable.from(buffer);
    const { create } = await Promise.resolve().then(() => __importStar(require('ipfs-http-client')));
    const ipfs = create({ url: `http:localhost:5005/api/v0` });
    const pilet = await (0, helpers_1.getPiletDefinition)(file, ipfs);
    console.log(`💎 pushing ${pilet.meta.name} to ipfs...`);
    const { cid } = await ipfs.add(JSON.stringify(pilet));
    console.info(cid);
}
var args = process.argv.slice(2);
main(args[0]);
