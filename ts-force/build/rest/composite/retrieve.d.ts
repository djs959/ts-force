import { CompositeBatchFailResult } from '.';
import { SObjectStatic, FieldResolver, SOQLQueryParams, SObject, StandardRestError, Rest } from '../..';
/**
 * Uses Composite chaining to retrieve up to 10k records in a single request.
 *    Much more efficient for large queries.  Minor performance hit for single queries returning
 * @experimental
 * @param qry: The query, or the next URL to retrieve
 * @param restInstance: Optional rest instance to run query against
 */
export declare const queryAllComposite: (query: string, opts: {
    restInstance?: Rest;
    allRows?: boolean;
    nextUrl?: string;
}) => Promise<SObject[]>;
/**
 *  Combines multiple RestObject "retrieve" calls using Composite Batch.
 * @param {...{ [K in keyof T]: SObjectStatic<T[K]> }} sObjects: Accepts a tuple of SObject types you wish to query against
 * @returns A function which can be used to build a query.
 *    For each Object you passed in above, pass in a SOQL query, in the form of a string or a function (fields: FieldResolver) => SOQLQueryParams.
 *    This function returns a tuple of CompositeBatchResult<QueryResponse<T>> in the order in which RestObjects were passed into the parent function.
 * @example
 * ```typescript
 * let allResults = await compositeRetrieve(Account, Contact, User)(
 *   f => ({select: f.select('id','accountNumber'), limit: 4000}),  // f: FieldResolver<Account>
 *   f => ({select: f.select('id','firstName', 'email')}),           // f: FieldResolver<Contact>
 *   'SELECT Id FROM User'  // raw SOQL strings are allowed as well
 * );
 *
 * if(results[0].statusCode){
 *   console.log(allResults[0].result.records);  //Accounts
 * }
 *
 * allResults[1]; //CompositeBatchResult<QueryResponse<Contacts>>
 * allResults[2]; //CompositeBatchResult<QueryResponse<Users>>
 * // allResults[3] will yield type error
 * ```
 */
export declare const compositeRetrieve: <T extends any[]>(...sObjects: { [K in keyof T]: SObjectStatic<T[K]>; }) => (...queryFunctions: { [K_1 in keyof T]: string | ((fields: FieldResolver<T[K_1]>) => SOQLQueryParams); }) => Promise<{ [K_2 in keyof T]: CompositeBatchFailResult<StandardRestError[]> | T[K_2][]; }>;
