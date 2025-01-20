import 'reflect-metadata';
import { RestObject } from './restObject';
export declare enum SalesforceFieldType {
    DATE = "date",
    DATETIME = "datetime",
    BOOLEAN = "boolean",
    DOUBLE = "double",
    INTEGER = "integer",
    CURRENCY = "currency",
    REFERENCE = "reference",
    STRING = "string",
    PICKLIST = "picklist",
    TEXTAREA = "textarea",
    ADDRESS = "address",
    PHONE = "phone",
    URL = "url",
    MULTIPICKLIST = "multipicklist",
    PERCENT = "percent",
    EMAIL = "email",
    INT = "int",
    LOCATION = "location",
    ID = "id",
    BASE64 = "base64",
    ANYTYPE = "anytype",
    TIME = "time",
    ENCRYPTEDSTRING = "encryptedstring",
    COMBOBOX = "combobox"
}
export declare class SFieldProperties {
    apiName: string;
    updateable: boolean;
    createable: boolean;
    reference?: () => {
        new (): RestObject;
    };
    required: boolean;
    externalId: boolean;
    childRelationship: boolean;
    salesforceType: SalesforceFieldType;
    salesforceLabel?: string;
    toString: () => string;
}
export declare function sField(props: SFieldProperties): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function getSFieldProps(target: any, propertyKey: string): SFieldProperties;
