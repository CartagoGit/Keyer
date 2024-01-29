"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyer = exports.decryptCommand = exports.encryptCommand = exports.keyerCommand = void 0;
var node_readline_1 = require("node:readline");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var _1 = require(".");
var cli_1 = require("./cli");
var cli_props_1 = require("./cli-props");
// Keyer script
var keyerCommand = function (props) {
    var _a = props !== null && props !== void 0 ? props : {}, encryptRoute = _a.encryptRoute, encryptedRoute = _a.encryptedRoute, decryptedRoute = _a.decryptedRoute;
    var rl = (0, node_readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout,
    });
    var encryptFile = encryptRoute !== null && encryptRoute !== void 0 ? encryptRoute : cli_props_1.defaultFiles.encryptRoute;
    var encryptedFile = encryptedRoute !== null && encryptedRoute !== void 0 ? encryptedRoute : cli_props_1.defaultFiles.encryptRoute;
    var decryptedFile = decryptedRoute !== null && decryptedRoute !== void 0 ? decryptedRoute : cli_props_1.defaultFiles.decryptedRoute;
    // Question for kind of crypto
    rl.question('Kind of crypto - encrypt(e) or decrypt(d): ', function (keyKindCrypto) {
        if (!keyKindCrypto ||
            !['e', 'd'].some(function (resp) { return resp === keyKindCrypto; }))
            throw new Error('Kind of crypto is required');
        var kindCrypto = keyKindCrypto === 'e' ? 'encrypt' : 'decrypt';
        // Question for secret salt
        rl.question("Enter Secret Salt for ".concat(kindCrypto, ": "), function (salt) {
            if (keyKindCrypto === 'e') {
                (0, exports.encryptCommand)({
                    file: encryptFile,
                    output: encryptedFile,
                    salt: salt,
                });
                rl.close();
            }
            else if (keyKindCrypto === 'd') {
                rl.question("Do you want create output?(y/n): ", function (resp) {
                    if (!resp || !['y', 'n'].some(function (resp) { return resp === resp; }))
                        throw new Error("Response must have 'y' or 'n'");
                    (0, exports.decryptCommand)({
                        file: encryptedFile,
                        output: decryptedFile,
                        salt: salt,
                        createOutput: resp === 'y' ? true : false,
                    });
                    rl.close();
                });
            }
        });
    });
};
exports.keyerCommand = keyerCommand;
var encryptCommand = function (props) {
    var file = props.file, output = props.output, salt = props.salt;
    if (!salt)
        throw new Error('Salt is required');
    console.log("Encrypting file ".concat(file, "..."));
    // Encrypt envs and create hash file
    var envs = (0, node_fs_1.readFileSync)(file, 'utf-8');
    var encrypted = (0, _1.encryptAny)({
        secretSalt: salt,
        toEncrypt: envs,
        showLog: false,
    });
    // Verfiy if file exist
    createFolderAndFile(output);
    // Create hash file
    (0, node_fs_1.writeFileSync)(output, encrypted, {
        encoding: 'utf-8',
        flag: 'w',
    });
    console.log('Encrypted in ', output);
};
exports.encryptCommand = encryptCommand;
var decryptCommand = function (props) {
    var file = props.file, output = props.output, salt = props.salt, _a = props.createOutput, createOutput = _a === void 0 ? false : _a;
    if (!salt)
        throw new Error('Salt is required');
    console.log("Decrypting file ".concat(file, "..."));
    var hash = (0, node_fs_1.readFileSync)(file, 'utf-8');
    var decryptedVar = (0, _1.decryptAny)({
        secretSalt: salt,
        toDecrypt: hash,
        showLog: false,
    });
    if (!!output && createOutput) {
        // Verfiy if file exist
        createFolderAndFile(output);
        // Create env file
        (0, node_fs_1.writeFileSync)(output, decryptedVar, {
            encoding: 'utf-8',
            flag: 'w',
        });
        console.log('Decrypted in ', output);
    }
    else
        console.log('Decrypted data: ', decryptedVar); // Decrypt hash file and show envs in console
};
exports.decryptCommand = decryptCommand;
var createFolderAndFile = function (file) {
    if (!(0, node_fs_1.existsSync)(file)) {
        // Verify if folder exist
        var dir = (0, node_path_1.dirname)(file);
        if (!(0, node_fs_1.existsSync)(dir)) {
            // Crea el directorio
            (0, node_fs_1.mkdirSync)(dir, { recursive: true });
        }
    }
};
var keyer = function () {
    var cli = (0, cli_1.createCli)();
};
exports.keyer = keyer;
(0, exports.keyer)();
