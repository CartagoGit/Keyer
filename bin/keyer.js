#!/usr/bin/env node
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
const node_readline_1 = require("node:readline");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const index_1 = require("./index");
const yargsPkg = __importStar(require("yargs"));
const helpers_1 = require("yargs/helpers");
const yargs = yargsPkg.default;
// Keyer CLI
const createCli = () => {
    yargs((0, helpers_1.hideBin)(process.argv)).command('$0', 'Keyer library commands', (yargs) => {
        return yargs
            .version(false)
            .option('env-file', {
            alias: 'ef',
            description: 'Route where is the file for encrypting',
            type: 'string',
        })
            .option('hash-file', {
            alias: 'hf',
            description: 'Route for the new hash file',
            type: 'string',
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
    }, (argv) => {
        if (argv.version)
            console.log('Keyer version: ' + require('../package.json').version);
        else if (argv.help)
            console.log('Keyer help:');
        else
            script({ envArg: argv.envFile, hashArg: argv.hashFile });
    }).argv;
};
// Keyer script
const script = (props) => {
    const { envArg, hashArg } = props;
    const rl = (0, node_readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout,
    });
    const envFile = envArg ?? '.env';
    const hashFile = hashArg ?? 'keyer/encrypted-hash.txt';
    // Question for kind of crypto
    rl.question('Kind of crypto - encrypt(e) or decrypt(d): ', (keyKindCrypto) => {
        if (!keyKindCrypto ||
            !['e', 'd'].some((resp) => resp === keyKindCrypto))
            throw new Error('Kind of crypto is required');
        const kindCrypto = keyKindCrypto === 'e' ? 'encrypt' : 'decrypt';
        // Question for secret salt
        rl.question(`Enter Secret Salt for ${kindCrypto}: `, (salt) => {
            if (!salt)
                throw new Error('Salt is required');
            if (keyKindCrypto === 'e') {
                // Encrypt envs and create hash file
                const envs = (0, node_fs_1.readFileSync)(envFile, 'utf-8');
                const encrypted = (0, index_1.encryptAny)({
                    secretSalt: salt,
                    toEncrypt: envs,
                });
                // Verifica si el archivo existe
                if (!(0, node_fs_1.existsSync)(hashFile)) {
                    // Verifica si el directorio existe
                    const dir = (0, node_path_1.dirname)(hashFile);
                    if (!(0, node_fs_1.existsSync)(dir)) {
                        // Crea el directorio
                        (0, node_fs_1.mkdirSync)(dir, { recursive: true });
                    }
                }
                (0, node_fs_1.writeFileSync)(hashFile, encrypted, {
                    encoding: 'utf-8',
                    flag: 'w',
                });
            }
            else if (keyKindCrypto === 'd') {
                // Decrypt hash file and show envs in console
                const hash = (0, node_fs_1.readFileSync)(hashFile, 'utf-8');
                (0, index_1.decryptAny)({ secretSalt: salt, toDecrypt: hash });
            }
            rl.close();
        });
    });
};
createCli();
