"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSFieldProps = exports.sField = exports.SFieldProperties = exports.SalesforceFieldType = void 0;
require("reflect-metadata");
var SalesforceFieldType;
(function (SalesforceFieldType) {
    SalesforceFieldType["DATE"] = "date";
    SalesforceFieldType["DATETIME"] = "datetime";
    SalesforceFieldType["BOOLEAN"] = "boolean";
    SalesforceFieldType["DOUBLE"] = "double";
    SalesforceFieldType["INTEGER"] = "integer";
    SalesforceFieldType["CURRENCY"] = "currency";
    SalesforceFieldType["REFERENCE"] = "reference";
    SalesforceFieldType["STRING"] = "string";
    SalesforceFieldType["PICKLIST"] = "picklist";
    SalesforceFieldType["TEXTAREA"] = "textarea";
    SalesforceFieldType["ADDRESS"] = "address";
    SalesforceFieldType["PHONE"] = "phone";
    SalesforceFieldType["URL"] = "url";
    SalesforceFieldType["MULTIPICKLIST"] = "multipicklist";
    SalesforceFieldType["PERCENT"] = "percent";
    SalesforceFieldType["EMAIL"] = "email";
    SalesforceFieldType["INT"] = "int";
    SalesforceFieldType["LOCATION"] = "location";
    SalesforceFieldType["ID"] = "id";
    SalesforceFieldType["BASE64"] = "base64";
    SalesforceFieldType["ANYTYPE"] = "anytype";
    SalesforceFieldType["TIME"] = "time";
    SalesforceFieldType["ENCRYPTEDSTRING"] = "encryptedstring";
    SalesforceFieldType["COMBOBOX"] = "combobox";
})(SalesforceFieldType || (exports.SalesforceFieldType = SalesforceFieldType = {}));
var sFieldMetadataKey = Symbol('sField');
var SFieldProperties = /** @class */ (function () {
    function SFieldProperties() {
        var _this = this;
        // override to string to make it easy to use with query building
        this.toString = function () {
            return _this.apiName;
        };
    }
    return SFieldProperties;
}());
exports.SFieldProperties = SFieldProperties;
function sField(props) {
    return Reflect.metadata(sFieldMetadataKey, props);
}
exports.sField = sField;
function getSFieldProps(target, propertyKey) {
    var prop = Reflect.getMetadata(sFieldMetadataKey, target, propertyKey);
    if (prop) {
        prop = Object.assign(new SFieldProperties(), prop);
    }
    return prop;
}
exports.getSFieldProps = getSFieldProps;
