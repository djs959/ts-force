import { CompositeBatchResult, CompositeResponse } from './composite';
import { Rest } from './rest';
import { SFieldProperties } from './sObjectDecorators';
import { SObject } from './sObject';
import { FieldProps } from '..';
export interface DMLResponse {
    id: string;
    errors: string[];
    success: boolean;
    warnings: string[];
}
export interface QueryOpts {
    restInstance?: Rest;
    allRows?: boolean;
    useComposite?: boolean;
    allRecords?: false | true | 'parent-only';
}
/**
 * Abstract Base class which provides DML to Generated SObjects
 * TODO: Need some way to support multiple configurations
 * @export
 * @abstract
 * @class RestObject
 * @extends {SObject}
 */
export declare abstract class RestObject extends SObject {
    private _client;
    _modified: Set<string>;
    constructor(type: string, client?: Rest);
    protected initObject(fields?: Partial<FieldProps<RestObject>>): void;
    protected safeUpdateProxyHandler: {
        set: (obj: any, key: keyof any, value: any) => boolean;
    };
    protected static query<T extends RestObject>(type: {
        new (): T;
    }, qry: string, opts?: QueryOpts): Promise<T[]>;
    protected static getPropertiesMeta<S, T extends RestObject>(type: {
        new (): T;
    }): {
        [P in keyof FieldProps<S>]: SFieldProperties;
    };
    handleCompositeUpdateResult: (result: CompositeResponse) => void;
    handleCompositeGetResult: (result: CompositeResponse) => void;
    handleCompositeBatchGetResult: (result: CompositeBatchResult<SObject, any>) => void;
    refresh(): Promise<this>;
    /**
     * inserts the sobject to Salesfroce
     *
     * @param {boolean} [refresh] Set to true to apply GET after update
     * @returns {Promise<void>}
     * @memberof RestObject
     */
    insert(opts?: {
        refresh?: boolean;
    }): Promise<this>;
    protected insertComposite(): Promise<this>;
    /**
     * Updates the sObject on Salesforce
     * @param {boolean} [refresh] Set to true to apply GET after update
     * @returns {Promise<void>}
     * @memberof RestObject
     */
    update(opts?: {
        refresh?: boolean;
        sendAllFields?: boolean;
    }): Promise<this>;
    protected updateComposite(sendAllFields?: boolean): Promise<this>;
    /**
     * Deletes the Object from Salesforce
     *
     * @returns {Promise<DMLResponse>}
     * @memberof RestObject
     */
    delete(): Promise<DMLResponse>;
    toJson(opts: {
        dmlMode: 'all' | 'insert' | 'update' | 'update_modified_only';
        hideAttributes?: boolean;
        sendParentObj?: boolean;
        sendChildObj?: boolean;
    }): any;
    private toSFValueFormat;
    /**
     * Advanced method used to set a modified API key of a field to send on update
     * @param keys: keys of the object to set the associated field for
     * @memberof RestObject
     */
    setModified: (keys: Array<keyof this>) => void;
    protected prepareAsRelationRecord(): {
        [key: string]: any;
    };
    protected mapFromQuery(data: SObject): this;
    private getNameMapping;
    private handleCompositeErrors;
    private handleCompositeBatchErrors;
}
