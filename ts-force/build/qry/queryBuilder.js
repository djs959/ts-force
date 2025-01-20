"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeSOQLQuery = exports.buildQuery = exports.buildQueryObject = void 0;
var fieldResolver_1 = require("./fieldResolver");
var conditional_1 = require("./conditional");
/**
 * Generates a typesafe* query object using the metadata of the object provided
 *
 * @param from The SObject (generated class static) to generate the query for
 * @param buildQuery A function which accepts a field resolver for the `from` SObject returns the query to build (SOQLQueryParams)
 */
function buildQueryObject(from, buildQuery) {
    var fields = new fieldResolver_1.FieldResolver(from);
    return __assign(__assign({}, buildQuery(fields)), { from: from.API_NAME });
}
exports.buildQueryObject = buildQueryObject;
/**
 * Generates a typesafe* query using the metadata of the object provided
 *
 * @param from The SObject (generated class static) to generate the query for
 * @param buildQuery A function which accepts a field resolver for the `from` SObject returns the query to build (SOQLQueryParams)
 */
function buildQuery(from, buildQuery) {
    return composeSOQLQuery(buildQueryObject(from, buildQuery));
}
exports.buildQuery = buildQuery;
function composeSOQLQuery(qry) {
    var from = qry.from, select = qry.select, where = qry.where, limit = qry.limit, offset = qry.offset, groupBy = qry.groupBy, orderBy = qry.orderBy, forClause = qry.for, update = qry.update;
    var ret = "SELECT ".concat(select.filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join(', '), " FROM ").concat(from);
    if (where) {
        ret += " WHERE ".concat((0, conditional_1.composeConditionalClause)(where));
    }
    if (groupBy) {
        var grouping = void 0;
        if (Array.isArray(groupBy.field)) {
            grouping = groupBy.field.join(', ');
        }
        else {
            grouping = groupBy.field;
        }
        if (groupBy.type) {
            grouping = "".concat(groupBy.type, "(").concat(grouping, ")");
        }
        ret += " GROUP BY ".concat(grouping);
        if (groupBy.having) {
            ret += " HAVING ".concat((0, conditional_1.composeConditionalClause)(groupBy.having));
        }
    }
    if (orderBy) {
        var orderByClause = void 0;
        if (Array.isArray(orderBy)) {
            orderByClause = orderBy;
        }
        else {
            orderByClause = [orderBy];
        }
        var orderings = orderByClause.map(function (o) { return "".concat(o.field).concat(o.order ? ' ' + o.order : '').concat(o.nulls ? " NULLS ".concat(o.nulls) : ''); });
        ret += " ORDER BY ".concat(orderings.join(', '));
    }
    if (limit) {
        ret += " LIMIT ".concat(limit);
    }
    if (offset) {
        ret += " OFFSET ".concat(offset);
    }
    // https://salesforce.stackexchange.com/questions/172171/how-to-combine-for-view-and-for-reference
    if (forClause) {
        ret += " FOR ".concat(forClause);
    }
    if (update) {
        ret += " UPDATE ".concat(update);
    }
    // TODO: Add datacategory
    // TODO: update
    // TODO: Type select?
    return ret;
}
exports.composeSOQLQuery = composeSOQLQuery;
