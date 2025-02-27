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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFormData = exports.requestAccessToken = exports.getAuthorizationUrl = void 0;
var axios_1 = require("axios");
/**
 * Generates the URL to initiate the OAuth 2.0 web server flow,
*/
function getAuthorizationUrl(opts) {
    //set defaults
    opts = __assign({ instanceUrl: 'https://login.salesforce.com', response_type: 'code' }, opts);
    var instanceUrl = opts.instanceUrl, uriParams = __rest(opts, ["instanceUrl"]);
    var params = Object.keys(uriParams).map(function (key) {
        var value = uriParams[key];
        if (Array.isArray(value)) {
            value = value.join(' ');
        }
        return "".concat(key, "=").concat(encodeURIComponent(value));
    });
    return "".concat(instanceUrl, "/services/oauth2/authorize?").concat(params.join('&'));
}
exports.getAuthorizationUrl = getAuthorizationUrl;
/**
 * Retrieves the access token
*/
function requestAccessToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var instanceUrl, bodyParams, reqParam, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //defaults
                    params = __assign({ grant_type: 'authorization_code' }, params);
                    instanceUrl = params.instanceUrl, bodyParams = __rest(params, ["instanceUrl"]);
                    reqParam = toFormData(bodyParams);
                    return [4 /*yield*/, axios_1.default.request({
                            url: "".concat(instanceUrl, "/services/oauth2/token"), method: 'POST', data: reqParam, headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            }
                        })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
            }
        });
    });
}
exports.requestAccessToken = requestAccessToken;
function toFormData(obj) {
    return Object.keys(obj)
        .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    })
        .join('&');
}
exports.toFormData = toFormData;
