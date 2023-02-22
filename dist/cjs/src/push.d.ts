/// <reference types="node" />
/// <reference types="node" />
import * as fs from 'fs';
import { Web3Storage } from 'web3.storage';
import { PackageData, PackageFiles, Pilet, PiletMetadata } from './types';
export declare function push(buildFile: fs.PathOrFileDescriptor): Promise<void>;
export declare function getContent(path: string, files: PackageFiles): string;
export declare function generateLink(data: PackageData, files: PackageFiles, ipfs: Web3Storage): Promise<string>;
export declare function getPiletDefinition(stream: NodeJS.ReadableStream, node: Web3Storage): Promise<Pilet>;
export declare function extractPiletMetadata(data: PackageData, main: string, file: string, files: PackageFiles, link: string): Promise<PiletMetadata>;
export declare function computeIntegrity(content: string): string;
//# sourceMappingURL=push.d.ts.map