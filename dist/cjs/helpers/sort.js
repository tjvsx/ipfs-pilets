"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPilets = void 0;
function comparePilets(a, b) {
    return a.name.localeCompare(b.name);
}
function sortPilets(pilets) {
    const sortedPilets = [...pilets];
    sortedPilets.sort(comparePilets);
    return sortedPilets;
}
exports.sortPilets = sortPilets;
