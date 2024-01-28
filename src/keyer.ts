import { createInterface } from 'node:readline';
import { readFileSync, writeFileSync } from 'node:fs';
import { decryptAny, encryptAny } from './index';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).command(
	'$0',
	'Keyer command',
	(yargs) => {
		return yargs
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
	},
	(argv) => {
		if (argv.version) {
			console.log('Version: ' + process.env.npm_package_version);
		} else if (argv.help) {
			console.log('Ayuda de la biblioteca...');
		} else {
			script({ envArg: argv.envFile, hashArg: argv.hashFile });
		}
	}
).argv;

const script = (props: { envArg?: string; hashArg?: string }) => {
	const { envArg, hashArg } = props;
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	// Get args from command line like --env-file='.env' --hash-file='keyer/encrypted-hash.txt'
	// const getArg = (arg: string) => {
	// 	arg = arg.replace(/["']/g, '');
	// 	const argIndexFound = process.argv.findIndex((argText) =>
	// 		arg.includes(`--${argText}`)
	// 	);
	// 	if (argIndexFound === -1) return;
	// 	const preArgFoung = process.argv[argIndexFound];
	// 	if (preArgFoung.includes('=')) return preArgFoung.split('=')[1];
	// 	else {
	// 		const nextArg = process.argv[argIndexFound + 1];
	// 		if (nextArg && !nextArg.includes('--')) return nextArg;
	// 	}
	// };

	// const envArg = getArg('--env-file') || getArg('--envFile');
	// const hashArg = getArg('--hash-file') || getArg('--hashFile');

	const envFile = envArg ?? '.env';
	const hashFile = hashArg ?? 'keyer/encrypted-hash.txt';

	// Question for kind of crypto
	rl.question(
		'Kind of crypto - encrypt(e) or decrypt(d): ',
		(keyKindCrypto) => {
			if (
				!keyKindCrypto ||
				!['e', 'd'].some((resp) => resp === keyKindCrypto)
			)
				throw new Error('Kind of crypto is required');
			const kindCrypto = keyKindCrypto === 'e' ? 'encrypt' : 'decrypt';
			// Question for secret salt
			rl.question(`Enter Secret Salt for ${kindCrypto}: `, (salt) => {
				if (!salt) throw new Error('Salt is required');
				if (keyKindCrypto === 'e') {
					// Encrypt envs and create hash file
					const envs = readFileSync(envFile, 'utf-8');
					const encrypted = encryptAny({
						secretSalt: salt,
						toEncrypt: envs,
					});
					writeFileSync(hashFile, encrypted);
				} else if (keyKindCrypto === 'd') {
					// Decrypt hash file and show envs in console
					const hash = readFileSync(hashFile, 'utf-8');
					decryptAny({ secretSalt: salt, toDecrypt: hash });
				}
				rl.close();
			});
		}
	);
};
