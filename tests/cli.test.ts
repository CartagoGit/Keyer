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

const srcPath = path.resolve(__dirname, '..', 'src');
const tsIndex = path.join(srcPath, 'index.ts');
const tsKeyer = path.join(srcPath, 'keyer.ts');

describe('CLI Tests', () => {
	// COMMON AFTER AND BEFORE
	commonAfterAndBefore();

	beforeEach(() => {
		jest.mock(tsIndex, () => ({
			encryptCommand: jest.fn(),
			decryptCommand: jest.fn(),
		}));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// -> TESTS
	it('Test Mocks correctly', () => {
		const { encryptCommand, decryptCommand } = require(tsIndex);
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
	it('Must execute encrypt command', () => {
		const { encryptCommand } = require(tsIndex);
		createInputFile();
		const result = spawnSync('npx', [
			'tsx',
			tsKeyer,
			'encrypt',
			'--file',
			inputFile,
			'--output',
			encryptedFile,
			'--salt',
			salt,
		]);
		console.log(result);
		expect(encryptCommand).toHaveBeenCalledWith({
			file: inputFile,
			output: encryptedFile,
			salt,
		});
	});

	// it('Must execute decrypt command', () => {
	// 	const { decryptCommand } = require(jsCliPath);
	// 	const result = spawnSync('node', [
	// 		jsCliFile,
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
