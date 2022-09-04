"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeIntegrity = exports.computeHash = void 0;
const crypto_1 = require("crypto");
function computeHash(content) {
    const sha1sum = (0, crypto_1.createHash)('sha1');
    sha1sum.update(content || '');
    return sha1sum.digest('hex');
}
exports.computeHash = computeHash;
function computeIntegrity(content) {
    const sum = (0, crypto_1.createHash)('sha256');
    sum.update(content || '');
    return `sha256-${sum.digest('base64')}`;
}
exports.computeIntegrity = computeIntegrity;
//# sourceMappingURL=hash.js.map