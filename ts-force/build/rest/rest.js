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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
var axios_1 = require("axios");
var baseConfig_1 = require("../auth/baseConfig");
var utils_1 = require("./utils");
var Rest = /** @class */ (function () {
    /**
     * Constructor
     * @param {BaseConfig} [config] Optional authentication configuration.
     *     If not passed in will return a "singleton" client from the default config
     * @memberof Rest
     */
    function Rest(config) {
        var _this = this;
        this.apiLimit = {
            used: null,
            limit: null,
        };
        if (config) {
            this.config = (0, baseConfig_1.createConfig)(config);
        }
        else {
            if (Rest.defaultInstance &&
                Rest.defaultInstance.config.accessToken === baseConfig_1.DEFAULT_CONFIG.accessToken) {
                return Rest.defaultInstance;
            }
            //should probably be refactored to just happen when the default config is set
            this.config = __assign({}, baseConfig_1.DEFAULT_CONFIG);
            Rest.defaultInstance = this;
        }
        this.version = "v".concat((this.config.version
            ? this.config.version
            : baseConfig_1.DEFAULT_CONFIG.version).toFixed(1));
        this.request = this.config.axiosInstance || axios_1.default.create();
        this.request.defaults.baseURL = "".concat(this.config.instanceUrl);
        this.request.defaults.headers["Authorization"] = "Bearer ".concat(this.config.accessToken);
        this.request.defaults.headers["Content-Type"] = "application/json";
        this.request.defaults.headers["Accept"] = "application/json";
        this.request.defaults.maxContentLength = Infinity;
        this.request.interceptors.response.use(function (response) {
            var limits = (0, utils_1.parseLimitsFromResponse)(response);
            if (limits) {
                _this.apiLimit = limits;
            }
            return response;
        });
    }
    /**
     * @param  {string} apiName the object to get the describe for
     * @returns Promise<SObjectDescribe>
     */
    Rest.prototype.getSObjectDescribe = function (apiName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.get("/services/data/".concat(this.version, "/sobjects/").concat(apiName, "/describe/"))];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    /**
     * Executes any SOQL query
     * @param  {string} query SOQL Query to execute
     * @param  {string} allRows Optional boolean to indicate use of `queryall` endpoint
     * @returns Promise<QueryResponse<T>>
     */
    Rest.prototype.query = function (query, allRows) {
        return __awaiter(this, void 0, void 0, function () {
            var qryString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qryString = encodeURIComponent(query);
                        return [4 /*yield*/, this.request.get("/services/data/".concat(this.version, "/").concat(allRows ? "queryAll" : "query", "?q=").concat(qryString))];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    Rest.prototype.toolingQuery = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qryString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qryString = encodeURIComponent(query);
                        return [4 /*yield*/, this.request.get("/services/data/".concat(this.version, "/tooling/query?q=").concat(qryString))];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    /**
     * Get the next page of a query
     * @param resp the response from the previous query
     * @returns the next page of results
     */
    Rest.prototype.queryMore = function (resp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.get(resp.nextRecordsUrl)];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    /**
     *  Run a SOSL query
     *
     * @template T
     * @param {string} query
     * @returns {Promise<SearchResponse<T>>}
     * @memberof Rest
     */
    Rest.prototype.search = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var qryString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qryString = encodeURIComponent(query);
                        return [4 /*yield*/, this.request.get("/services/data/".concat(this.version, "/search?q=").concat(qryString))];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    /**
     *  Returns Limit information about your orgs current usage
     *   NOTE: Rest Limit usage is updated on every request and can be accessed via `apiLimit` property on this class
     * @returns {Promise<Limits>}
     * @memberof Rest
     */
    Rest.prototype.limits = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.get("/services/data/".concat(this.version, "/limits"))];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    /**
     * Call an Invokable Action
     * @template O output item type
     * @param {string} action Name of invocable action to call.  Namespaces must be prefixed!
     * @param {any[]} inputs The list of inputs to pass in. See Salesforce Documenation
     * @returns {Promise<InvokableResult<O>>}
     * @memberof Rest
     */
    Rest.prototype.invokeAction = function (action, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.post("/services/data/".concat(this.version, "/actions/custom/apex/").concat(action), { inputs: inputs })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.data];
                }
            });
        });
    };
    return Rest;
}());
exports.Rest = Rest;
