/** Mapping type & helpers for converting Salesforce Date types into a object that's easier to work with.
 *  This format was chosen to be as compatible as possible with the standard Date object and other popular libraries
 *   Note: Month is 0 based... Year and Date are 1 based
*/
export type CalendarDate = {
    year: number;
    month: number;
    date: number;
};
/**
*  Creates a new CalendarDate object.
*
* @param {(Date | string | Momentish)} [d] Optional Date, String (in the format "yyyy-mm-dd" where month is 1 based) or Moment.
*   If no value is passed it, will use `new Date()`.
* @returns {CalendarDate}
*/
export declare const getCalendarDate: (d?: Date | string | Momentish) => CalendarDate;
/**
*  Converts a CalendarDate to a Javascript Date obj.
*
* @param {CalendarDate} [d] CalendarDate to convert
* @returns {Date}
*/
export declare const calendarToDateObj: (d: CalendarDate) => Date;
/**
*  Converts a CalendarDate to a string in the format "yyyy-mm-dd". (where month is 1 based)
* @param {CalendarDate} [d] CalendarDate to convert
* @returns {Date}
*/
export declare const calendarToString: (d: CalendarDate) => string;
interface Momentish {
    year: () => number;
    month: () => number;
    date: () => number;
}
export {};
