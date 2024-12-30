import { spawnSync } from 'node:child_process';
import * as path from 'node:path';
import {
	commonAfterAndBefore,
	createInputFile,
	decryptedFile,
	encryptedFile,
	inputFile,
	salt,
} from './constants/common.constant';
import pkg from '../package.json';

describe('CLI Tests', () => {
	const srcPath = path.resolve(__dirname, '..', 'src');
	const tsCommands = path.join(srcPath, 'commands.ts');
	const tsKeyer = path.join(srcPath, 'keyer.ts');
	// COMMON AFTER AND BEFORE
	commonAfterAndBefore();

	// -> TESTS
	it('Test Mocks correctly', () => {
		jest.mock(tsCommands, () => {
			return {
				encryptCommand: jest.fn(),
				decryptCommand: jest.fn(),
			};
		});
		const { encryptCommand, decryptCommand } = require(tsCommands);
		createInputFile();
		const encryptProps = { file: inputFile, output: encryptedFile, salt };
		const decryptedProps = {
			file: encryptedFile,
			salt,
			output: decryptedFile,
			createOutput: true,
		};
		encryptCommand(encryptProps);
		expect(encryptCommand).toHaveBeenCalled();
		expect(encryptCommand).toHaveBeenCalledWith(encryptProps);
		decryptCommand(decryptedProps);
		expect(decryptCommand).toHaveBeenCalled();
		expect(decryptCommand).toHaveBeenCalledWith(decryptedProps);
	});

	it('Command version must be called', () => {
		const resultCommon = spawnSync('bun', [tsKeyer, '--version']);
		const resultShort = spawnSync('bun', [tsKeyer, '-v']);
		expect(resultCommon.stdout.toString()).toContain(pkg.version);
		expect(resultShort.stdout.toString()).toContain(pkg.version);
	});

	it('Command help must be called', () => {
		const resultCommon = spawnSync('bun', [tsKeyer, '--help']);
		const resultShort = spawnSync('bun', [tsKeyer, '-h']);
		expect(resultCommon.stdout.toString()).toContain(
			'Usage: keyer [options] [command]'
		);
		expect(resultShort.stdout.toString()).toContain(
			'Usage: keyer [options] [command]'
		);
	});
	it('Must execute encrypt with normal options', () => {
		createInputFile();
		const result = spawnSync('bun', [
			tsKeyer,
			'encrypt',
			'--file',
			inputFile,
			'--output',
			encryptedFile,
			'--salt',
			salt,
		]);
		const resulText = result.stdout.toString();
		expect(resulText).toContain('Encrypting file');
		expect(resulText).toContain('Encrypted in');
		expect(resulText).toContain(
			`Props: ${JSON.stringify({
				file: inputFile,
				output: encryptedFile,
				salt,
			})}`
		);
	});
	it('Must execute encrypt with short options', () => {
		createInputFile();
		const result = spawnSync('bun', [
			tsKeyer,
			'encrypt',
			'-f',
			inputFile,
			'-o',
			encryptedFile,
			'-s',
			salt,
		]);
		const resulText = result.stdout.toString();
		expect(resulText).toContain('Encrypting file');
		expect(resulText).toContain('Encrypted in');
		expect(resulText).toContain(
			`Props: ${JSON.stringify({
				file: inputFile,
				output: encryptedFile,
				salt,
			})}`
		);
	});

	it('Must execute decrypt with normal options', () => {
		createInputFile();
		spawnSync('bun', [
			tsKeyer,
			'encrypt',
			'--file',
			inputFile,
			'--output',
			encryptedFile,
			'--salt',
			salt,
		]);
		const result = spawnSync('bun', [
			tsKeyer,
			'decrypt',
			'--file',
			encryptedFile,
			'--output',
			decryptedFile,
			'--salt',
			salt,
			'--create-output',
		]);
		const resulText = result.stdout.toString();
		expect(resulText).toContain('Decrypting file');
		expect(resulText).toContain('Decrypted');
		expect(resulText).toContain(
			`Props: ${JSON.stringify({
				file: encryptedFile,
				output: decryptedFile,
				salt,
				createOutput: true,
			})}`
		);
	});
	it('Must execute decrypt with short options', () => {
		createInputFile();
		spawnSync('bun', [
			tsKeyer,
			'encrypt',
			'-f',
			inputFile,
			'-o',
			encryptedFile,
			'-s',
			salt,
		]);
		const result = spawnSync('bun', [
			tsKeyer,
			'decrypt',
			'-f',
			encryptedFile,
			'-o',
			decryptedFile,
			'-s',
			salt,
			'-co',
		]);
		const resulText = result.stdout.toString();
		expect(resulText).toContain('Decrypting file');
		expect(resulText).toContain('Decrypted');
		expect(resulText).toContain(
			`Props: ${JSON.stringify({
				file: encryptedFile,
				output: decryptedFile,
				salt,
				createOutput: true,
			})}`
		);
	});
	it('Command encrypt help must be called', () => {
		const resultCommon = spawnSync('bun', [
			tsKeyer,
			'encrypt',
			'--help',
		]);
		const resultShort = spawnSync('bun', [tsKeyer, 'encrypt', '-h']);
		expect(resultCommon.stdout.toString()).toContain(
			'Usage: keyer encrypt [options]'
		);
		expect(resultShort.stdout.toString()).toContain(
			'Usage: keyer encrypt [options]'
		);
	});
	it('Command decrypt help must be called', () => {
		const resultCommon = spawnSync('bun', [
			tsKeyer,
			'decrypt',
			'--help',
		]);
		const resultShort = spawnSync('bun', [tsKeyer, 'decrypt', '-h']);
		expect(resultCommon.stdout.toString()).toContain(
			'Usage: keyer decrypt [options]'
		);
		expect(resultShort.stdout.toString()).toContain(
			'Usage: keyer decrypt [options]'
		);
	});
	it('Command encrypt must fail with invalid file', () => {
		const result = spawnSync('bun', [
			tsKeyer,
			'encrypt',
			'--file',
			'invalid-file.txt',
			'--salt',
			salt,
		]);
		expect(result.stderr.toString()).toContain('ENOENT');
	});
	it('Command decrypt must fail with invalid file', () => {
		const result = spawnSync('bun', [
			tsKeyer,
			'decrypt',
			'--file',
			'invalid-file.txt',
			'--salt',
			salt,
		]);
		expect(result.stderr.toString()).toContain('ENOENT');
	});
	it('Command encrypt/decrypt must fail without required options', () => {
		createInputFile();
		const encryptResult = spawnSync('bun', [tsKeyer, 'encrypt']);
		expect(encryptResult.stderr.toString()).toContain(
			'error: required option'
		);
		const decryptResult = spawnSync('bun', [tsKeyer, 'decrypt']);
		expect(decryptResult.stderr.toString()).toContain(
			'error: required option'
		);
	});
});
