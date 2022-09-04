"use strict";
exports.__esModule = true;
exports.computeIntegrity = exports.computeHash = void 0;
var crypto_1 = require("crypto");
function computeHash(content) {
    var sha1sum = (0, crypto_1.createHash)('sha1');
    sha1sum.update(content || '');
    return sha1sum.digest('hex');
}
exports.computeHash = computeHash;
function computeIntegrity(content) {
    var sum = (0, crypto_1.createHash)('sha256');
    sum.update(content || '');
    return "sha256-".concat(sum.digest('base64'));
}
exports.computeIntegrity = computeIntegrity;
