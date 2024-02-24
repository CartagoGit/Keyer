import { resolve } from 'node:path';

import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { cleanLogsInTests, outputFolder } from './constants/common.constant';
import { decryptCommand, encryptCommand } from '../src/commands';

describe('commands', () => {
	// COMMON VARIABLES AND FUNCTIONS
	const inputFile = resolve(outputFolder, 'test-input.txt');
	const encryptedFile = resolve(outputFolder, 'test-encrypted.txt');
	const decryptedFile = resolve(outputFolder, 'test-decrypted.txt');
	const salt = 'salt';
	const originalText = 'Original Test Text';
	const createInputFile = () =>
		writeFileSync(inputFile, originalText, 'utf-8');
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
	afterEach(() => {
		// After each test, delete the files
		const files = [inputFile, encryptedFile, decryptedFile];
		files.forEach((file) => {
			if (existsSync(file)) unlinkSync(file);
		});
	});
	cleanLogsInTests();

	//* -> TESTS
	it('encryptCommand -> should encrypt a file', async () => {
		// Create the input file
		createInputFile();
		// Create the encrypted file
		createEncryptedFile();
		// Verify that the encrypted file exists and is different from the original
		expect(existsSync(inputFile)).toBe(true);
		expect(existsSync(encryptedFile)).toBe(true);
		expect(readFileSync(encryptedFile, 'utf-8')).not.toBe(originalText);
	});
	it('decryptCommand -> should decrypt a file', () => {
		createInputFile();
		createEncryptedFile();
		// Decrypt the encrypted file
		createDecryptedFile();
		// Verify that the decrypted file exists and is equal to the original
		expect(existsSync(decryptedFile)).toBe(true);
		expect(readFileSync(decryptedFile, 'utf-8')).toBe(originalText);
	});
});
