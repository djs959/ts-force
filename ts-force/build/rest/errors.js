"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.isInvokableError = exports.isCompositeError = exports.isAxiosError = exports.getExceptionError = exports.getStandardError = exports.CompositeError = void 0;
var CompositeError = /** @class */ (function (_super) {
    __extends(CompositeError, _super);
    function CompositeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CompositeError;
}(Error));
exports.CompositeError = CompositeError;
var getStandardError = function (e) {
    var err = (0, exports.getExceptionError)(e);
    switch (err.type) {
        case 'any':
            return {
                type: err.type,
                e: err.e,
                errorDetails: [{ message: e.message }]
            };
        case 'axios':
            if ((0, exports.isInvokableError)(err.e.response.data)) {
                var invokableResults = err.e.response.data;
                return {
                    type: 'invokable',
                    e: err.e.response.data,
                    errorDetails: invokableResults.reduce(function (result, e) { return __spreadArray(__spreadArray([], __read(result), false), __read(e.errors), false); }, []).map((function (e) {
                        return { message: e.message, errorCode: e.statusCode };
                    }))
                };
            }
            else {
                return {
                    type: err.type,
                    e: err.e,
                    errorDetails: err.e.response.data || err.e.response['body']
                };
            }
        case 'composite':
            return {
                type: err.type,
                e: err.e,
                errorDetails: err.e.compositeResponses.reduce(function (result, e) { return __spreadArray(__spreadArray([], __read(result), false), __read(e.result), false); }, [])
            };
    }
};
exports.getStandardError = getStandardError;
var getExceptionError = function (e) {
    if ((0, exports.isAxiosError)(e)) {
        return {
            type: 'axios',
            e: e
        };
    }
    else if ((0, exports.isCompositeError)(e)) {
        return {
            type: 'composite',
            e: e
        };
    }
    else if ((0, exports.isInvokableError)(e)) {
        return {
            type: 'invokable',
            e: e
        };
    }
    return {
        type: 'any',
        e: e
    };
};
exports.getExceptionError = getExceptionError;
var isAxiosError = function (error) {
    return error.request !== undefined && error.response !== undefined;
};
exports.isAxiosError = isAxiosError;
var isCompositeError = function (error) {
    return error.compositeResponses !== undefined;
};
exports.isCompositeError = isCompositeError;
var isInvokableError = function (error) {
    return Array.isArray(error) && error.length > 0 && error[0].actionName !== undefined;
};
exports.isInvokableError = isInvokableError;
