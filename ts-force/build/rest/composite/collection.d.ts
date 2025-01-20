import { Rest } from "../rest";
import { RestObject } from "../restObject";
export interface InsertRequest {
    allOrNone: boolean;
    records: any[];
}
export interface SaveResult extends BaseResult {
    warnings: any[];
}
export interface BaseResult {
    id: string;
    success: boolean;
    errors: Error[];
}
export interface Error {
    fields: any[];
    message: string;
    statusCode: string;
}
export declare class CompositeCollection {
    private endpoint;
    private client;
    /**
     * Creates a client that can send "Collection" requests to salesforce.
     * Collections request run in a single execution context
     * API version must be >= v42.0
     * @param  {Rest} client? Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor(client?: Rest);
    /**
     * Inserts up to 200 SObjects.
     * @param  {RestObject[]} sobs SObjects to Insert
     * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
     * @param  {boolean} setId? if set to true, the passed SObject Id's will be updated when request if completed
     * @returns Promise<SaveResult[]> in order of pass SObjects
     */
    insert: (sobs: RestObject[], allOrNothing?: boolean, setId?: boolean) => Promise<SaveResult[]>;
    /**
     * Updates up to 200 SObjects.
     * @param  {RestObject[]} sobs SObjects to Update
     * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
     * @returns Promise<SaveResult[]> in order of pass SObjects
     */
    update: (sobs: RestObject[], opts?: {
        allOrNothing?: boolean;
        sendAllFields?: boolean;
    }) => Promise<SaveResult[]>;
    /**
     * Deletes up to 200 SObjects.
     * @param  {RestObject[]} sobs SObjects to Delete
     * @param  {boolean} allOrNothing? if set true, salesforce will rollback on failures
     * @returns Promise<BaseResult[]> in order of pass SObjects
     */
    delete: (sobs: RestObject[], allOrNothing?: boolean) => Promise<BaseResult[]>;
    private resetModified;
}
