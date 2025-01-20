"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeBatch = exports.isCompositeBatchFailResult = exports.isCompositeBatchSuccessResult = void 0;
var rest_1 = require("../rest");
var isCompositeBatchSuccessResult = function (result) {
    return result.statusCode < 300;
};
exports.isCompositeBatchSuccessResult = isCompositeBatchSuccessResult;
var isCompositeBatchFailResult = function (result) {
    return result.statusCode >= 300;
};
exports.isCompositeBatchFailResult = isCompositeBatchFailResult;
var CompositeBatch = /** @class */ (function () {
    /**
     * Creates a composite batch to allow multiple requests to be sent in one round-trip
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    function CompositeBatch(client) {
        this.batchRequests = [];
        this.callbacks = [];
        this.client = client || new rest_1.Rest();
    }
    /**
     * Sends all added requests
     * @returns Promise<BatchResponse> the completed response data.  Should be returned in order added
     */
    CompositeBatch.prototype.send = function () {
        return __awaiter(this, void 0, void 0, function () {
            var batchResponses, _a, _b, payload, batchResponse, i, callback, e_1_1, hasErrors, results, batchResponses_1, batchResponses_1_1, br;
            var e_1, _c, e_2, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        batchResponses = [];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        _a = __values(this.createPayloads()), _b = _a.next();
                        _e.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        payload = _b.value;
                        return [4 /*yield*/, this.client.request.post("/services/data/".concat(this.client.version, "/composite/batch"), payload)];
                    case 3:
                        batchResponse = (_e.sent()).data;
                        batchResponses.push(batchResponse);
                        for (i = 0; i < this.callbacks.length; i++) {
                            callback = this.callbacks[i];
                            if (callback !== undefined) {
                                callback(batchResponse.results[i]);
                            }
                        }
                        _e.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        hasErrors = false;
                        results = [];
                        try {
                            for (batchResponses_1 = __values(batchResponses), batchResponses_1_1 = batchResponses_1.next(); !batchResponses_1_1.done; batchResponses_1_1 = batchResponses_1.next()) {
                                br = batchResponses_1_1.value;
                                if (br.hasErrors) {
                                    hasErrors = true;
                                }
                                results = results.concat(br.results);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (batchResponses_1_1 && !batchResponses_1_1.done && (_d = batchResponses_1.return)) _d.call(batchResponses_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        return [2 /*return*/, { hasErrors: hasErrors, results: results }];
                }
            });
        });
    };
    /**
     * Adds request to retrieve an SObject
     * @param  {RestObject} obj sObject to retrieve
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    CompositeBatch.prototype.addGet = function (obj, callback) {
        var request = {
            method: 'GET',
            url: "".concat(this.client.version, "/sobjects/").concat(obj.attributes.type, "/").concat(obj.id)
        };
        this.addBatchRequest(request, callback);
        return this;
    };
    /**
     * Adds request to update an SObject
     * @param  {RestObject} obj sObject to update
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    CompositeBatch.prototype.addUpdate = function (obj, opts) {
        opts = opts || {};
        var sobData = obj.toJson({ dmlMode: opts.sendAllFields ? 'update' : 'update_modified_only' });
        var request = {
            method: 'PATCH',
            url: "".concat(this.client.version, "/sobjects/").concat(obj.attributes.type, "/").concat(obj.id),
            richInput: sobData
        };
        this.addBatchRequest(request, opts.callback);
        return this;
    };
    /**
     * Adds request to insert an SObject
     * @param  {RestObject} obj sObject to insert
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    CompositeBatch.prototype.addInsert = function (obj, callback) {
        var request = {
            method: 'POST',
            url: "".concat(this.client.version, "/sobjects/").concat(obj.attributes.type, "/"),
            richInput: obj.toJson({ dmlMode: 'insert' })
        };
        this.addBatchRequest(request, callback);
        return this;
    };
    /**
     * Adds request to delete an SObject
     * @param  {RestObject} obj sObject to insert
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    CompositeBatch.prototype.addDelete = function (obj, callback) {
        var request = {
            method: 'DELETE',
            url: "".concat(this.client.version, "/sobjects/").concat(obj.attributes.type, "/").concat(obj.id)
        };
        this.addBatchRequest(request, callback);
        return this;
    };
    /**
     * Adds a query request
     * @param  {string} query the SOQL query to execute
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    CompositeBatch.prototype.addQuery = function (query, callback) {
        var qryString = encodeURIComponent(query);
        var request = {
            method: 'GET',
            url: "".concat(this.client.version, "/query?q=").concat(qryString)
        };
        this.addBatchRequest(request, callback);
        return this;
    };
    /**
     * Adds a query request
     * @param  {string} nextRecordsUrl next url to query
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    CompositeBatch.prototype.addQueryMore = function (nextRecordsUrl, callback) {
        var request = {
            method: 'GET',
            url: nextRecordsUrl
        };
        this.addBatchRequest(request, callback);
        return this;
    };
    CompositeBatch.prototype.addBatchRequest = function (request, callback) {
        this.batchRequests.push(request);
        this.callbacks.push(callback);
    };
    CompositeBatch.prototype.createPayloads = function () {
        var batches = [], i = 0, n = this.batchRequests.length;
        while (i < n) {
            var payload = {
                batchRequests: this.batchRequests.slice(i, i += 25)
            };
            batches.push(payload);
        }
        return batches;
    };
    return CompositeBatch;
}());
exports.CompositeBatch = CompositeBatch;
