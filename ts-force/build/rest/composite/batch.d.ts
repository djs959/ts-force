import { RestObject } from '../restObject';
import { Rest } from '../rest';
import { QueryResponse } from '../restTypes';
import { SObject } from '../sObject';
import { StandardRestError } from '../errors';
export interface BatchResponse {
    hasErrors: boolean;
    results: CompositeBatchResult<any, any>[];
}
export interface CompositeBatchSuccessResult<T> {
    readonly statusCode: number;
    result: T;
}
export interface CompositeBatchFailResult<T> {
    readonly statusCode: number;
    result: T;
}
export type CompositeBatchResult<T, E> = CompositeBatchSuccessResult<T> | CompositeBatchFailResult<E>;
export declare const isCompositeBatchSuccessResult: <T, E>(result: CompositeBatchResult<T, E>) => result is CompositeBatchSuccessResult<T>;
export declare const isCompositeBatchFailResult: <T, E>(result: CompositeBatchResult<T, E>) => result is CompositeBatchFailResult<E>;
export interface BatchRequest {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    url: string;
    richInput?: any;
}
export interface CompositeBatchPayload {
    batchRequests: BatchRequest[];
}
export declare class CompositeBatch {
    batchRequests: BatchRequest[];
    callbacks: Array<(n: CompositeBatchResult<any, any>) => void>;
    private client;
    /**
     * Creates a composite batch to allow multiple requests to be sent in one round-trip
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor(client?: Rest);
    /**
     * Sends all added requests
     * @returns Promise<BatchResponse> the completed response data.  Should be returned in order added
     */
    send(): Promise<BatchResponse>;
    /**
     * Adds request to retrieve an SObject
     * @param  {RestObject} obj sObject to retrieve
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    addGet(obj: RestObject, callback?: (n: CompositeBatchResult<SObject, any>) => void): CompositeBatch;
    /**
     * Adds request to update an SObject
     * @param  {RestObject} obj sObject to update
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    addUpdate(obj: RestObject, opts?: {
        callback?: ((n: CompositeBatchResult<any, any>) => void);
        sendAllFields?: boolean;
    }): CompositeBatch;
    /**
     * Adds request to insert an SObject
     * @param  {RestObject} obj sObject to insert
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    addInsert(obj: RestObject, callback?: (n: CompositeBatchResult<any, any>) => void): CompositeBatch;
    /**
     * Adds request to delete an SObject
     * @param  {RestObject} obj sObject to insert
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    addDelete(obj: RestObject, callback?: (n: CompositeBatchResult<any, any>) => void): CompositeBatch;
    /**
     * Adds a query request
     * @param  {string} query the SOQL query to execute
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    addQuery(query: string, callback?: (n: CompositeBatchResult<QueryResponse<any>, StandardRestError[]>) => void): CompositeBatch;
    /**
     * Adds a query request
     * @param  {string} nextRecordsUrl next url to query
     * @param  {(n:CompositeBatchResult)=>void} callback? optional callback to pass results to once operation is complete
     * @returns this instance is returned for easy chaining
     */
    addQueryMore(nextRecordsUrl: string, callback?: (n: CompositeBatchResult<QueryResponse<any>, StandardRestError[]>) => void): CompositeBatch;
    private addBatchRequest;
    private createPayloads;
}
