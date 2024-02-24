import { spawnSync } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
	commonAfterAndBefore,
	createInputFile,
	decryptedFile,
	encryptedFile,
	inputFile,
	salt,
} from './constants/common.constant';

// const cliPath = path.join(__dirname, '..', 'src', 'keyer.ts');

describe('CLI Tests', () => {
	const outputPath = path.join(__dirname, 'outputs');
	const jsCliFile = path.join(outputPath, 'keyer.js');
	const jsKeyerFile = path.join(outputPath, 'index.js');
	// COMMON AFTER AND BEFORE
	commonAfterAndBefore();
	beforeAll(() => {
		const tsConfigFile = path.resolve(__dirname, '..', 'tsconfig.json');
		const compileResult = spawnSync('npx', [
			'tsc',
			'--project',
			tsConfigFile,
			'--outDir',
			outputPath,
		]);
		if (compileResult?.error) throw compileResult.error;
		jest.resetModules();
	});
	beforeEach(() => {
		// MOCKS
		jest.mock(jsKeyerFile, () => ({
			encryptCommand: jest.fn(),
			decryptCommand: jest.fn(),
		}));
	});
	afterEach(() => {
		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetModules();
		jest.clearAllMocks();
		const files = fs.readdirSync(outputPath);
		files.forEach((file) => {
			const filePath = path.join(outputPath, file);
			if (
				fs.lstatSync(filePath).isFile() &&
				path.extname(filePath) === '.js'
			) {
				fs.unlinkSync(filePath);
			} else if (fs.lstatSync(filePath).isDirectory()) {
				fs.rmdirSync(filePath, { recursive: true });
			}
		});
	});
	it('Test Mocks correctly', () => {
		const { encryptCommand, decryptCommand } = require(jsKeyerFile);
		createInputFile();
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
		const { encryptCommand } = require(jsKeyerFile);
		console.log(encryptCommand);
		const result = spawnSync('node', [
			jsCliFile,
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
