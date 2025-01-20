"use strict";
/** Mapping type & helpers for converting Salesforce Date types into a object that's easier to work with.
 *  This format was chosen to be as compatible as possible with the standard Date object and other popular libraries
 *   Note: Month is 0 based... Year and Date are 1 based
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarToString = exports.calendarToDateObj = exports.getCalendarDate = void 0;
/**
*  Creates a new CalendarDate object.
*
* @param {(Date | string | Momentish)} [d] Optional Date, String (in the format "yyyy-mm-dd" where month is 1 based) or Moment.
*   If no value is passed it, will use `new Date()`.
* @returns {CalendarDate}
*/
var getCalendarDate = function (d) {
    if (!d) {
        d = new Date();
    }
    if (d instanceof Date) {
        return { year: d.getFullYear(), month: d.getMonth(), date: d.getDate() };
    }
    else if (d instanceof Object) {
        if (isMomentish(d)) {
            return { year: d.year(), month: d.month(), date: d.date() };
        }
        throw new Error('Not a valid object.  Must have year(), month(), date() functions');
    }
    else {
        var parts = d.split('-').map(function (p) { return parseInt(p, 10); });
        if (parts.length !== 3 || parts.find(function (p) { return isNaN(p); })) {
            throw new Error('Not a valid CalendarDate string.  Required Format: yyyy-mm-dd');
        }
        return { year: parts[0], month: parts[1] - 1, date: parts[2] };
    }
};
exports.getCalendarDate = getCalendarDate;
/**
*  Converts a CalendarDate to a Javascript Date obj.
*
* @param {CalendarDate} [d] CalendarDate to convert
* @returns {Date}
*/
var calendarToDateObj = function (d) {
    if (!d) {
        return null;
    }
    return new Date(d.year, d.month, d.date);
};
exports.calendarToDateObj = calendarToDateObj;
/**
*  Converts a CalendarDate to a string in the format "yyyy-mm-dd". (where month is 1 based)
* @param {CalendarDate} [d] CalendarDate to convert
* @returns {Date}
*/
var calendarToString = function (d) {
    if (!d) {
        return null;
    }
    return "".concat(d.year, "-").concat(('0' + (d.month + 1)).slice(-2), "-").concat(('0' + d.date).slice(-2));
};
exports.calendarToString = calendarToString;
function isMomentish(arg) {
    return arg.year !== undefined && arg.month !== undefined && arg.date !== undefined;
}
