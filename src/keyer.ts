import { createInterface } from 'node:readline';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { decryptAny, encryptAny } from './exports';
import { createCli, defaultFiles } from './cli';

// Keyer script
export const keyerCommand = (props?: {
	encryptArg?: string;
	decryptArg?: string;
	decryptedArg?: string;
}) => {
	console.log('keyerCommand', props);
	const { encryptArg, decryptArg, decryptedArg } = props ?? {};
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const encryptFile = encryptArg ?? defaultFiles.encryptFile;
	const decryptFile = decryptArg ?? defaultFiles.decryptFile;
	const decryptedFile = decryptedArg ?? defaultFiles.decryptedFile;

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
					const envs = readFileSync(encryptFile, 'utf-8');
					const encrypted = encryptAny({
						secretSalt: salt,
						toEncrypt: envs,
					});
					// Verfiy if file exist
					createFolderAndFile(decryptFile);
					// Create hash file
					writeFileSync(decryptFile, encrypted, {
						encoding: 'utf-8',
						flag: 'w',
					});
				} else if (keyKindCrypto === 'd') {
					// Decrypt hash file and show envs in console
					const hash = readFileSync(decryptFile, 'utf-8');
					const decryptedVar = decryptAny({
						secretSalt: salt,
						toDecrypt: hash,
					});
					if (!!decryptedArg) {
						// Verfiy if file exist
						createFolderAndFile(decryptedFile);
						// Create env file
						writeFileSync(decryptedFile, decryptedVar, {
							encoding: 'utf-8',
							flag: 'w',
						});
					}
				}
				rl.close();
			});
		}
	);
};

const createFolderAndFile = (file: string) => {
	if (!existsSync(file)) {
		// Verify if folder exist
		const dir = dirname(file);
		if (!existsSync(dir)) {
			// Crea el directorio
			mkdirSync(dir, { recursive: true });
		}
	}
};

export const keyer = () => {
	const cli = createCli();
};

keyer();
