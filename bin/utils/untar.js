"use strict";
exports.__esModule = true;
exports.untar = void 0;
var tar = require("tar");
var zlib_1 = require("zlib");
var TarParser = tar.Parse;
function untar(stream) {
    return new Promise(function (resolve, reject) {
        var files = {};
        stream
            .on('error', reject)
            .pipe((0, zlib_1.createGunzip)())
            .on('error', reject)
            .pipe(new TarParser())
            .on('error', reject)
            .on('entry', function (e) {
            var content = [];
            var p = e.path;
            e.on('error', reject);
            e.on('data', function (c) { return content.push(c); });
            e.on('end', function () { return (files[p] = Buffer.concat(content)); });
        })
            .on('end', function () { return resolve(files); });
    });
}
exports.untar = untar;
