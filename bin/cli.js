"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCli = void 0;
const yargsPkg = __importStar(require("yargs"));
const helpers_1 = require("yargs/helpers");
// Keyer CLI
const createCli = () => {
    const yargs = yargsPkg.default;
    console.log(yargs().argv);
    return yargs((0, helpers_1.hideBin)(process.argv)).command('$0', // command name
    'Keyer library CLI', // command description
    (yargs) => createCLiOptions(yargs), (argv) => {
        console.log('Keyer CLI', argv);
        if (argv.version)
            console.log('Keyer version: ' + require('../package.json').version);
        else if (argv.help)
            console.log('Keyer help:');
        // else script({ envArg: argv.envFile, hashArg: argv.hashFile });
    }).argv;
};
exports.createCli = createCli;
// Cli Options
const createCLiOptions = (yargs) => {
    return yargs
        .version(false)
        .option('encryptFile', {
        alias: 'ef',
        description: 'Route where is the file for encrypting for automatic cli - Default: /.env',
        type: 'string',
    })
        .option('decryptFile', {
        alias: 'df',
        description: 'Route for the new hash file for automatic cli - Default: /keyer/encrypted-hash.txt',
        type: 'string',
    })
        .option('encrypt', {
        alias: 'e',
        description: 'Use de encrypt method in the route file',
        type: 'boolean',
    })
        .option('decrypt', {
        alias: 'd',
        description: 'Use de decrypt method in the route file',
        type: 'boolean',
    })
        .option('version', {
        alias: 'v',
        description: 'Library version',
        type: 'boolean',
    })
        .option('help', {
        alias: 'h',
        description: 'Library help',
        type: 'boolean',
    });
};
