import { spawnSync } from 'child_process';
import * as path from 'path';
import {
	commonAfterAndBefore,
	createInputFile,
	decryptedFile,
	encryptedFile,
	inputFile,
	salt,
} from './constants/common.constant';

const cliPath = path.join(__dirname, '..', 'src', 'keyer.ts');

describe('CLI Tests', () => {
	// MOCKS
	jest.mock(cliPath, () => ({
		encryptCommand: jest.fn(),
		decryptCommand: jest.fn(),
	}));
	// COMMON AFTER AND BEFORE
	commonAfterAndBefore();
	afterEach(() => {
		jest.clearAllMocks();
	});
	it('Test Mocks correctly', () => {
		const { encryptCommand, decryptCommand } = require(cliPath);
		encryptCommand({ file: inputFile, output: encryptedFile, salt });
		expect(encryptCommand).toHaveBeenCalled();
		expect(encryptCommand).toHaveBeenCalledWith({
			file: inputFile,
			output: encryptedFile,
			salt,
		});
		decryptCommand({
			file: encryptedFile,
			salt,
			output: decryptedFile,
			createOutput: true,
		});
	});
	it('Must execute encrypt command', () => {
		createInputFile();
		const { encryptCommand } = require(cliPath);
		console.log(encryptCommand);
		const result = spawnSync('tsx', [
			cliPath,
			'encrypt',
			'--file',
			inputFile,
			'--output',
			encryptedFile,
			'--salt',
			salt,
		]);
		// console.log(result);
		expect(encryptCommand).toHaveBeenCalledWith({
			file: inputFile,
			output: encryptedFile,
			salt,
		});
	});

	// it('Must execute decrypt command', () => {
	// 	const { decryptCommand } = require(cliPath);
	// 	const result = spawnSync('node', [
	// 		cliPath,
	// 		'decrypt',
	// 		'--file',
	// 		'test.txt',
	// 		'--salt',
	// 		salt,
	// 	]);
	// 	expect(decryptCommand).toHaveBeenCalledWith({
	// 		file: 'test.txt',
	// 		salt,
	// 	});
	// 	// Asegúrate de que la salida sea la esperada
	// });
});
