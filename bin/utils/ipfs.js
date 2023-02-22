"use strict";
exports.__esModule = true;
exports.makeStorageClient = exports.getAccessToken = void 0;
var web3_storage_1 = require("web3.storage");
function getAccessToken() {
    return process.env.WEB3STORAGE_TOKEN;
}
exports.getAccessToken = getAccessToken;
function makeStorageClient() {
    return new web3_storage_1.Web3Storage({ token: getAccessToken() });
}
exports.makeStorageClient = makeStorageClient;
