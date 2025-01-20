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
exports.RestObject = void 0;
var composite_1 = require("./composite");
var rest_1 = require("./rest");
var sObjectDecorators_1 = require("./sObjectDecorators");
var sObject_1 = require("./sObject");
var errors_1 = require("./errors");
var calendarDate_1 = require("../utils/calendarDate");
var NAME_MAP_CACHE = new Map();
/**
 * Abstract Base class which provides DML to Generated SObjects
 * TODO: Need some way to support multiple configurations
 * @export
 * @abstract
 * @class RestObject
 * @extends {SObject}
 */
var RestObject = /** @class */ (function (_super) {
    __extends(RestObject, _super);
    function RestObject(type, client) {
        var _this = _super.call(this, type, client) || this;
        _this._modified = new Set();
        // handler used when proxied
        _this.safeUpdateProxyHandler = {
            set: function (obj, key, value) {
                obj[key] = value;
                if (typeof key === 'string') {
                    var decorator = (0, sObjectDecorators_1.getSFieldProps)(obj, key);
                    if (decorator && decorator.updateable) {
                        obj._modified.add(decorator.apiName);
                    }
                }
                return true;
            },
        };
        _this.handleCompositeUpdateResult = function (result) {
            _this.id = result.body.id;
        };
        _this.handleCompositeGetResult = function (result) {
            _this.mapFromQuery(result.body);
        };
        _this.handleCompositeBatchGetResult = function (result) {
            _this.mapFromQuery(result.result);
        };
        /**
         * Advanced method used to set a modified API key of a field to send on update
         * @param keys: keys of the object to set the associated field for
         * @memberof RestObject
         */
        _this.setModified = function (keys) {
            keys.forEach(function (key) {
                if (typeof key === 'string') {
                    var decorator = (0, sObjectDecorators_1.getSFieldProps)(_this, key);
                    if (decorator) {
                        _this._modified.add(decorator.apiName);
                    }
                }
            });
        };
        _this._client = client || new rest_1.Rest();
        return _this;
    }
    RestObject.prototype.initObject = function (fields) {
        var _a;
        if (fields) {
            if (fields instanceof RestObject) {
                this._modified = (_a = fields._modified) !== null && _a !== void 0 ? _a : new Set();
            }
            else {
                this.setModified(Object.keys(fields));
            }
        }
        Object.assign(this, fields);
    };
    // returns ALL records of a query
    RestObject.query = function (type, qry, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var restInstance, allRows, useComposite, _a, allRecords, client, records, response, records_1, records_1_1, rec, _b, _c, _d, _i, prop, data, innerResponse, innerRecords, e_1_1, sobs;
            var e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        opts = opts || {};
                        restInstance = opts.restInstance, allRows = opts.allRows, useComposite = opts.useComposite, _a = opts.allRecords, allRecords = _a === void 0 ? 'parent-only' : _a;
                        client = restInstance || new rest_1.Rest();
                        records = [];
                        if (!useComposite) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, composite_1.queryAllComposite)(qry, { restInstance: client, allRows: allRows })];
                    case 1:
                        records = _f.sent();
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, client.query(qry, allRows)];
                    case 3:
                        response = _f.sent();
                        records = response.records;
                        if (!(allRecords === true || allRecords === 'parent-only')) return [3 /*break*/, 6];
                        _f.label = 4;
                    case 4:
                        if (!(!response.done && response.nextRecordsUrl)) return [3 /*break*/, 6];
                        return [4 /*yield*/, client.queryMore(response)];
                    case 5:
                        response = _f.sent();
                        records = records.concat(response.records);
                        return [3 /*break*/, 4];
                    case 6:
                        if (!(allRecords === true)) return [3 /*break*/, 18];
                        _f.label = 7;
                    case 7:
                        _f.trys.push([7, 16, 17, 18]);
                        records_1 = __values(records), records_1_1 = records_1.next();
                        _f.label = 8;
                    case 8:
                        if (!!records_1_1.done) return [3 /*break*/, 15];
                        rec = records_1_1.value;
                        _b = rec;
                        _c = [];
                        for (_d in _b)
                            _c.push(_d);
                        _i = 0;
                        _f.label = 9;
                    case 9:
                        if (!(_i < _c.length)) return [3 /*break*/, 14];
                        _d = _c[_i];
                        if (!(_d in _b)) return [3 /*break*/, 13];
                        prop = _d;
                        if (!rec.hasOwnProperty(prop)) return [3 /*break*/, 13];
                        data = rec[prop];
                        if (!(data && typeof data === 'object' && 'records' in data && 'done' in data && 'nextRecordsUrl' in data)) return [3 /*break*/, 13];
                        innerResponse = data;
                        innerRecords = data.records;
                        _f.label = 10;
                    case 10:
                        if (!(!innerResponse.done && innerResponse.nextRecordsUrl)) return [3 /*break*/, 12];
                        return [4 /*yield*/, client.queryMore(innerResponse)];
                    case 11:
                        innerResponse = _f.sent();
                        innerRecords = innerRecords.concat(innerResponse.records);
                        return [3 /*break*/, 10];
                    case 12:
                        rec[prop].records = innerRecords;
                        _f.label = 13;
                    case 13:
                        _i++;
                        return [3 /*break*/, 9];
                    case 14:
                        records_1_1 = records_1.next();
                        return [3 /*break*/, 8];
                    case 15: return [3 /*break*/, 18];
                    case 16:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 18];
                    case 17:
                        try {
                            if (records_1_1 && !records_1_1.done && (_e = records_1.return)) _e.call(records_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 18:
                        sobs = records.map(function (rec) {
                            var sob = new type();
                            sob._client = client;
                            sob.mapFromQuery(rec);
                            return sob;
                        });
                        return [2 /*return*/, sobs];
                }
            });
        });
    };
    RestObject.getPropertiesMeta = function (type) {
        var properties = {};
        var sob = new type();
        for (var i in sob) {
            // clean properties
            if (sob.hasOwnProperty(i)) {
                var sFieldProps = (0, sObjectDecorators_1.getSFieldProps)(sob, i);
                if (sFieldProps) {
                    properties[i] = sFieldProps;
                }
            }
        }
        return properties;
    };
    RestObject.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.id == null) {
                            throw new Error('Must have Id to refresh!');
                        }
                        return [4 /*yield*/, this._client.request.get("".concat(this.attributes.url, "/").concat(this.id))];
                    case 1:
                        response = (_a.sent()).data;
                        this.mapFromQuery(response);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * inserts the sobject to Salesfroce
     *
     * @param {boolean} [refresh] Set to true to apply GET after update
     * @returns {Promise<void>}
     * @memberof RestObject
     */
    RestObject.prototype.insert = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var refresh, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = opts || {};
                        refresh = opts.refresh;
                        if (!(refresh === true)) return [3 /*break*/, 1];
                        return [2 /*return*/, this.insertComposite()];
                    case 1: return [4 /*yield*/, this._client.request.post("".concat(this.attributes.url, "/"), this.toJson({ dmlMode: 'insert' }))];
                    case 2:
                        response = (_a.sent()).data;
                        this.id = response.id;
                        this._modified.clear();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this];
                }
            });
        });
    };
    RestObject.prototype.insertComposite = function () {
        return __awaiter(this, void 0, void 0, function () {
            var insertCompositeRef, composite, compositeResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        insertCompositeRef = 'newObject';
                        composite = new composite_1.Composite(this._client).addRequest({
                            method: 'POST',
                            url: this.attributes.url,
                            referenceId: insertCompositeRef,
                            body: this.toJson({ dmlMode: 'insert' }),
                        }, this.handleCompositeUpdateResult);
                        composite.addRequest({
                            method: 'GET',
                            url: "".concat(this.attributes.url, "/@{").concat(insertCompositeRef, ".id}"),
                            referenceId: 'getObject',
                        }, this.handleCompositeGetResult);
                        return [4 /*yield*/, composite.send()];
                    case 1:
                        compositeResult = _a.sent();
                        this.handleCompositeErrors(compositeResult);
                        this._modified.clear();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Updates the sObject on Salesforce
     * @param {boolean} [refresh] Set to true to apply GET after update
     * @returns {Promise<void>}
     * @memberof RestObject
     */
    RestObject.prototype.update = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = opts || {};
                        if (this.id == null) {
                            throw new Error('Must have Id to update!');
                        }
                        if (!(opts.refresh === true)) return [3 /*break*/, 1];
                        return [2 /*return*/, this.updateComposite(opts.sendAllFields)];
                    case 1: return [4 /*yield*/, this._client.request.patch("".concat(this.attributes.url, "/").concat(this.id), this.toJson({ dmlMode: opts.sendAllFields ? 'update' : 'update_modified_only' }))];
                    case 2:
                        _a.sent();
                        this._modified.clear();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this];
                }
            });
        });
    };
    RestObject.prototype.updateComposite = function (sendAllFields) {
        if (sendAllFields === void 0) { sendAllFields = false; }
        return __awaiter(this, void 0, void 0, function () {
            var batchRequest, batchResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        batchRequest = new composite_1.CompositeBatch(this._client).addUpdate(this, { sendAllFields: sendAllFields });
                        batchRequest.addGet(this, this.handleCompositeBatchGetResult);
                        return [4 /*yield*/, batchRequest.send()];
                    case 1:
                        batchResponse = _a.sent();
                        this.handleCompositeBatchErrors(batchResponse);
                        this._modified.clear();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Deletes the Object from Salesforce
     *
     * @returns {Promise<DMLResponse>}
     * @memberof RestObject
     */
    RestObject.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.id == null) {
                            throw new Error('Must have Id to Delete!');
                        }
                        return [4 /*yield*/, this._client.request.delete("".concat(this.attributes.url, "/").concat(this.id))];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RestObject.prototype.toJson = function (opts) {
        var hideAttributes = opts.hideAttributes, sendParentObj = opts.sendParentObj, sendChildObj = opts.sendChildObj, dmlMode = opts.dmlMode;
        var data = {};
        // loop each property
        for (var i in this) {
            // clean properties
            if (!this.hasOwnProperty(i) || this[i] === void 0) {
                continue;
            }
            if (i.toLowerCase() === 'attributes' && !hideAttributes) {
                data[i] = this[i];
            }
            var sFieldProps = (0, sObjectDecorators_1.getSFieldProps)(this, i);
            if (!sFieldProps) {
                continue;
            }
            var fType = !sFieldProps.reference ? 'FIELD' : sFieldProps.childRelationship === true ? 'CHILD' : 'PARENT';
            switch (fType) {
                case 'CHILD':
                    if (sendChildObj) {
                        data[sFieldProps.apiName] = {
                            records: this[i].map(function (obj) { return obj.toJson(opts); }),
                        };
                    }
                    break;
                case 'PARENT':
                    if (sendParentObj) {
                        data[sFieldProps.apiName] = this[i] ? this[i].toJson(opts) : null;
                    }
                    else {
                        // external ID relation support
                        if (this[i] && this[i + 'Id'] === void 0) {
                            var relatedSob = this[i];
                            data[sFieldProps.apiName] = relatedSob.prepareAsRelationRecord();
                        }
                    }
                    break;
                case 'FIELD':
                    var canSend = dmlMode === 'all' ||
                        (dmlMode === 'insert' && sFieldProps.createable) ||
                        (dmlMode === 'update' && sFieldProps.updateable) ||
                        (dmlMode === 'update_modified_only' && sFieldProps.updateable && this._modified.has(sFieldProps.apiName));
                    if (canSend) {
                        data[sFieldProps.apiName] = this[i] ? this.toSFValueFormat(sFieldProps, this[i]) : this[i];
                    }
                    break;
            }
        }
        return data;
    };
    // helper to get values back in salesforce format
    RestObject.prototype.toSFValueFormat = function (sFieldProps, value) {
        if (sFieldProps.salesforceType === sObjectDecorators_1.SalesforceFieldType.MULTIPICKLIST) {
            return value.join(';');
        }
        else if (sFieldProps.salesforceType === sObjectDecorators_1.SalesforceFieldType.DATE) {
            return (0, calendarDate_1.calendarToString)(value);
        }
        else {
            return value;
        }
    };
    RestObject.prototype.prepareAsRelationRecord = function () {
        var data = {};
        // otherwise, find first external Id field
        for (var i in this) {
            // clean properties
            if (this.hasOwnProperty(i)) {
                var sFieldProps = (0, sObjectDecorators_1.getSFieldProps)(this, i);
                if (sFieldProps && sFieldProps.externalId && this[i]) {
                    data[sFieldProps.apiName] = this[i];
                    return data;
                }
            }
        }
        return undefined;
    };
    // copies data from a json object to restobject
    RestObject.prototype.mapFromQuery = function (data) {
        var _this = this;
        // create a map of lowercase API names -> sob property names
        var apiNameMap = this.getNameMapping();
        var _loop_1 = function (i) {
            if (data.hasOwnProperty(i)) {
                // translate prop name & get decorator
                var sobPropName_1 = apiNameMap.get(i.toLowerCase());
                var sFieldProps = (0, sObjectDecorators_1.getSFieldProps)(this_1, sobPropName_1);
                if (!sFieldProps) {
                    return "continue";
                }
                if (data[i] === null) {
                    if (sFieldProps.childRelationship === true) {
                        this_1[sobPropName_1] = [];
                    }
                    else {
                        this_1[sobPropName_1] = null;
                    }
                }
                else if (!sFieldProps.reference) {
                    var val = data[i];
                    if (sFieldProps.salesforceType === sObjectDecorators_1.SalesforceFieldType.DATETIME) {
                        val = new Date(val);
                    }
                    else if (sFieldProps.salesforceType === sObjectDecorators_1.SalesforceFieldType.DATE) {
                        val = (0, calendarDate_1.getCalendarDate)(val);
                    }
                    else if (sFieldProps.salesforceType === sObjectDecorators_1.SalesforceFieldType.MULTIPICKLIST) {
                        val = val.split(';');
                    }
                    this_1[sobPropName_1] = val;
                }
                else {
                    // reference type
                    var type_1 = sFieldProps.reference();
                    if (sFieldProps.childRelationship === true) {
                        // child type, map each record
                        this_1[sobPropName_1] = [];
                        if (data[i]) {
                            var records = Array.isArray(data[i]) ? data[i] : data[i].records;
                            records.forEach(function (record) {
                                var typeInstance = new type_1();
                                typeInstance._client = _this._client;
                                _this[sobPropName_1].push(typeInstance.mapFromQuery(record));
                            });
                        }
                    }
                    else {
                        var typeInstance = new type_1();
                        typeInstance._client = this_1._client;
                        // parent type.  Map data
                        this_1[sobPropName_1] = typeInstance.mapFromQuery(data[i]);
                    }
                }
            }
        };
        var this_1 = this;
        // loop through returned data
        for (var i in data) {
            _loop_1(i);
        }
        this._modified.clear();
        return this;
    };
    // returns a mapping of API Name (lower case) -> Property Name
    RestObject.prototype.getNameMapping = function () {
        if (this.__UUID && NAME_MAP_CACHE.has(this.__UUID)) {
            return NAME_MAP_CACHE.get(this.__UUID);
        }
        var apiNameMap = new Map();
        for (var i in this) {
            // clean properties
            if (this.hasOwnProperty(i)) {
                var sFieldProps = (0, sObjectDecorators_1.getSFieldProps)(this, i);
                if (sFieldProps) {
                    apiNameMap.set(sFieldProps.apiName.toLowerCase(), i);
                }
                else {
                    apiNameMap.set(i, i);
                }
            }
        }
        if (this.__UUID) {
            NAME_MAP_CACHE.set(this.__UUID, apiNameMap);
        }
        return apiNameMap;
    };
    RestObject.prototype.handleCompositeErrors = function (compositeResult) {
        var errors = [];
        compositeResult.compositeResponse.forEach(function (batchResult) {
            if (batchResult.httpStatusCode >= 300) {
                var statusCode = batchResult.httpStatusCode, result = batchResult.body;
                errors.push({
                    statusCode: statusCode,
                    result: result,
                });
            }
        });
        if (errors.length) {
            var e = new errors_1.CompositeError('Failed to execute all Composite Batch Requests');
            e.compositeResponses = errors;
            throw e;
        }
    };
    RestObject.prototype.handleCompositeBatchErrors = function (batchResponse) {
        if (batchResponse.hasErrors) {
            var errors_2 = [];
            batchResponse.results.forEach(function (batchResult) {
                if (batchResult.statusCode >= 300) {
                    errors_2.push(batchResult);
                }
            });
            var e = new errors_1.CompositeError('Failed to execute all Composite Batch Requests');
            e.compositeResponses = errors_2;
            throw e;
        }
    };
    return RestObject;
}(sObject_1.SObject));
exports.RestObject = RestObject;
