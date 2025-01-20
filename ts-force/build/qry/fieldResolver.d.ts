import { RelationPropNames, ParentReferencePropNames, QueryField } from '../types';
import { SFieldProperties } from '..';
import { SObjectStatic, SOQLQueryParams } from './queryBuilder';
export type AggregateFunctions = 'MIN' | 'MAX' | 'COUNT' | 'AVG' | 'COUNT_DISTINCT' | 'SUM';
export type CalendarFunctions = 'CALENDAR_MONTH' | 'CALENDAR_QUARTER' | 'CALENDAR_YEAR' | 'DAY_IN_MONTH' | 'DAY_IN_WEEK' | 'DAY_IN_YEAR' | 'DAY_ONLY';
export type SOQLFunction = AggregateFunctions | CalendarFunctions;
export interface FunctionField<T> {
    fn: SOQLFunction;
    alias?: string;
    field: QueryField<T>;
}
/**
 * Allow resolving of object API
 */
export declare class FieldResolver<T> {
    readonly traversed: SFieldProperties[];
    protected readonly _obj: SObjectStatic<T>;
    constructor(obj: SObjectStatic<T>, traversed?: SFieldProperties[]);
    /**
     * Resolves API names of the passed in fields, in relation to the starting SObject type.
     *
     * @param ...args: One or more Field Key of T (SObject) or FunctionType<T>
     * @returns string|string[] of resolved API name(s) matching how many params where passed in
     */
    select(f: QueryField<T> | FunctionField<T>): string;
    select(arr: Array<QueryField<T> | FunctionField<T>>): string[];
    select(...args: Array<QueryField<T> | FunctionField<T>>): string[];
    /**
     * Traverses a parent relationship, providing a field resolver that can build field paths relative to the starting relationship
     *
     * @param relation: a parent SObject relation key of the current SObject
     * @returns a new FieldResolver for the selected parent relation, with information to track the traversed relationships
     */
    parent<K extends ParentReferencePropNames<Required<T>>>(relation: K): FieldResolver<Required<T>[K]>;
    /**
     * Provided the a key of a child relationship on the SObject,
     * creates a new FieldResolver for that relationships type and passes in `func` so a SELECT subquery can be generated
     *
     * @param relationship The child relationships key to generate the subquery for
     * @param func a function, which accepts a FieldResolver and returns the a Subquery
     */
    subQuery<K extends RelationPropNames<Required<T>>, T2 extends Required<T>[K] extends (infer U)[] ? U : never>(relationship: K, func: (fields: FieldResolver<T2>) => SOQLQueryParams): string;
}
export declare function renderComplexTypeText(field: string, func: string, alias?: string): string;
