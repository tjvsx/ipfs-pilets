/// <reference types="node" />
import { PiletMetadata, PackageData, PackageFiles, Pilet } from '../types';
import type { IPFSHTTPClient } from 'ipfs-http-client';
export declare function getContent(path: string, files: PackageFiles): string;
export declare function generateLinks(data: PackageData, files: PackageFiles, ipfs: IPFSHTTPClient): Promise<string>;
export declare function extractPiletMetadata(data: PackageData, main: string, file: string, files: PackageFiles, link: string): Promise<PiletMetadata>;
export declare function getPiletDefinition(stream: NodeJS.ReadableStream, node: IPFSHTTPClient): Promise<Pilet>;
