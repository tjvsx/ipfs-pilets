"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.computeIntegrity = exports.extractPiletMetadata = exports.getPiletDefinition = exports.generateLink = exports.getContent = exports.push = void 0;
var crypto_1 = require("crypto");
var dotenv_1 = require("dotenv");
var fs = require("fs");
var path_1 = require("path");
var stream_1 = require("stream");
var web3_storage_1 = require("web3.storage");
var author_1 = require("./utils/author");
var ipfs_1 = require("./utils/ipfs");
var untar_1 = require("./utils/untar");
(0, dotenv_1.config)();
var checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
var checkV2 = /^\/\/\s*@pilet\s+v:2\s*\(([A-Za-z0-9\_\:\-]+)\s*,\s*(.*)\)/;
var checkVx = /^\/\/\s*@pilet\s+v:x\s*(?:\((.*)\))?/;
var iter = 1;
function push(buildFile) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, file, ipfs, pilet, blob, fileObj, cid, res, files, _a, file_1, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    buffer = fs.readFileSync(buildFile);
                    file = stream_1.Readable.from(buffer);
                    ipfs = (0, ipfs_1.makeStorageClient)();
                    return [4 /*yield*/, getPiletDefinition(file, ipfs)];
                case 1:
                    pilet = _b.sent();
                    console.log("\uD83D\uDC8E pushing ".concat(pilet.meta.name, " to ipfs..."));
                    blob = new web3_storage_1.Blob([Buffer.from(JSON.stringify(pilet.meta))], {
                        type: 'application/json'
                    });
                    fileObj = new web3_storage_1.File([blob], 'pilet.json', { type: 'application/json' });
                    return [4 /*yield*/, ipfs.put([fileObj])];
                case 2:
                    cid = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, ipfs.get(cid)];
                case 4:
                    res = _b.sent();
                    _a = res;
                    if (!_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, res.files()];
                case 5:
                    _a = (_b.sent());
                    _b.label = 6;
                case 6:
                    files = _a;
                    file_1 = files && files[0];
                    if (file_1 && file_1.name === 'pilet.json') {
                        console.info(file_1.cid);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _b.sent();
                    console.error(e_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.push = push;
function getPackageJson(files) {
    var fileName = "package.json";
    var fileContent = files[fileName];
    var content = fileContent.toString('utf8');
    return JSON.parse(content);
}
function getContent(path, files) {
    var content = path && files[path];
    return content && content.toString('utf8');
}
exports.getContent = getContent;
function generateLink(data, files, ipfs) {
    return __awaiter(this, void 0, void 0, function () {
        var newFiles, _i, _a, file, blob, fileObj, cid;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    newFiles = [];
                    for (_i = 0, _a = Object.keys(files); _i < _a.length; _i++) {
                        file = _a[_i];
                        blob = new web3_storage_1.Blob([files[file]], { type: 'application/json' });
                        fileObj = new web3_storage_1.File([blob], file, { type: 'application/json' });
                        newFiles.push(fileObj);
                    }
                    return [4 /*yield*/, ipfs.put(newFiles)];
                case 1:
                    cid = _b.sent();
                    return [2 /*return*/, "".concat(cid.toString())];
            }
        });
    });
}
exports.generateLink = generateLink;
function getPiletMainPath(data, files) {
    var paths = [
        data.main,
        "dist/".concat(data.main),
        "".concat(data.main, "/index.js"),
        "dist/".concat(data.main, "/index.js"),
        'index.js',
        'dist/index.js',
    ];
    return paths
        .map(function (filePath) { return "".concat(filePath); })
        .filter(function (filePath) { return !!files[filePath]; })[0];
}
function getDependencies(deps) {
    try {
        var depMap_1 = JSON.parse(deps);
        if (depMap_1 && typeof depMap_1 === 'object') {
            if (Object.keys(depMap_1).every(function (m) { return typeof depMap_1[m] === 'string'; })) {
                return depMap_1;
            }
        }
    }
    catch (_a) { }
    return {};
}
function getFilesOfFolder(folder, files) {
    return Object.keys(files).reduce(function (acc, key) {
        acc[key.replace(folder, '')] = files[key];
        return acc;
    }, {});
}
function getPiletDefinition(stream, node) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, untar_1.untar)(stream).then(function (f) { return __awaiter(_this, void 0, void 0, function () {
                    var files, packageJson, mainPath, root, file, main, link, meta;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                files = getFilesOfFolder('package/', f);
                                packageJson = getPackageJson(files);
                                mainPath = getPiletMainPath(packageJson, files);
                                root = (0, path_1.dirname)(mainPath);
                                file = (0, path_1.basename)(mainPath);
                                main = getContent(mainPath, files);
                                return [4 /*yield*/, generateLink(packageJson, files, node)];
                            case 1:
                                link = _a.sent();
                                return [4 /*yield*/, extractPiletMetadata(packageJson, main, file, files, link)];
                            case 2:
                                meta = _a.sent();
                                return [2 /*return*/, {
                                        meta: meta,
                                        root: root,
                                        files: files
                                    }];
                        }
                    });
                }); })];
        });
    });
}
exports.getPiletDefinition = getPiletDefinition;
function extractPiletMetadata(data, main, file, files, link) {
    return __awaiter(this, void 0, void 0, function () {
        var version, author, license, _a, requireRef, _b, requireRef, plainDependencies, _c, spec;
        return __generator(this, function (_d) {
            version = data.preview ? "".concat(data.version, "-pre.").concat(iter++) : data.version;
            author = (0, author_1.formatAuthor)(data.author);
            license = {
                type: data.license || 'ISC',
                text: getContent("LICENSE", files) || ''
            };
            if (checkV1.test(main)) {
                _a = checkV1.exec(main), requireRef = _a[1];
                return [2 /*return*/, {
                        name: data.name,
                        version: version,
                        type: 'v1',
                        requireRef: requireRef,
                        description: data.description,
                        custom: data.custom,
                        author: author,
                        integrity: computeIntegrity(main),
                        link: link,
                        license: license,
                        spec: 'v1'
                    }];
            }
            else if (checkV2.test(main)) {
                _b = checkV2.exec(main), requireRef = _b[1], plainDependencies = _b[2];
                return [2 /*return*/, {
                        name: data.name,
                        version: version,
                        type: 'v2',
                        requireRef: requireRef,
                        description: data.description || '',
                        integrity: computeIntegrity(main),
                        author: (0, author_1.formatAuthor)(data.author),
                        custom: data.custom,
                        dependencies: getDependencies(plainDependencies),
                        link: link,
                        license: license,
                        spec: 'v2'
                    }];
            }
            else if (checkVx.test(main)) {
                _c = checkVx.exec(main), spec = _c[1];
                return [2 /*return*/, {
                        name: data.name,
                        version: version,
                        type: "vx",
                        spec: 'vx',
                        description: data.description || '',
                        integrity: computeIntegrity(main),
                        author: (0, author_1.formatAuthor)(data.author),
                        custom: data.custom,
                        link: link,
                        license: license
                    }];
            }
            else {
                throw new Error("The main file \"".concat(file, "\" does not contain a valid pilet API."));
            }
            return [2 /*return*/];
        });
    });
}
exports.extractPiletMetadata = extractPiletMetadata;
function computeIntegrity(content) {
    var sum = (0, crypto_1.createHash)('sha256');
    sum.update(content || '');
    return "sha256-".concat(sum.digest('base64'));
}
exports.computeIntegrity = computeIntegrity;
