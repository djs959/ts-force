"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLimitsFromResponse = void 0;
var LIMITS_REGEX = /api-usage=(\d+)\/(\d+)/;
var parseLimitsFromResponse = function (response) {
    if (response.headers && response.headers['sforce-limit-info']) {
        var match = LIMITS_REGEX.exec(response.headers['sforce-limit-info']);
        if (!match) {
            return null;
        }
        var _a = __read(match, 3), used = _a[1], total = _a[2];
        return {
            used: Number(used),
            limit: Number(total)
        };
    }
    return null;
};
exports.parseLimitsFromResponse = parseLimitsFromResponse;
