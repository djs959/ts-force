#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="node" />
const ts_force_1 = require("../../ts-force");
const sObjectGenerator_1 = require("./sObjectGenerator");
const minimist = require("minimist");
const fs = require("fs");
const path = require("path");
const util_1 = require("./util");
const cli_spinner_1 = require("cli-spinner");
const core_1 = require("@salesforce/core");
const fs_1 = require("fs");
// execute
run();
function run() {
    checkVersion()
        .then(generateLoadConfig)
        .then((config) => {
        if (config) {
            return generate(config);
        }
    })
        .catch(e => {
        console.log('Failed to Generate!  Check config or cmd params!');
        console.log(e);
    });
}
// Checks that the installed version ts-force matches this package
function checkVersion() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let tsforce;
        let gen;
        try {
            gen = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version;
        }
        catch (e) {
            console.warn('Failed to detect package version of ts-force-gen');
            return;
        }
        for (let dir of fs.readdirSync('node_modules')) {
            try {
                if (dir === 'ts-force') {
                    let json = JSON.parse(fs.readFileSync(path.join('node_modules', dir, 'package.json'), 'utf8'));
                    tsforce = json.version;
                }
            }
            catch (err) { }
        }
        if (gen !== tsforce) {
            console.warn(`The version of ts-force-gen (${gen}) should match ts-force (${tsforce}). It is recommended that you run \`npm install -D ts-force-gen@${tsforce}\` and regenerate classes`);
        }
    });
}
const baseConfig = `
{
  "$schema": "https://raw.githubusercontent.com/ChuckJonas/ts-force/master/ts-force-gen/ts-force-config.schema.json",
  "sObjects": [
    "Account",
    "Contact"
  ],
  "auth": {
    "username": "sfdxuser@example.com"
  },
  "outPath": "./src/generated/"
}
`;
const DEFAULT_TS_CONFIG_PATH = 'ts-force-config.json';
function createConfig() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(DEFAULT_TS_CONFIG_PATH)) {
            (0, fs_1.writeFileSync)(DEFAULT_TS_CONFIG_PATH, baseConfig);
        }
    });
}
// init the configuration, either from a json file, command line augs or bo
function generateLoadConfig() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let args = minimist(process.argv.slice(2));
        if (args.init) {
            yield createConfig();
            return null;
        }
        let config = {};
        let configPath = args.config || args.j || DEFAULT_TS_CONFIG_PATH;
        if (configPath) {
            try {
                if (fs.existsSync(configPath)) {
                    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                }
                else {
                    console.warn('No Config File Found');
                }
            }
            catch (e) {
                console.log(`Failed to Parse config file`);
                console.error(e);
                return null;
            }
        }
        if (!config.auth) {
            config.auth = { version: 50 };
        }
        // setup commandline args
        if (args.e) {
            config.auth.clientId = process.env.CLIENT_ID;
            config.auth.clientSecret = process.env.CLIENT_SECRET;
            config.auth.username = process.env.USERNAME;
            config.auth.password = process.env.PASSWORD;
            config.auth.oAuthHost = process.env.HOST;
        }
        if (args.c || args.clientId) {
            config.auth.clientId = args.c || args.clientId;
        }
        if (args.x || args.clientSecret) {
            config.auth.clientSecret = args.x || args.clientSecret;
        }
        if (args.u || args.username) {
            config.auth.username = args.u || args.username;
        }
        if (args.p || args.password) {
            config.auth.password = args.p || args.password;
        }
        if (args.h || args.oAuthHost) {
            config.auth.oAuthHost = args.h || args.oAuthHost;
        }
        if (args.accessToken || args.a) {
            config.auth.accessToken = args.accessToken || args.a;
        }
        if (args.instanceUrl || args.i) {
            config.auth.instanceUrl = args.instanceUrl || args.i;
        }
        if (args.outputFile || args.o) {
            config.outPath = args.outputFile || args.o;
        }
        if (args.sObjects || args.s) {
            config.sObjects = (args.sObjects || args.s).split(',');
        }
        if (config.auth.accessToken === undefined) {
            // no username is set, try to pull default
            if (Object.keys(config.auth).length === 0) {
                let org = yield core_1.Org.create({});
                console.log(`User: ${org.getUsername()}`);
                yield org.refreshAuth();
                let connection = org.getConnection();
                config.auth.accessToken = connection.accessToken;
                config.auth.instanceUrl = connection.instanceUrl;
            }
            else if (config.auth.username !== undefined && config.auth.password === undefined) {
                // just username is set, load from sfdx
                let username = yield core_1.Aliases.fetch(config.auth.username);
                if (username) {
                    config.auth.username = username;
                }
                console.log(config.auth.username);
                let connection = yield core_1.Connection.create({
                    authInfo: yield core_1.AuthInfo.create({ username: config.auth.username })
                });
                let org = yield core_1.Org.create({ connection });
                yield org.refreshAuth();
                connection = org.getConnection();
                config.auth.accessToken = connection.accessToken;
                config.auth.instanceUrl = connection.instanceUrl;
            }
            else if (config.auth.username !== undefined && config.auth.password !== undefined) {
                let oAuthResp = yield (0, ts_force_1.requestAccessToken)({
                    grant_type: 'password',
                    instanceUrl: config.auth.oAuthHost,
                    client_id: config.auth.clientId,
                    client_secret: config.auth.clientSecret,
                    username: config.auth.username,
                    password: config.auth.password
                });
                config.auth.instanceUrl = oAuthResp.instance_url;
                config.auth.accessToken = oAuthResp.access_token;
            }
            else {
                throw new Error('No valid authentication configuration found!');
            }
        }
        // could also retrieve this using sfdx
        (0, ts_force_1.setDefaultConfig)(config.auth);
        return config;
    });
}
// generate the classes
function generate(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let spinner = new cli_spinner_1.Spinner({
            text: 'warming up...',
            stream: process.stderr,
            onTick: function (msg) {
                this.clearLine(this.stream);
                this.stream.write(msg);
            }
        });
        spinner.setSpinnerString(5);
        spinner.setSpinnerDelay(20);
        spinner.start();
        let save = true;
        if (config.outPath == null) {
            config.outPath = './placeholder.ts';
            save = false;
        }
        let singleFileMode = false;
        if (config.outPath.endsWith('.ts')) {
            singleFileMode = true;
        }
        if (config.keepNamespaces === undefined) {
            config.keepNamespaces = false;
        }
        let sobConfigs = config.sObjects.map(item => {
            let objConfig;
            if (typeof item === 'string') {
                objConfig = {
                    apiName: item,
                    className: null,
                    autoConvertNames: true
                };
            }
            else {
                objConfig = item;
            }
            if (config.generatePicklists && objConfig.generatePicklists === undefined) {
                objConfig.generatePicklists = true;
            }
            if (config.keepNamespaces && objConfig.keepNamespaces === undefined) {
                objConfig.keepNamespaces = true;
            }
            if (config.enforcePicklistValues && objConfig.enforcePicklistValues === undefined) {
                objConfig.enforcePicklistValues = config.enforcePicklistValues;
            }
            objConfig.autoConvertNames = objConfig.autoConvertNames || true;
            objConfig.className = objConfig.className || sanitizeClassName(objConfig);
            return objConfig;
        });
        let index;
        if (singleFileMode) {
            index = (0, util_1.replaceSource)(config.outPath);
            index.addImportDeclaration(sObjectGenerator_1.TS_FORCE_IMPORTS);
        }
        else {
            // create index so we can easily import
            let indexPath = path.join(config.outPath, 'index.ts');
            index = (0, util_1.replaceSource)(indexPath);
        }
        for (let sobConfig of sobConfigs) {
            spinner.setSpinnerTitle(`Generating: ${sobConfig.apiName}`);
            let classSource;
            if (singleFileMode) {
                classSource = index;
            }
            else {
                index.addExportDeclaration({
                    moduleSpecifier: `./${sobConfig.className}`
                });
                classSource = path.join(config.outPath, `${sobConfig.className}.ts`);
            }
            let gen = new sObjectGenerator_1.SObjectGenerator(classSource, sobConfig, sobConfigs);
            try {
                let source = yield gen.generateFile();
                if (!singleFileMode) {
                    source.formatText();
                    if (save) {
                        yield source.save();
                    }
                    else {
                        console.log(source.getText());
                    }
                }
            }
            catch (error) {
                console.log(error);
                process.exit(1);
            }
        }
        index.formatText();
        if (save) {
            yield index.save();
        }
        else {
            console.log(index.getText());
        }
        spinner.stop();
    });
}
function sanitizeClassName(sobConfig) {
    if (sobConfig.autoConvertNames) {
        return (0, util_1.cleanAPIName)(sobConfig.apiName, sobConfig.keepNamespaces);
    }
    return sobConfig.apiName;
}
//# sourceMappingURL=index.js.map