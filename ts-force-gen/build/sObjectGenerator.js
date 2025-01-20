"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SObjectGenerator = exports.TS_FORCE_IMPORTS = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const ts_force_1 = require("../../ts-force");
const ts_morph_1 = require("ts-morph");
const util_1 = require("./util");
exports.TS_FORCE_IMPORTS = {
    kind: ts_morph_1.StructureKind.ImportDeclaration,
    moduleSpecifier: 'ts-force',
    namedImports: [
        { name: 'Rest' },
        { name: 'RestObject' },
        { name: 'QueryOpts' },
        { name: 'SObject' },
        { name: 'sField' },
        { name: 'SalesforceFieldType' },
        { name: 'SFLocation' },
        { name: 'SFieldProperties' },
        { name: 'FieldResolver' },
        { name: 'SOQLQueryParams' },
        { name: 'buildQuery' },
        { name: 'FieldProps' },
        { name: 'PicklistConst' },
        { name: 'CalendarDate' }
    ]
};
const SUPER_CLASS = 'RestObject';
class SObjectGenerator {
    /**
    * Generates RestObject Concrete types
    * @param {SourceFile} sourceFile: Location to save the files
    * @param {string[]} sObjectConfigs: Salesforce API Object Names to generate Classes for
    * @memberof SObjectGenerator
    */
    constructor(out, sObjectConfig, allConfigs) {
        this.sObjectConfig = sObjectConfig;
        this.pickLists = new Map();
        if (typeof out === 'string') {
            this.sourceFile = (0, util_1.replaceSource)(out);
            this.singleFileMode = false;
        }
        else {
            this.sourceFile = out;
            this.singleFileMode = true;
        }
        this.client = new ts_force_1.Rest();
        this.fieldsTypeAlias = `${sObjectConfig.className}Fields`;
        this.allConfigsMap = new Map(allConfigs.map(x => [x.apiName.toLowerCase(), x]));
        this.dependsOn = new Set();
    }
    generateFile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                // add imports
                this.sourceFile.addTypeAlias({
                    name: this.fieldsTypeAlias,
                    isExported: true, // to maintain backwords compat
                    type: `Partial<FieldProps<${this.sObjectConfig.className}>>`
                });
                yield this.generateSObjectClass(this.sObjectConfig);
                if (!this.singleFileMode) {
                    // ts-imports must be added by controlling process
                    this.sourceFile.addImportDeclaration(exports.TS_FORCE_IMPORTS);
                    this.sourceFile.addImportDeclaration({
                        moduleSpecifier: './',
                        namedImports: [...this.dependsOn].filter(c => c !== this.sObjectConfig.className).map(c => {
                            return { name: c };
                        })
                    });
                }
            }
            catch (e) {
                throw e;
            }
            return this.sourceFile;
        });
    }
    // class generation
    generateSObjectClass(sobConfig) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let sobDescribe;
            try {
                sobDescribe = yield this.retrieveDescribe(sobConfig.apiName);
            }
            catch (e) {
                throw new Error(`Could not retrieve describe metadata for ${sobConfig.apiName}. Check SObject spelling and authorization `);
            }
            let props = [];
            // generate props from fields & children
            props.push(...this.generateChildrenProps(sobConfig, sobDescribe.childRelationships));
            props.push(...this.generateFieldProps(sobConfig, sobDescribe.fields));
            let className = this.sObjectConfig.className;
            let classDeclaration = this.generateClass(sobConfig, className, props);
            classDeclaration.addProperty({
                name: 'API_NAME',
                scope: ts_morph_1.Scope.Public,
                isStatic: true,
                type: `'${sobConfig.apiName}'`,
                initializer: `'${sobConfig.apiName}'`
            });
            classDeclaration.addProperty({
                name: '_TYPE_',
                scope: ts_morph_1.Scope.Public,
                isReadonly: true,
                type: `'${sobConfig.apiName}'`,
                initializer: `'${sobConfig.apiName}'`
            });
            classDeclaration.addProperty({
                name: '__UUID',
                scope: ts_morph_1.Scope.Public,
                isStatic: true,
                initializer: `Symbol()`
            });
            classDeclaration.addProperty({
                name: '_fields',
                scope: ts_morph_1.Scope.Private,
                isStatic: true,
                type: `{[P in keyof FieldProps<${className}>]: SFieldProperties;}`
            });
            classDeclaration.addGetAccessor({
                name: 'FIELDS',
                scope: ts_morph_1.Scope.Public,
                isStatic: true,
                statements: `return this._fields = this._fields ? this._fields : ${className}.getPropertiesMeta<FieldProps<${className}>,${className}>(${className})`
            });
            classDeclaration.addMethod({
                name: 'retrieve',
                isStatic: true,
                scope: ts_morph_1.Scope.Public,
                parameters: [
                    { name: 'qryParam', type: `((fields: FieldResolver<${className}>) => SOQLQueryParams) | string` },
                    { name: 'opts', type: 'QueryOpts', hasQuestionToken: true }
                ],
                returnType: `Promise<${className}[]>`,
                isAsync: true,
                statements: `
            const qry = typeof qryParam === 'function' ? buildQuery(${className}, qryParam) : qryParam;
            return await ${SUPER_CLASS}.query<${className}>(${className}, qry, opts);
            `
            });
            classDeclaration.addMethod({
                name: 'fromSFObject',
                isStatic: true,
                scope: ts_morph_1.Scope.Public,
                parameters: [
                    { name: 'sob', type: 'SObject' }
                ],
                returnType: `${className}`,
                statements: `return new ${className}().mapFromQuery(sob);`
            });
            if (this.sObjectConfig.generatePicklists) {
                this.generatePickistConst(classDeclaration);
            }
            classDeclaration.forget();
        });
    }
    retrieveDescribe(apiName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.client.getSObjectDescribe(apiName);
        });
    }
    generateClass(sobConfig, className, props) {
        let classDeclaration = this.sourceFile.addClass({
            name: className,
            extends: SUPER_CLASS,
            isExported: true,
            properties: props,
            // implements: [propInterfaceName],
            docs: [{ description: `Generated class for ${sobConfig.apiName}` }]
        });
        const interfaceParamName = 'fields';
        const constr = classDeclaration.addConstructor();
        constr.addParameter({
            name: interfaceParamName,
            type: this.fieldsTypeAlias,
            hasQuestionToken: true
        });
        constr.addParameter({
            name: 'restInstance',
            type: 'Rest',
            hasQuestionToken: true
        });
        const propsInit = props.map(prop => {
            return `this.${prop.name} = void 0;`;
        }).join('\n');
        let constructorBody = `super('${sobConfig.apiName}', restInstance);
                            ${propsInit}
                            this.__UUID = ${sobConfig.className}.__UUID;
                            this.initObject(${interfaceParamName});
                            return new Proxy(this, this.safeUpdateProxyHandler);`;
        constr.setBodyText(constructorBody);
        return classDeclaration;
    }
    generatePickistConst(classDeclaration) {
        if (this.pickLists.size) {
            let picklistsConst = classDeclaration.addProperty({
                name: 'PICKLIST',
                scope: ts_morph_1.Scope.Public,
                isStatic: true,
                isReadonly: true
            });
            let picklistConsts = {};
            this.pickLists.forEach((values, field) => {
                picklistConsts[field] = ts_morph_1.WriterFunctions.object(values.reduce((obj, pv) => {
                    obj[pv[0]] = writer => writer.quote(pv[1]);
                    return obj;
                }, {}));
            });
            let x = writer => {
                ts_morph_1.WriterFunctions.object(picklistConsts)(writer);
                writer.write(' as const');
            };
            picklistsConst.setInitializer(x);
        }
    }
    sanitizeProperty(sobConfig, apiName, reference) {
        let fieldMapping;
        if (sobConfig.fieldMappings) {
            fieldMapping = sobConfig.fieldMappings.find(mapping => {
                return mapping.apiName.toLowerCase() === apiName.toLowerCase();
            });
        }
        if (fieldMapping) {
            return fieldMapping.propName;
        }
        else if (sobConfig.autoConvertNames) {
            let s = (0, util_1.cleanAPIName)(apiName, sobConfig.keepNamespaces);
            s += reference && !apiName.endsWith('Id') ? 'Id' : '';
            return (0, lodash_1.camelCase)(s);
        }
        else {
            return apiName;
        }
    }
    sanatizePicklistName(picklistLabel, usedNames) {
        let name = picklistLabel.split(' ').join('_');
        name = name.replace(/[^0-9a-z_]/gi, '');
        if (Number.isInteger(Number(name.charAt(0)))) {
            name = '_' + name;
        }
        name = name.toUpperCase();
        name = this.makeNameUnique(name, usedNames);
        return name;
    }
    makeNameUnique(name, usedNames) {
        while (usedNames.has(name)) {
            name = `${name}_dup`;
        }
        return name;
    }
    generateChildrenProps(sobConfig, children) {
        const uniqueNames = new Set();
        let props = [];
        children.forEach(child => {
            try {
                let relatedSobConfig = this.allConfigsMap.get(child.childSObject.toLowerCase());
                // don't generate if not in the list of types or ??
                if (!relatedSobConfig
                    || child.childSObject === sobConfig.apiName
                    || child.deprecatedAndHidden === true
                    || child.relationshipName === null) {
                    return;
                }
                this.dependsOn.add(relatedSobConfig.className);
                let referenceClass = relatedSobConfig.className;
                let decoratorProps = {
                    apiName: child.relationshipName,
                    required: false,
                    createable: false,
                    updateable: false,
                    childRelationship: true,
                    reference: referenceClass,
                    externalId: false,
                    salesforceLabel: child.relationshipName,
                    salesforceType: ts_force_1.SalesforceFieldType.REFERENCE
                };
                let propName = this.sanitizeProperty(sobConfig, child.relationshipName, false);
                propName = this.makeNameUnique(propName, uniqueNames);
                uniqueNames.add(propName);
                props.push({
                    name: propName,
                    kind: ts_morph_1.StructureKind.Property,
                    type: `${referenceClass}[]`,
                    scope: ts_morph_1.Scope.Public,
                    decorators: [
                        this.generateDecorator(decoratorProps)
                    ],
                    hasQuestionToken: true
                });
            }
            catch (e) {
                throw e;
            }
        });
        return props;
    }
    generateFieldProps(sobConfig, fields) {
        let props = [];
        const uniqueNames = new Set();
        // add members
        fields.forEach(field => {
            try {
                let docs = [];
                if (field.inlineHelpText != null) {
                    docs.push({ kind: ts_morph_1.StructureKind.JSDoc, description: field.inlineHelpText });
                }
                const referenceTo = field.referenceTo.length > 1 ? 'name' :
                    (field.referenceTo.length === 1 ? field.referenceTo[0].toLowerCase() : null);
                if (referenceTo &&
                    this.allConfigsMap.has(referenceTo) &&
                    field.type === ts_force_1.SalesforceFieldType.REFERENCE &&
                    field.relationshipName !== null) {
                    let relatedSobConfig = this.allConfigsMap.get(referenceTo);
                    this.dependsOn.add(relatedSobConfig.className);
                    let referenceClass = relatedSobConfig.className;
                    let decoratorProps = {
                        apiName: field.relationshipName,
                        required: false,
                        createable: false,
                        updateable: false,
                        childRelationship: false,
                        reference: referenceClass,
                        externalId: false,
                        salesforceLabel: field.label,
                        salesforceType: ts_force_1.SalesforceFieldType.REFERENCE
                    };
                    props.push({
                        // For use case 'Account.owner->User', The property name 'owner' should be resolved
                        // based on Account's sobConfig.
                        name: this.sanitizeProperty(sobConfig, field.relationshipName, false),
                        type: referenceClass,
                        scope: ts_morph_1.Scope.Public,
                        kind: ts_morph_1.StructureKind.Property,
                        decorators: [
                            this.generateDecorator(decoratorProps)
                        ],
                        hasQuestionToken: true,
                        docs: docs
                    });
                }
                let propName = this.sanitizeProperty(sobConfig, field.name, field.type === ts_force_1.SalesforceFieldType.REFERENCE);
                propName = this.makeNameUnique(propName, uniqueNames);
                uniqueNames.add(propName);
                let prop = {
                    kind: ts_morph_1.StructureKind.Property,
                    name: propName,
                    type: this.mapSObjectType(field.type) + '| null',
                    scope: ts_morph_1.Scope.Public,
                    isReadonly: !(field.createable || field.updateable),
                    decorators: [this.getDecorator(field)],
                    hasQuestionToken: true,
                    docs: docs
                };
                if (this.sObjectConfig.generatePicklists) {
                    if (field.picklistValues.length) {
                        let usedNames = new Set();
                        let values = field.picklistValues.map(pv => {
                            let name = this.sanatizePicklistName(pv.value, usedNames);
                            usedNames.add(name);
                            return [name, pv.value];
                        });
                        this.pickLists.set(prop.name, values);
                        // enforce picklist values
                        //  does not currently support multi-picklist field
                        if (this.sObjectConfig.enforcePicklistValues &&
                            (this.sObjectConfig.enforcePicklistValues === 'RESTRICTED' && field.restrictedPicklist
                                || this.sObjectConfig.enforcePicklistValues === 'ALL')) {
                            let picklist = `PicklistConst<typeof ${sobConfig.className}.PICKLIST.${prop.name}>`;
                            if (field.type === ts_force_1.SalesforceFieldType.MULTIPICKLIST) {
                                prop.type = `${picklist}[]`;
                            }
                            else {
                                prop.type = picklist;
                            }
                        }
                    }
                }
                props.push(prop);
            }
            catch (e) {
                throw e;
            }
        });
        return props;
    }
    mapSObjectType(sfType) {
        switch (sfType) {
            case ts_force_1.SalesforceFieldType.DATETIME:
                return 'Date';
            case ts_force_1.SalesforceFieldType.DATE:
                return 'CalendarDate';
            case ts_force_1.SalesforceFieldType.BOOLEAN:
                return 'boolean';
            case ts_force_1.SalesforceFieldType.DOUBLE:
            case ts_force_1.SalesforceFieldType.INTEGER:
            case ts_force_1.SalesforceFieldType.CURRENCY:
            case ts_force_1.SalesforceFieldType.INT:
            case ts_force_1.SalesforceFieldType.PERCENT:
                return 'number';
            case ts_force_1.SalesforceFieldType.LOCATION:
                return 'SFLocation';
            case ts_force_1.SalesforceFieldType.MULTIPICKLIST:
                return 'string[]';
            case ts_force_1.SalesforceFieldType.REFERENCE:
            case ts_force_1.SalesforceFieldType.STRING:
            case ts_force_1.SalesforceFieldType.PICKLIST:
            case ts_force_1.SalesforceFieldType.ID:
            default:
                return 'string';
        }
    }
    mapTypeToEnum(sfType) {
        return `SalesforceFieldType.${sfType.toUpperCase()}`;
    }
    getDecorator(field) {
        let decoratorProps = {
            apiName: field.name,
            createable: field.createable,
            updateable: field.updateable,
            required: (field.createable || field.updateable) && field.nillable === false,
            externalId: field.externalId,
            childRelationship: false,
            reference: null,
            salesforceLabel: field.label,
            salesforceType: field.type
        };
        return this.generateDecorator(decoratorProps);
    }
    generateDecorator(decoratorProps) {
        let ref = decoratorProps.reference != null ? `()=>{return ${decoratorProps.reference}}` : 'undefined';
        let sfType = decoratorProps.salesforceType ? `${this.mapTypeToEnum(decoratorProps.salesforceType)}` : 'undefined';
        let label = decoratorProps.salesforceLabel ? decoratorProps.salesforceLabel.replace(/'/g, "\\'") : '';
        let props = {
            apiName: `'${decoratorProps.apiName}'`,
            createable: `${decoratorProps.createable}`,
            updateable: `${decoratorProps.updateable}`,
            required: `${decoratorProps.required}`,
            reference: `${ref}`,
            childRelationship: `${decoratorProps.childRelationship}`,
            salesforceType: `${sfType}`,
            salesforceLabel: `'${label}'`,
            externalId: `${decoratorProps.externalId}`
        };
        let propsString = Object.keys(props).map(key => {
            return `${key}: ${props[key]}`;
        }).join(', ');
        return {
            kind: ts_morph_1.StructureKind.Decorator,
            name: `sField`,
            arguments: [
                `{${propsString}}`
            ]
        };
    }
}
exports.SObjectGenerator = SObjectGenerator;
//# sourceMappingURL=sObjectGenerator.js.map