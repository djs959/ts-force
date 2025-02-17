import { SalesforceFieldType } from './sObjectDecorators';
export interface ChildRelationship {
    cascadeDelete: boolean;
    childSObject: string;
    deprecatedAndHidden: boolean;
    field: string;
    junctionIdListNames: any[];
    junctionReferenceTo: any[];
    relationshipName: string;
    restrictedDelete: boolean;
}
export interface PicklistValue {
    active: boolean;
    defaultValue: boolean;
    label: string;
    validFor?: any;
    value: string;
}
export interface Field {
    aggregatable: boolean;
    autoNumber: boolean;
    byteLength: number;
    calculated: boolean;
    calculatedFormula?: any;
    cascadeDelete: boolean;
    caseSensitive: boolean;
    compoundFieldName: string;
    controllerName?: any;
    createable: boolean;
    custom: boolean;
    defaultValue?: boolean;
    defaultValueFormula?: any;
    defaultedOnCreate: boolean;
    dependentPicklist: boolean;
    deprecatedAndHidden: boolean;
    digits: number;
    displayLocationInDecimal: boolean;
    encrypted: boolean;
    externalId: boolean;
    extraTypeInfo: string;
    filterable: boolean;
    filteredLookupInfo?: any;
    groupable: boolean;
    highScaleNumber: boolean;
    htmlFormatted: boolean;
    idLookup: boolean;
    inlineHelpText?: any;
    label: string;
    length: number;
    mask?: any;
    maskType?: any;
    name: string;
    nameField: boolean;
    namePointing: boolean;
    nillable: boolean;
    permissionable: boolean;
    picklistValues: PicklistValue[];
    polymorphicForeignKey: boolean;
    precision: number;
    queryByDistance: boolean;
    referenceTargetField?: any;
    referenceTo: string[];
    relationshipName: string;
    relationshipOrder?: any;
    restrictedDelete: boolean;
    restrictedPicklist: boolean;
    scale: number;
    searchPrefilterable: boolean;
    soapType: string;
    sortable: boolean;
    type: SalesforceFieldType;
    unique: boolean;
    updateable: boolean;
    writeRequiresMasterRead: boolean;
}
export interface Urls {
    layout: string;
}
export interface RecordTypeInfo {
    available: boolean;
    defaultRecordTypeMapping: boolean;
    master: boolean;
    name: string;
    developerName: string;
    recordTypeId: string;
    urls: Urls;
}
export interface SupportedScope {
    label: string;
    name: string;
}
export interface Urls2 {
    compactLayouts: string;
    rowTemplate: string;
    approvalLayouts: string;
    uiDetailTemplate: string;
    uiEditTemplate: string;
    defaultValues: string;
    listviews: string;
    describe: string;
    uiNewRecord: string;
    quickActions: string;
    layouts: string;
    sobject: string;
}
export interface SObjectDescribe {
    actionOverrides: any[];
    activateable: boolean;
    childRelationships: ChildRelationship[];
    compactLayoutable: boolean;
    createable: boolean;
    custom: boolean;
    customSetting: boolean;
    deletable: boolean;
    deprecatedAndHidden: boolean;
    feedEnabled: boolean;
    fields: Field[];
    hasSubtypes: boolean;
    isSubtype: boolean;
    keyPrefix: string;
    label: string;
    labelPlural: string;
    layoutable: boolean;
    listviewable?: any;
    lookupLayoutable?: any;
    mergeable: boolean;
    mruEnabled: boolean;
    name: string;
    namedLayoutInfos: any[];
    networkScopeFieldName?: any;
    queryable: boolean;
    recordTypeInfos: RecordTypeInfo[];
    replicateable: boolean;
    retrieveable: boolean;
    searchLayoutable: boolean;
    searchable: boolean;
    supportedScopes: SupportedScope[];
    triggerable: boolean;
    undeletable: boolean;
    updateable: boolean;
    urls: Urls2;
}
