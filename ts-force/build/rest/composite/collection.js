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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeCollection = void 0;
var rest_1 = require("../rest");
/* requires at least version v42 */
var CompositeCollection = /** @class */ (function () {
    /**
     * Creates a client that can send "Collection" requests to salesforce.
     * Collections request run in a single execution context
     * API version must be >= v42.0
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    function CompositeCollection(client) {
        var _this = this;
        /**
         * Inserts up to 200 SObjects.
         * @param  {RestObject[]} sobs SObjects to Insert
         * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
         * @param  {boolean} setId? if set to true, the passed SObject Id's will be updated when request if completed
         * @returns Promise<SaveResult[]> in order of pass SObjects
         */
        this.insert = function (sobs, allOrNothing, setId) { return __awaiter(_this, void 0, void 0, function () {
            var dmlSobs, payload, saveResults, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dmlSobs = sobs.map(function (sob) {
                            var dmlSob = sob.toJson({ dmlMode: "insert" });
                            return dmlSob;
                        });
                        payload = {
                            records: dmlSobs,
                            allOrNone: allOrNothing !== false,
                        };
                        return [4 /*yield*/, this.client.request.post(this.endpoint, payload)];
                    case 1:
                        saveResults = (_a.sent())
                            .data;
                        if (setId !== false) {
                            for (i = 0; i < saveResults.length; i++) {
                                sobs[i].id = saveResults[i].id;
                            }
                        }
                        this.resetModified(sobs, saveResults);
                        return [2 /*return*/, saveResults];
                }
            });
        }); };
        /**
         * Updates up to 200 SObjects.
         * @param  {RestObject[]} sobs SObjects to Update
         * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
         * @returns Promise<SaveResult[]> in order of pass SObjects
         */
        this.update = function (sobs, opts) { return __awaiter(_this, void 0, void 0, function () {
            var dmlSobs, payload, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = opts || {};
                        dmlSobs = sobs.map(function (sob) {
                            var dmlSob = sob.toJson({
                                dmlMode: opts.sendAllFields ? "update" : "update_modified_only",
                            });
                            dmlSob["Id"] = sob.id;
                            return dmlSob;
                        });
                        payload = {
                            records: dmlSobs,
                            allOrNone: opts.allOrNothing !== false,
                        };
                        return [4 /*yield*/, this.client.request.patch(this.endpoint, payload)];
                    case 1:
                        results = (_a.sent()).data;
                        // clear out modified
                        this.resetModified(sobs, results);
                        return [2 /*return*/, results];
                }
            });
        }); };
        /**
         * Deletes up to 200 SObjects.
         * @param  {RestObject[]} sobs SObjects to Delete
         * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
         * @returns Promise<BaseResult[]> in order of pass SObjects
         */
        this.delete = function (sobs, allOrNothing) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allOrNothing = allOrNothing !== false;
                        return [4 /*yield*/, this.client.request.delete("".concat(this.endpoint, "?ids=").concat(sobs.map(function (s) { return s.id; }).join(","), "&allOrNone=").concat(allOrNothing !== false))];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        }); };
        this.resetModified = function (sobs, results) {
            // clear out modified
            for (var i = 0; i < results.length; i++) {
                if (results[i].success) {
                    sobs[i]._modified.clear();
                }
            }
        };
        this.client = client || new rest_1.Rest();
        this.endpoint = "/services/data/".concat(this.client.version, "/composite/sobjects");
    }
    return CompositeCollection;
}());
exports.CompositeCollection = CompositeCollection;
