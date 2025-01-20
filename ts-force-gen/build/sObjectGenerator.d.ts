import { SourceFile, ImportDeclarationStructure } from 'ts-morph';
import { SObjectConfig } from './config';
export declare const TS_FORCE_IMPORTS: ImportDeclarationStructure;
export declare class SObjectGenerator {
    private sObjectConfig;
    private allConfigsMap;
    private dependsOn;
    private sourceFile;
    private singleFileMode;
    private client;
    private fieldsTypeAlias;
    private pickLists;
    /**
    * Generates RestObject Concrete types
    * @param {SourceFile} sourceFile: Location to save the files
    * @param {string[]} sObjectConfigs: Salesforce API Object Names to generate Classes for
    * @memberof SObjectGenerator
    */
    constructor(out: string | SourceFile, sObjectConfig: SObjectConfig, allConfigs: SObjectConfig[]);
    generateFile(): Promise<SourceFile>;
    generateSObjectClass(sobConfig: SObjectConfig): Promise<void>;
    private retrieveDescribe;
    private generateClass;
    private generatePickistConst;
    private sanitizeProperty;
    private sanatizePicklistName;
    private makeNameUnique;
    private generateChildrenProps;
    private generateFieldProps;
    private mapSObjectType;
    private mapTypeToEnum;
    private getDecorator;
    private generateDecorator;
}
