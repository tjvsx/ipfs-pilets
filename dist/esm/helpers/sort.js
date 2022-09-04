function comparePilets(a, b) {
    return a.name.localeCompare(b.name);
}
export function sortPilets(pilets) {
    const sortedPilets = [...pilets];
    sortedPilets.sort(comparePilets);
    return sortedPilets;
}
