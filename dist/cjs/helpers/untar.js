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
exports.untar = void 0;
const tar = __importStar(require("tar"));
const zlib_1 = require("zlib");
const TarParser = tar.Parse;
function untar(stream) {
    return new Promise((resolve, reject) => {
        const files = {};
        stream
            .on('error', reject)
            .pipe((0, zlib_1.createGunzip)())
            .on('error', reject)
            .pipe(new TarParser())
            .on('error', reject)
            .on('entry', (e) => {
            const content = [];
            const p = e.path;
            e.on('error', reject);
            e.on('data', (c) => content.push(c));
            e.on('end', () => (files[p] = Buffer.concat(content)));
        })
            .on('end', () => resolve(files));
    });
}
exports.untar = untar;
