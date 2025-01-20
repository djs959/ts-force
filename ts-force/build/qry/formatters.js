"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFormatter = exports.dateTimeFormatter = exports.dateFormatter = exports.stringFormatter = exports.NULL = void 0;
exports.NULL = 'NULL';
var stringFormatter = function (val) {
    return "'".concat(val, "'");
};
exports.stringFormatter = stringFormatter;
var dateFormatter = function (val) {
    return val.toISOString().slice(0, 10);
};
exports.dateFormatter = dateFormatter;
var dateTimeFormatter = function (val) {
    return val.toISOString();
};
exports.dateTimeFormatter = dateTimeFormatter;
var listFormatter = function (val) {
    return "(".concat(val.map(function (v) { return "'".concat(v, "'"); }).join(', '), ")");
};
exports.listFormatter = listFormatter;
