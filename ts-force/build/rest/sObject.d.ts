import { Rest } from './rest';
export declare class SObjectAttributes {
    type: string;
    url: string;
}
export declare abstract class SObject {
    id?: string | null;
    attributes: SObjectAttributes;
    __UUID?: symbol;
    constructor(type: string, client?: Rest);
}
