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
exports.getPiletDefinition = exports.extractPiletMetadata = exports.generateLinks = exports.getContent = void 0;
var path_1 = require("path");
var author_1 = require("./author");
var untar_1 = require("./untar");
var hash_1 = require("./hash");
var packageRoot = 'package/';
var checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
var checkV2 = /^\/\/\s*@pilet\s+v:2\s*\(([A-Za-z0-9\_\:\-]+)\s*,\s*(.*)\)/;
var checkVx = /^\/\/\s*@pilet\s+v:x\s*(?:\((.*)\))?/;
var iter = 1;
function getPackageJson(files) {
    var fileName = "".concat(packageRoot, "package.json");
    var fileContent = files[fileName];
    var content = fileContent.toString('utf8');
    return JSON.parse(content);
}
function getContent(path, files) {
    var content = path && files[path];
    return content && content.toString('utf8');
}
exports.getContent = getContent;
function generateLinks(data, files, ipfs) {
    return __awaiter(this, void 0, void 0, function () {
        var name, version, _a, arr, cid;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    name = data.name;
                    version = data.preview ? "".concat(data.version, "-pre.").concat(iter++) : data.version;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, ipfs.files.stat("/files/".concat(name, "/").concat(version))];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3:
                    _a = _b.sent();
                    return [4 /*yield*/, ipfs.files.mkdir("/files/".concat(name, "/").concat(version), { parents: true })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 5:
                    arr = Array.from(Object.keys(files));
                    arr.forEach(function (file, index) { return __awaiter(_this, void 0, void 0, function () {
                        var filename, content;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    filename = file.replace(/^.*[\\\/]/, '');
                                    if (!!filename.match(/(\w*)\.tgz$/)) return [3 /*break*/, 2];
                                    content = getContent(file, files);
                                    if (!(content.length > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, ipfs.files.write("/files/".concat(name, "/").concat(version, "/").concat(filename), content, { create: true })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, ipfs.files.stat("/files/".concat(name, "/").concat(version))];
                case 6:
                    cid = (_b.sent()).cid;
                    return [2 /*return*/, "".concat(cid.toString(), "/index.js")];
            }
        });
    });
}
exports.generateLinks = generateLinks;
function getPiletMainPath(data, files) {
    var paths = [
        data.main,
        "dist/".concat(data.main),
        "".concat(data.main, "/index.js"),
        "dist/".concat(data.main, "/index.js"),
        'index.js',
        'dist/index.js',
    ];
    return paths.map(function (filePath) { return "".concat(packageRoot).concat(filePath); }).filter(function (filePath) { return !!files[filePath]; })[0];
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
function extractPiletMetadata(data, main, file, files, link) {
    return __awaiter(this, void 0, void 0, function () {
        var name, version, author, license, _a, requireRef, _b, requireRef, plainDependencies, _c, spec;
        return __generator(this, function (_d) {
            name = data.name;
            version = data.preview ? "".concat(data.version, "-pre.").concat(iter++) : data.version;
            author = (0, author_1.formatAuthor)(data.author);
            license = {
                type: data.license || 'ISC',
                text: getContent("".concat(packageRoot, "LICENSE"), files) || ''
            };
            if (checkV1.test(main)) {
                _a = checkV1.exec(main), requireRef = _a[1];
                return [2 /*return*/, {
                        name: name,
                        version: version,
                        type: 'v1',
                        requireRef: requireRef,
                        description: data.description,
                        custom: data.custom,
                        author: author,
                        integrity: (0, hash_1.computeIntegrity)(main),
                        link: link,
                        license: license
                    }];
            }
            else if (checkV2.test(main)) {
                _b = checkV2.exec(main), requireRef = _b[1], plainDependencies = _b[2];
                return [2 /*return*/, {
                        name: name,
                        version: version,
                        type: 'v2',
                        requireRef: requireRef,
                        description: data.description || '',
                        integrity: (0, hash_1.computeIntegrity)(main),
                        author: (0, author_1.formatAuthor)(data.author),
                        custom: data.custom,
                        dependencies: getDependencies(plainDependencies),
                        link: link,
                        license: license
                    }];
            }
            else if (checkVx.test(main)) {
                _c = checkVx.exec(main), spec = _c[1];
                return [2 /*return*/, {
                        name: name,
                        version: version,
                        type: "vx",
                        spec: spec,
                        description: data.description || '',
                        integrity: (0, hash_1.computeIntegrity)(main),
                        author: (0, author_1.formatAuthor)(data.author),
                        custom: data.custom,
                        link: link,
                        license: license
                    }];
            }
            else {
                return [2 /*return*/, {
                        name: name,
                        version: version,
                        type: 'v0',
                        description: data.description,
                        custom: data.custom,
                        author: author,
                        hash: (0, hash_1.computeHash)(main),
                        link: link,
                        license: license
                    }];
            }
            return [2 /*return*/];
        });
    });
}
exports.extractPiletMetadata = extractPiletMetadata;
function getPiletDefinition(stream, node) {
    var _this = this;
    return (0, untar_1.untar)(stream).then(function (files) { return __awaiter(_this, void 0, void 0, function () {
        var data, path, root, file, main, link, meta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = getPackageJson(files);
                    path = getPiletMainPath(data, files);
                    root = (0, path_1.dirname)(path);
                    file = (0, path_1.basename)(path);
                    main = getContent(path, files);
                    return [4 /*yield*/, generateLinks(data, files, node)];
                case 1:
                    link = _a.sent();
                    return [4 /*yield*/, extractPiletMetadata(data, main, file, files, link)];
                case 2:
                    meta = _a.sent();
                    return [2 /*return*/, {
                            meta: meta,
                            root: root,
                            files: files
                        }];
            }
        });
    }); });
}
exports.getPiletDefinition = getPiletDefinition;
