import { createInterface } from 'node:readline';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { decryptAny, encryptAny } from './index';
import * as yargsPkg from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = yargsPkg.default;
// Keyer CLI
const createCli = () => {
    yargs(hideBin(process.argv)).command('$0', 'Keyer library commands', (yargs) => {
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
    const rl = createInterface({
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
                const envs = readFileSync(envFile, 'utf-8');
                const encrypted = encryptAny({
                    secretSalt: salt,
                    toEncrypt: envs,
                });
                // Verifica si el archivo existe
                if (!existsSync(hashFile)) {
                    // Verifica si el directorio existe
                    const dir = dirname(hashFile);
                    if (!existsSync(dir)) {
                        // Crea el directorio
                        mkdirSync(dir, { recursive: true });
                    }
                }
                writeFileSync(hashFile, encrypted, {
                    encoding: 'utf-8',
                    flag: 'w',
                });
            }
            else if (keyKindCrypto === 'd') {
                // Decrypt hash file and show envs in console
                const hash = readFileSync(hashFile, 'utf-8');
                decryptAny({ secretSalt: salt, toDecrypt: hash });
            }
            rl.close();
        });
    });
};
createCli();
