"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SObject = exports.SObjectAttributes = void 0;
var baseConfig_1 = require("../auth/baseConfig");
var sObjectDecorators_1 = require("./sObjectDecorators");
var SObjectAttributes = /** @class */ (function () {
    function SObjectAttributes() {
    }
    return SObjectAttributes;
}());
exports.SObjectAttributes = SObjectAttributes;
/* Base SObject */
var SObject = /** @class */ (function () {
    function SObject(type, client) {
        var _a;
        var version = (_a = client === null || client === void 0 ? void 0 : client.version) !== null && _a !== void 0 ? _a : "v".concat(baseConfig_1.DEFAULT_CONFIG.version.toFixed(1));
        this.attributes = new SObjectAttributes();
        this.attributes.type = type;
        this.attributes.url = "/services/data/".concat(version, "/sobjects/").concat(this.attributes.type);
    }
    __decorate([
        (0, sObjectDecorators_1.sField)({ apiName: 'Id', createable: false, updateable: false, required: false, externalId: false, reference: null, childRelationship: false, salesforceType: sObjectDecorators_1.SalesforceFieldType.ID })
    ], SObject.prototype, "id", void 0);
    return SObject;
}());
exports.SObject = SObject;
