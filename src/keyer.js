"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_readline_1 = require("node:readline");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var index_1 = require("./index");
var yardPkg = require("yargs");
var helpers_1 = require("yargs/helpers");
var yargs = yardPkg.default;
// Keyer CLI
var createCli = function () {
    yargs((0, helpers_1.hideBin)(process.argv)).command('$0', 'Keyer library commands', function (yargs) {
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
    }, function (argv) {
        if (argv.version)
            console.log('Keyer version: ' + require('../package.json').version);
        else if (argv.help)
            console.log('Keyer help:');
        else
            script({ envArg: argv.envFile, hashArg: argv.hashFile });
    }).argv;
};
// Keyer script
var script = function (props) {
    var envArg = props.envArg, hashArg = props.hashArg;
    var rl = (0, node_readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout,
    });
    var envFile = envArg !== null && envArg !== void 0 ? envArg : '.env';
    var hashFile = hashArg !== null && hashArg !== void 0 ? hashArg : 'keyer/encrypted-hash.txt';
    // Question for kind of crypto
    rl.question('Kind of crypto - encrypt(e) or decrypt(d): ', function (keyKindCrypto) {
        if (!keyKindCrypto ||
            !['e', 'd'].some(function (resp) { return resp === keyKindCrypto; }))
            throw new Error('Kind of crypto is required');
        var kindCrypto = keyKindCrypto === 'e' ? 'encrypt' : 'decrypt';
        // Question for secret salt
        rl.question("Enter Secret Salt for ".concat(kindCrypto, ": "), function (salt) {
            if (!salt)
                throw new Error('Salt is required');
            if (keyKindCrypto === 'e') {
                // Encrypt envs and create hash file
                var envs = (0, node_fs_1.readFileSync)(envFile, 'utf-8');
                var encrypted = (0, index_1.encryptAny)({
                    secretSalt: salt,
                    toEncrypt: envs,
                });
                // Verifica si el archivo existe
                if (!(0, node_fs_1.existsSync)(hashFile)) {
                    // Verifica si el directorio existe
                    var dir = (0, node_path_1.dirname)(hashFile);
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
                var hash = (0, node_fs_1.readFileSync)(hashFile, 'utf-8');
                (0, index_1.decryptAny)({ secretSalt: salt, toDecrypt: hash });
            }
            rl.close();
        });
    });
};
createCli();
