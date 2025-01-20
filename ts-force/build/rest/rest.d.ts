import { AxiosInstance } from "axios";
import { SObjectDescribe } from "./sObjectDescribe";
import { BaseConfig, ConfigParams } from "../auth/baseConfig";
import { Limits, ApiLimit, QueryResponse, SearchResponse, InvokableResult } from "./restTypes";
export declare class Rest {
    private static defaultInstance;
    config: BaseConfig;
    request: AxiosInstance;
    version: string;
    apiLimit: ApiLimit;
    /**
     * Constructor
     * @param {BaseConfig} [config] Optional authentication configuration.
     *     If not passed in will return a "singleton" client from the default config
     * @memberof Rest
     */
    constructor(config?: ConfigParams);
    /**
     * @param  {string} apiName the object to get the describe for
     * @returns Promise<SObjectDescribe>
     */
    getSObjectDescribe(apiName: string): Promise<SObjectDescribe>;
    /**
     * Executes any SOQL query
     * @param  {string} query SOQL Query to execute
     * @param  {string} allRows Optional boolean to indicate use of `queryall` endpoint
     * @returns Promise<QueryResponse<T>>
     */
    query<T>(query: string, allRows?: boolean): Promise<QueryResponse<T>>;
    toolingQuery<T>(query: string): Promise<QueryResponse<T>>;
    /**
     * Get the next page of a query
     * @param resp the response from the previous query
     * @returns the next page of results
     */
    queryMore<T>(resp: QueryResponse<T>): Promise<QueryResponse<T>>;
    /**
     *  Run a SOSL query
     *
     * @template T
     * @param {string} query
     * @returns {Promise<SearchResponse<T>>}
     * @memberof Rest
     */
    search<T>(query: string): Promise<SearchResponse<T>>;
    /**
     *  Returns Limit information about your orgs current usage
     *   NOTE: Rest Limit usage is updated on every request and can be accessed via `apiLimit` property on this class
     * @returns {Promise<Limits>}
     * @memberof Rest
     */
    limits(): Promise<Limits>;
    /**
     * Call an Invokable Action
     * @template O output item type
     * @param {string} action Name of invocable action to call.  Namespaces must be prefixed!
     * @param {any[]} inputs The list of inputs to pass in. See Salesforce Documenation
     * @returns {Promise<InvokableResult<O>>}
     * @memberof Rest
     */
    invokeAction<O>(action: string, inputs: any[]): Promise<InvokableResult<O>>;
}
