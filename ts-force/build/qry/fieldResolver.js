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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderComplexTypeText = exports.FieldResolver = void 0;
var queryBuilder_1 = require("./queryBuilder");
/**
 * Allow resolving of object API
 */
var FieldResolver = /** @class */ (function () {
    function FieldResolver(obj, traversed) {
        this._obj = obj;
        this.traversed = traversed || [];
    }
    FieldResolver.prototype.select = function () {
        var e_1, _a;
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var relations = this.traversed.map(function (r) { return r.apiName; });
        var fieldArr = [];
        var toResolve = args;
        if (args.length === 1 && Array.isArray(args[0])) {
            toResolve = args[0];
        }
        try {
            for (var toResolve_1 = __values(toResolve), toResolve_1_1 = toResolve_1.next(); !toResolve_1_1.done; toResolve_1_1 = toResolve_1.next()) {
                var field = toResolve_1_1.value;
                if (Array.isArray(field)) {
                    field.forEach(function (arrField) {
                        if (typeof arrField === 'string') {
                            fieldArr.push(_this._obj.FIELDS[arrField].apiName);
                        }
                        else if (typeof arrField === 'object') {
                            fieldArr.push(renderComplexTypeText(_this._obj.FIELDS[arrField.field].apiName, arrField.fn, arrField.alias));
                        }
                    });
                }
                else if (typeof field === 'string') {
                    fieldArr.push(this._obj.FIELDS[field].apiName);
                }
                else if (typeof field === 'object') {
                    fieldArr.push(renderComplexTypeText(this._obj.FIELDS[field.field].apiName, field.fn, field.alias));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (toResolve_1_1 && !toResolve_1_1.done && (_a = toResolve_1.return)) _a.call(toResolve_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var fields = fieldArr.map(function (field) {
            return __spreadArray(__spreadArray([], __read(relations), false), [field], false).join('.');
        });
        if (fields.length === 1 && !Array.isArray(args[0])) {
            return fields[0];
        }
        return fields;
    };
    /**
     * Traverses a parent relationship, providing a field resolver that can build field paths relative to the starting relationship
     *
     * @param relation: a parent SObject relation key of the current SObject
     * @returns a new FieldResolver for the selected parent relation, with information to track the traversed relationships
     */
    FieldResolver.prototype.parent = function (relation) {
        var rel1Meta = this._obj.FIELDS[relation];
        var rel1 = rel1Meta.reference();
        return new FieldResolver(rel1, __spreadArray(__spreadArray([], __read(this.traversed), false), [rel1Meta], false));
    };
    /**
     * Provided the a key of a child relationship on the SObject,
     * creates a new FieldResolver for that relationships type and passes in `func` so a SELECT subquery can be generated
     *
     * @param relationship The child relationships key to generate the subquery for
     * @param func a function, which accepts a FieldResolver and returns the a Subquery
     */
    FieldResolver.prototype.subQuery = function (relationship, func) {
        var relationMeta = this._obj.FIELDS[relationship];
        var fields = new FieldResolver(relationMeta.reference());
        var subQuery = func(fields);
        return "(".concat((0, queryBuilder_1.composeSOQLQuery)(__assign(__assign({}, subQuery), { from: relationMeta.apiName })), ")");
    };
    return FieldResolver;
}());
exports.FieldResolver = FieldResolver;
function renderComplexTypeText(field, func, alias) {
    return "".concat(func, "(").concat(field, ")").concat(alias ? ' ' + alias : '');
}
exports.renderComplexTypeText = renderComplexTypeText;
