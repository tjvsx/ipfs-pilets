"use strict";
exports.__esModule = true;
exports.formatAuthor = void 0;
var isAuthor = /^([^<(]+?)?[ \t]*(?:<([^>(]+?)>)?[ \t]*(?:\(([^)]+?)\)|$)/;
function formatAuthor(author, fallback) {
    if (typeof author === 'string') {
        var authorMatch = author.match(isAuthor);
        if ((authorMatch && authorMatch[1]) || authorMatch[2]) {
            return {
                name: authorMatch[1],
                email: authorMatch[2]
            };
        }
    }
    else if (author && typeof author === 'object') {
        return {
            name: author.name,
            email: author.email
        };
    }
    return {
        name: fallback || '',
        email: ''
    };
}
exports.formatAuthor = formatAuthor;
