import { Rest } from "../rest";
import { BatchRequest } from "./batch";
export interface CompositeRequest extends BatchRequest {
    referenceId: string;
    body?: any;
    httpHeaders?: Record<string, string>;
}
export interface CompositePayloadOptions {
    allOrNone?: boolean;
    collateSubrequests?: boolean;
}
export interface CompositePayload extends CompositePayloadOptions {
    compositeRequest: CompositeRequest[];
}
export interface CompositeResponse {
    body: any;
    httpStatusCode: number;
    referenceId: string;
}
export interface CompositeResult {
    compositeResponse: CompositeResponse[];
}
export declare class Composite {
    compositeRequest: CompositeRequest[];
    callbacks: Array<(n: CompositeResponse) => void>;
    private client;
    /**
     * @param  {Rest=Rest.DEFAULT_CONFIG} client - Optional.  If not set, will use Rest.DEFAULT_CONFIG
     */
    constructor(client?: Rest);
    /**
     * @param  {CompositeRequest} request A request to add.
     * @param  {(n:CompositeResponse)=>void} [callback] Optional callback that gets passed the response
     * @returns `this` instance for chaining
     */
    addRequest(request: CompositeRequest, callback?: (n: CompositeResponse) => void): Composite;
    /**
     * Sends the composite requests
     * @returns Promise<CompositeResult>
     */
    send(options?: CompositePayloadOptions): Promise<CompositeResult>;
}
