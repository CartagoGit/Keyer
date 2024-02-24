import { existsSync, readFileSync } from 'node:fs';
import {
	commonAfterAndBefore,
	createInputFile,
	decryptedFile,
	encryptedFile,
	inputFile,
	testText,
	salt,
} from './constants/common.constant';
import { decryptCommand, encryptCommand } from '../src/commands';

describe('commands', () => {
	// COMMON VARIABLES AND FUNCTIONS

	const createEncryptedFile = () =>
		encryptCommand({ file: inputFile, output: encryptedFile, salt });
	const createDecryptedFile = () =>
		decryptCommand({
			file: encryptedFile,
			output: decryptedFile,
			salt,
			createOutput: true,
		});

	//* COMMON AFTER AND BEFORE FUNCTIONS
	commonAfterAndBefore();

	//* -> TESTS
	it('encryptCommand -> Must encrypt a file', () => {
		// Create the input file
		createInputFile();
		// Create the encrypted file
		createEncryptedFile();
		// Verify that the encrypted file exists and is different from the test
		expect(existsSync(inputFile)).toBe(true);
		expect(existsSync(encryptedFile)).toBe(true);
		expect(readFileSync(encryptedFile, 'utf-8')).not.toBe(testText);
	});
	it('decryptCommand -> Must decrypt a file', () => {
		createInputFile();
		createEncryptedFile();
		// Decrypt the encrypted file
		createDecryptedFile();
		// Verify that the decrypted file exists and is equal to the test
		expect(existsSync(decryptedFile)).toBe(true);
		expect(readFileSync(decryptedFile, 'utf-8')).toBe(testText);
	});
});
