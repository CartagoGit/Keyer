"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyer = exports.decryptCommand = exports.encryptCommand = exports.keyerCommand = void 0;
const node_readline_1 = require("node:readline");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const _1 = require(".");
const cli_1 = require("./cli");
const cli_props_1 = require("./cli-props");
// Keyer script
const keyerCommand = (props) => {
    const { encryptRoute, encryptedRoute, decryptedRoute } = props ?? {};
    const rl = (0, node_readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout,
    });
    const encryptFile = encryptRoute ?? cli_props_1.defaultFiles.encryptRoute;
    const encryptedFile = encryptedRoute ?? cli_props_1.defaultFiles.encryptRoute;
    const decryptedFile = decryptedRoute ?? cli_props_1.defaultFiles.decryptedRoute;
    // Question for kind of crypto
    rl.question('Kind of crypto - encrypt(e) or decrypt(d): ', (keyKindCrypto) => {
        if (!keyKindCrypto ||
            !['e', 'd'].some((resp) => resp === keyKindCrypto))
            throw new Error('Kind of crypto is required');
        const kindCrypto = keyKindCrypto === 'e' ? 'encrypt' : 'decrypt';
        // Question for secret salt
        rl.question(`Enter Secret Salt for ${kindCrypto}: `, (salt) => {
            if (keyKindCrypto === 'e') {
                (0, exports.encryptCommand)({
                    file: encryptFile,
                    output: encryptedFile,
                    salt,
                });
                rl.close();
            }
            else if (keyKindCrypto === 'd') {
                rl.question(`Do you want create output?(y/n): `, (resp) => {
                    if (!resp || !['y', 'n'].some((resp) => resp === resp))
                        throw new Error("Response must have 'y' or 'n'");
                    (0, exports.decryptCommand)({
                        file: encryptedFile,
                        output: decryptedFile,
                        salt,
                        createOutput: resp === 'y' ? true : false,
                    });
                    rl.close();
                });
            }
        });
    });
};
exports.keyerCommand = keyerCommand;
const encryptCommand = (props) => {
    const { file, output, salt } = props;
    if (!salt)
        throw new Error('Salt is required');
    console.log(`Encrypting file ${file}...`);
    // Encrypt envs and create hash file
    const envs = (0, node_fs_1.readFileSync)(file, 'utf-8');
    const encrypted = (0, _1.encryptAny)({
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
const decryptCommand = (props) => {
    const { file, output, salt, createOutput = false } = props;
    if (!salt)
        throw new Error('Salt is required');
    console.log(`Decrypting file ${file}...`);
    const hash = (0, node_fs_1.readFileSync)(file, 'utf-8');
    const decryptedVar = (0, _1.decryptAny)({
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
const createFolderAndFile = (file) => {
    if (!(0, node_fs_1.existsSync)(file)) {
        // Verify if folder exist
        const dir = (0, node_path_1.dirname)(file);
        if (!(0, node_fs_1.existsSync)(dir)) {
            // Crea el directorio
            (0, node_fs_1.mkdirSync)(dir, { recursive: true });
        }
    }
};
const keyer = () => {
    const cli = (0, cli_1.createCli)();
};
exports.keyer = keyer;
(0, exports.keyer)();
