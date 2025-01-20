"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeConditionalClause = void 0;
var formatters_1 = require("./formatters");
function composeConditionalClause(where) {
    var ret = '';
    where.forEach(function (c) {
        if (isCondition(c)) {
            var cond = composeConditional(c);
            if (ret.length && !(ret.endsWith('AND ') || ret.endsWith('OR '))) {
                ret += ' AND ';
            }
            ret += cond;
        }
        else if (typeof c === 'string') {
            ret += " ".concat(c, " ");
        }
        else if (Array.isArray(c)) {
            if (ret.length && !(ret.endsWith('AND ') || ret.endsWith('OR '))) {
                ret += ' AND ';
            }
            ret += "(".concat(composeConditionalClause(c), ")");
        }
    });
    return ret;
}
exports.composeConditionalClause = composeConditionalClause;
function composeConditional(params) {
    var field = params.field, operator = params.op, not = params.not;
    var val;
    if (isSubQueryCondition(params)) {
        val = "(".concat(params.subqry, ")");
    }
    else if (params.formatter) {
        // overridden by custom formatter
        val = params.formatter(params.val);
    }
    else if (isDateCondition(params)) {
        if (params.dateOnly) {
            val = (0, formatters_1.dateFormatter)(params.val);
        }
        else {
            val = (0, formatters_1.dateTimeFormatter)(params.val);
        }
    }
    else { // primitive/list conditions
        var primVal = params.val;
        if (params.formatter) {
            val = params.formatter(primVal);
        }
        else { // render defaults
            if (primVal === undefined || primVal === null) {
                val = formatters_1.NULL;
            }
            else if (typeof primVal === 'number' || typeof primVal === 'boolean') {
                val = primVal.toString();
            }
            else if (Array.isArray(primVal)) {
                if (!operator) { // default operator
                    operator = 'IN';
                }
                val = (0, formatters_1.listFormatter)(primVal);
            }
            else {
                val = (0, formatters_1.stringFormatter)(primVal);
            }
        }
    }
    if (!operator) { // default
        operator = '=';
    }
    return "".concat(not ? "NOT " : '').concat(field, " ").concat(operator, " ").concat(val);
}
function isCondition(arg) {
    return arg.field !== undefined;
}
function isSubQueryCondition(arg) {
    return arg.subqry !== undefined;
}
function isDateCondition(arg) {
    return arg.val instanceof Date;
}
