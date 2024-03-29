import { createInterface } from 'node:readline';
import { readFileSync, writeFileSync } from 'node:fs';

import { decryptAny, encryptAny } from '.';
import { defaultFiles } from './cli-props';
import {
	IKeyerCommandProps,
	IKeyerDecryptProps,
	IKeyerProps,
} from './interfaces/keyer.interface';
import { createFolderAndFile } from './helpers/files.helper';

// Keyer script
export const keyerCommand = (props: IKeyerCommandProps) => {
	const { encryptRoute, encryptedRoute, decryptedRoute } = props ?? {};
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const encryptFile = encryptRoute ?? defaultFiles.encryptRoute;
	const encryptedFile = encryptedRoute ?? defaultFiles.encryptRoute;
	const decryptedFile = decryptedRoute ?? defaultFiles.decryptedRoute;

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
				if (keyKindCrypto === 'e') {
					encryptCommand({
						file: encryptFile,
						output: encryptedFile,
						salt,
					});
					rl.close();
				} else if (keyKindCrypto === 'd') {
					rl.question(`Do you want create output?(y/n): `, (resp) => {
						if (!resp || !['y', 'n'].some((resp) => resp === resp))
							throw new Error("Response must have 'y' or 'n'");
						decryptCommand({
							file: encryptedFile,
							output: decryptedFile,
							salt,
							createOutput: resp === 'y' ? true : false,
						});
						rl.close();
					});
				}
			});
		}
	);
};

export const encryptCommand = (props: IKeyerProps) => {
	const { file, output, salt } = props;
	if (!salt) throw new Error('Salt is required');
	console.log(`Encrypting file ${file}...`);
	console.log(`Props: ${JSON.stringify({ file, output, salt })}`);
	// Encrypt envs and create hash file
	const envs = readFileSync(file, 'utf-8');
	const encrypted = encryptAny({
		secretSalt: salt,
		toEncrypt: envs,
		showLog: false,
	});
	// Verfiy if file exist
	createFolderAndFile(output);
	// Create hash file
	writeFileSync(output, encrypted, {
		encoding: 'utf-8',
		flag: 'w',
	});
	console.log('Encrypted in ', output);
};

export const decryptCommand = (props: IKeyerDecryptProps) => {
	const { file, output, salt, createOutput = false } = props;
	if (!salt) throw new Error('Salt is required');
	console.log(`Decrypting file ${file}...`);
	console.log(
		`Props: ${JSON.stringify({ file, output, salt, createOutput })}`
	);
	const hash = readFileSync(file, 'utf-8');
	const decryptedVar = decryptAny({
		secretSalt: salt,
		toDecrypt: hash,
		showLog: false,
	});
	if (!!output && createOutput) {
		// Verfiy if file exist
		createFolderAndFile(output);
		// Create env file
		writeFileSync(output, decryptedVar, {
			encoding: 'utf-8',
			flag: 'w',
		});
		console.log('Decrypted in ', output);
	} else console.log('Decrypted data: ', decryptedVar); // Decrypt hash file and show envs in console
};
