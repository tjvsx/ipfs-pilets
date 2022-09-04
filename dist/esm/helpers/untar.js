import * as tar from 'tar';
import { createGunzip } from 'zlib';
const TarParser = tar.Parse;
export function untar(stream) {
    return new Promise((resolve, reject) => {
        const files = {};
        stream
            .on('error', reject)
            .pipe(createGunzip())
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
