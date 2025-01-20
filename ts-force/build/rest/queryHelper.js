"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInValues = exports.generateSelect = void 0;
/**
 * @deprecated: Use buildQuery() instead
 * Helper for generating field strings for SELECT clauses
 * @param  {(string|SFieldProperties)[]} fields 1 or more fields to add to select
 * @param  {(string|SFieldProperties)|(string|SFieldProperties} relationships? 0 or more relationships to append to each field.
 * @returns string of formatted fields to use in SELECT clause.  eg: `Parent1__.Id, Parent__r.Name`
 */
var generateSelect = function (fields, relationships) {
    fields = fields.filter(function (f) { return typeof f === 'string' ? true : !f.reference; }); // get rid of any relationship fields as they are not valid
    var fieldNames = fields.map(function (f) { return typeof f === 'string' ? f : f.apiName; });
    if (relationships) {
        var relationshipName_1;
        if (relationships instanceof Array) {
            relationshipName_1 = relationships.map(function (f) { return typeof f === 'string' ? f : f.apiName; }).join('.');
        }
        else {
            relationshipName_1 = typeof relationships === 'string' ? relationships : relationships.apiName;
        }
        fieldNames = fieldNames.map(function (f) { return "".concat(relationshipName_1, ".").concat(f); });
    }
    return fieldNames.join(', ');
};
exports.generateSelect = generateSelect;
/**
 * @deprecated: Use buildQuery() instead
 * Helper for generating the value portion of an IN (value) SOQL clause
 * @param  {T[]} objs Objects with values to operation on
 * @param  {(obj:T)=>string} valueSelector? optional function that will select the value.  If blank the object itself will be use
 * @returns string formatted for a select values. eg: `'abc','123'`
 */
var generateInValues = function (objs, valueSelector) {
    var values;
    if (valueSelector) {
        values = objs.map(valueSelector);
    }
    else {
        values = objs;
    }
    // unique,map,join
    return values.filter(function (item, i, ar) { return ar.indexOf(item) === i; }).map(function (v) { return "'".concat(v, "'"); }).join(', ');
};
exports.generateInValues = generateInValues;
