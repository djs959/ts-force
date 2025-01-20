"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSource = exports.cleanAPIName = void 0;
const ts_morph_1 = require("ts-morph");
const fs = require("fs");
const API_NAME_REGEX = /(?:^((?:\w(?!__))+\w)__|^)((?:\w(?!__))+\w)(?:__(.+)$|$)/;
const cleanAPIName = (sfName, keepNamespaces) => {
    let match = API_NAME_REGEX.exec(sfName);
    if (!match) {
        throw new Error('NO MATCH FOUND FOR ' + sfName);
    }
    let name = (keepNamespaces && match[1] ? match[1] : '') + match[2];
    const parts = name.split('_');
    return parts.map((p, i) => {
        if (i > 0 && p.length) {
            return p.charAt(0).toUpperCase() + p.slice(1);
        }
        return p;
    }).join('');
};
exports.cleanAPIName = cleanAPIName;
const replaceSource = (path) => {
    try {
        fs.unlinkSync(path);
    }
    catch (e) { }
    let ast = new ts_morph_1.Project();
    return ast.createSourceFile(path);
};
exports.replaceSource = replaceSource;
//# sourceMappingURL=util.js.map