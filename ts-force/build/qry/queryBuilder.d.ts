import { FieldResolver } from './fieldResolver';
import { ConditionalClause } from './conditional';
import { SFieldProperties, FieldProps, SObject } from '..';
import { QueryOpts } from '../rest/restObject';
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export interface OrderBy {
    field?: string;
    order?: 'ASC' | 'DESC';
    nulls?: 'FIRST' | 'LAST';
}
export type OrderByClause = OrderBy | OrderBy[];
export interface GroupByClause {
    field: string | string[];
    type?: 'CUBE' | 'ROLLUP';
    having?: ConditionalClause;
}
export type UpdateClause = 'TRACKING' | 'VIEWSTAT';
export type ForClause = 'VIEW' | 'UPDATE' | 'REFERENCE';
export type SOQLQueryParams = Omit<SOQLQuery, 'from'>;
export interface SOQLQuery {
    select: string[];
    from: string;
    where?: ConditionalClause;
    groupBy?: GroupByClause;
    orderBy?: OrderByClause;
    for?: ForClause[];
    update?: UpdateClause;
    limit?: number;
    offset?: number;
}
export interface SObjectStatic<T> {
    new (): T;
    API_NAME: string;
    FIELDS: {
        [K in keyof FieldProps<T>]: SFieldProperties;
    };
    retrieve(qryParam: ((fields: FieldResolver<T>) => SOQLQueryParams) | string, opts?: QueryOpts): Promise<T[]>;
    fromSFObject(sob: SObject): T;
}
/**
 * Generates a typesafe* query object using the metadata of the object provided
 *
 * @param from The SObject (generated class static) to generate the query for
 * @param buildQuery A function which accepts a field resolver for the `from` SObject returns the query to build (SOQLQueryParams)
 */
export declare function buildQueryObject<T>(from: SObjectStatic<T>, buildQuery: (fields: FieldResolver<T>) => SOQLQueryParams): SOQLQuery;
/**
 * Generates a typesafe* query using the metadata of the object provided
 *
 * @param from The SObject (generated class static) to generate the query for
 * @param buildQuery A function which accepts a field resolver for the `from` SObject returns the query to build (SOQLQueryParams)
 */
export declare function buildQuery<T>(from: SObjectStatic<T>, buildQuery: (fields: FieldResolver<T>) => SOQLQueryParams): string;
export declare function composeSOQLQuery(qry: SOQLQuery): string;
export {};
