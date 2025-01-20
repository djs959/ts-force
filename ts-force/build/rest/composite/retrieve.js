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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.compositeRetrieve = exports.queryAllComposite = void 0;
var _1 = require(".");
var __1 = require("../..");
/**
 * Uses Composite chaining to retrieve up to 10k records in a single request.
 *    Much more efficient for large queries.  Minor performance hit for single queries returning
 * @experimental
 * @param qry: The query, or the next URL to retrieve
 * @param restInstance: Optional rest instance to run query against
 */
var queryAllComposite = function (query, opts) { return __awaiter(void 0, void 0, void 0, function () {
    var restInstance, allRows, nextUrl, client, comp, reqUri, response, newNextUrl, records, i, subResponse, subReq, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                opts = opts || {};
                restInstance = opts.restInstance, allRows = opts.allRows, nextUrl = opts.nextUrl;
                client = restInstance || new __1.Rest();
                comp = new _1.Composite(client);
                if (nextUrl) {
                    // bit of a hack... should work but refactor ASAP
                    reqUri = nextUrl;
                }
                else {
                    reqUri = "/services/data/v".concat(restInstance.config.version.toFixed(1), "/").concat(opts.allRows ? 'queryAll' : 'query', "?q=").concat(encodeURI(query));
                }
                comp.addRequest({
                    referenceId: 'req1',
                    url: reqUri,
                    method: 'GET',
                });
                comp.addRequest({
                    referenceId: 'req2',
                    url: '@{req1.nextRecordsUrl}',
                    method: 'GET',
                });
                comp.addRequest({
                    referenceId: 'req3',
                    url: '@{req2.nextRecordsUrl}',
                    method: 'GET',
                });
                comp.addRequest({
                    referenceId: 'req4',
                    url: '@{req3.nextRecordsUrl}',
                    method: 'GET',
                });
                comp.addRequest({
                    referenceId: 'req5',
                    url: '@{req4.nextRecordsUrl}',
                    method: 'GET',
                });
                return [4 /*yield*/, comp.send()];
            case 1:
                response = _b.sent();
                newNextUrl = null;
                records = [];
                for (i = 0; i < response.compositeResponse.length; i++) {
                    subResponse = response.compositeResponse[i];
                    subReq = comp.compositeRequest[i];
                    if (subResponse.httpStatusCode === 400 &&
                        Array.isArray(subResponse.body) &&
                        subResponse.body.length &&
                        subResponse.body[0].message.indexOf('Invalid reference specified') >= 0) {
                        break;
                    }
                    else if (subResponse.httpStatusCode >= 300) {
                        // some other error happened
                        throw { request: subReq, response: subResponse };
                    }
                    records = __spreadArray(__spreadArray([], __read(records), false), __read(subResponse.body.records), false);
                    newNextUrl = subResponse.body.nextRecordsUrl;
                }
                if (!newNextUrl) return [3 /*break*/, 3];
                _a = [__spreadArray([], __read(records), false)];
                return [4 /*yield*/, (0, exports.queryAllComposite)(null, __assign(__assign({}, opts), { nextUrl: newNextUrl }))];
            case 2:
                // go again... this could probably be more efficent by looking at the total number of req
                records = __spreadArray.apply(void 0, _a.concat([__read.apply(void 0, [(_b.sent())]), false]));
                _b.label = 3;
            case 3: return [2 /*return*/, records];
        }
    });
}); };
exports.queryAllComposite = queryAllComposite;
/**
 *  Combines multiple RestObject "retrieve" calls using Composite Batch.
 * @param {...{ [K in keyof T]: SObjectStatic<T[K]> }} sObjects: Accepts a tuple of SObject types you wish to query against
 * @returns A function which can be used to build a query.
 *    For each Object you passed in above, pass in a SOQL query, in the form of a string or a function (fields: FieldResolver) => SOQLQueryParams.
 *    This function returns a tuple of CompositeBatchResult<QueryResponse<T>> in the order in which RestObjects were passed into the parent function.
 * @example
 * ```typescript
 * let allResults = await compositeRetrieve(Account, Contact, User)(
 *   f => ({select: f.select('id','accountNumber'), limit: 4000}),  // f: FieldResolver<Account>
 *   f => ({select: f.select('id','firstName', 'email')}),           // f: FieldResolver<Contact>
 *   'SELECT Id FROM User'  // raw SOQL strings are allowed as well
 * );
 *
 * if(results[0].statusCode){
 *   console.log(allResults[0].result.records);  //Accounts
 * }
 *
 * allResults[1]; //CompositeBatchResult<QueryResponse<Contacts>>
 * allResults[2]; //CompositeBatchResult<QueryResponse<Users>>
 * // allResults[3] will yield type error
 * ```
 */
var compositeRetrieve = function () {
    var sObjects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sObjects[_i] = arguments[_i];
    }
    return function () {
        var queryFunctions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            queryFunctions[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var c, queryResults, nextRecordQueries, cN, nextReq;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = new _1.CompositeBatch();
                        queryResults = [];
                        nextRecordQueries = [];
                        sObjects.map(function (sObject, i) {
                            var qryFunc = queryFunctions[i];
                            var qry;
                            if (typeof qryFunc === 'string') {
                                qry = queryFunctions;
                            }
                            else {
                                qry = (0, __1.buildQuery)(sObject, qryFunc);
                            }
                            var handleResults = function (results) {
                                if ((0, _1.isCompositeBatchFailResult)(results)) {
                                    queryResults[i] = results;
                                }
                                else {
                                    var data = results.result.records.map(function (sob) {
                                        return sObject.fromSFObject(sob);
                                    });
                                    if (queryResults[i]) {
                                        queryResults[i] = __spreadArray(__spreadArray([], __read(data), false), __read(queryResults[i]), false);
                                    }
                                    else {
                                        queryResults[i] = data;
                                    }
                                    if (!results.result.done) {
                                        nextRecordQueries.push({
                                            nextRecordsUrl: results.result.nextRecordsUrl,
                                            handleResults: handleResults,
                                        });
                                    }
                                }
                            };
                            c.addQuery(qry, handleResults);
                        });
                        return [4 /*yield*/, c.send()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!nextRecordQueries.length) return [3 /*break*/, 4];
                        cN = new _1.CompositeBatch();
                        nextReq = void 0;
                        while ((nextReq = nextRecordQueries.pop())) {
                            cN.addQueryMore(nextReq.nextRecordsUrl, nextReq.handleResults);
                        }
                        return [4 /*yield*/, cN.send()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, queryResults];
                }
            });
        });
    };
};
exports.compositeRetrieve = compositeRetrieve;
