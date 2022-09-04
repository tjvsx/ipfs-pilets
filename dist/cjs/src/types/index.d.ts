/// <reference types="node" />
export interface PiletMetadataV0 {
    content?: string;
    link?: string;
    hash: string;
    noCache?: boolean | string;
    type: 'v0';
}
export interface PiletMetadataV1 {
    link: string;
    requireRef: string;
    integrity?: string;
    type: 'v1';
}
export interface PiletMetadataV2 {
    link: string;
    requireRef: string;
    integrity?: string;
    type: 'v2';
    dependencies?: Record<string, string>;
}
export interface PiletMetadataVx {
    link: string;
    spec?: string;
    integrity?: string;
    type: 'vx';
}
export interface PiletMetadataBase {
    name: string;
    version: string;
    custom?: any;
    description: string;
    author: {
        name: string;
        email: string;
    };
    license: {
        type: string;
        text: string;
    };
}
export declare type PiletMetadata = (PiletMetadataV0 | PiletMetadataV1 | PiletMetadataV2 | PiletMetadataVx) & PiletMetadataBase;
export interface Pilet {
    meta: PiletMetadata;
    root: string;
    files: PackageFiles;
}
export interface PackageFiles {
    [file: string]: Buffer;
}
export interface PackageData {
    name: string;
    description: string;
    version: string;
    preview?: boolean;
    custom?: any;
    author: string | {
        name?: string;
        url?: string;
        email?: string;
    };
    main?: string;
    license?: string;
    dependencies?: {
        [name: string]: string;
    };
    devDependencies?: {
        [name: string]: string;
    };
    peerDependencies?: {
        [name: string]: string;
    };
}
//# sourceMappingURL=index.d.ts.map