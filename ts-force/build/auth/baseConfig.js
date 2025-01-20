"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = exports.setDefaultConfig = exports.DEFAULT_CONFIG = void 0;
exports.DEFAULT_CONFIG = {
    version: 58,
    accessToken: "",
    instanceUrl: "",
};
/**
 * @param  {ConfigParams} params
 */
var setDefaultConfig = function (params) {
    (0, exports.createConfig)(params, exports.DEFAULT_CONFIG);
};
exports.setDefaultConfig = setDefaultConfig;
var createConfig = function (params, config) {
    var c = config
        ? config
        : { version: 50, accessToken: "", instanceUrl: "" };
    c.version = params.version || c.version;
    c.instanceUrl =
        params.instanceUrl !== undefined
            ? params.instanceUrl
            : params.instance_url || "";
    c.accessToken =
        params.accessToken !== undefined
            ? params.accessToken
            : params.access_token || "";
    if (params.axiosInstance)
        c.axiosInstance = params.axiosInstance;
    return c;
};
exports.createConfig = createConfig;
