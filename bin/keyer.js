"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyer = void 0;
const node_readline_1 = require("node:readline");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const exports_1 = require("./exports");
const cli_1 = require("./cli");
// Keyer script
const keyerCommand = (props) => {
    const { envArg, hashArg } = props || {};
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
                const encrypted = (0, exports_1.encryptAny)({
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
                (0, exports_1.decryptAny)({ secretSalt: salt, toDecrypt: hash });
            }
            rl.close();
        });
    });
};
const keyer = () => {
    const cli = (0, cli_1.createCli)();
    console.log('cli', cli);
};
exports.keyer = keyer;
(0, exports.keyer)();
