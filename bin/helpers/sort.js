"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.sortPilets = void 0;
function comparePilets(a, b) {
    return a.name.localeCompare(b.name);
}
function sortPilets(pilets) {
    var sortedPilets = __spreadArray([], pilets, true);
    sortedPilets.sort(comparePilets);
    return sortedPilets;
}
exports.sortPilets = sortPilets;
