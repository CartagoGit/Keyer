import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export let originalLogs = {
	log: console.log,
	error: console.error,
	warn: console.warn,
	info: console.info,
};
export const commonAfterAndBefore = () => {
	afterEach(() => {
		// After each test, delete the files
		const files = [inputFile, encryptedFile, decryptedFile];
		files.forEach((file) => {
			if (existsSync(file)) unlinkSync(file);
		});
	});
	// beforeAll(() => {
	// 	originalLogs.log = console.log;
	// 	console.log = jest.fn();
	// });
	// afterAll(() => (console.log = originalLogs.log));
};

export const createInputFile = () =>
	writeFileSync(inputFile, testText, 'utf-8');

export const outputFolder = resolve(__dirname, '..', 'outputs');
export const inputFile = resolve(outputFolder, 'test-input.txt');
export const encryptedFile = resolve(outputFolder, 'test-encrypted.txt');
export const decryptedFile = resolve(outputFolder, 'test-decrypted.txt');

export const salt = 'salt';
export const testText = 'Any Test Text';
export const testObject = { name: 'Test', age: 25 };
export const testArray = ['Test', 25];
export const testNumber = 25;
export const testBoolean = true;
export const testNull = null;
export const testUndefined = undefined;
export const testFunction = function () {};
export const testLambdaFunction = () => {};
export const testDate = new Date();
export const testError = new Error('Test');
export const testRegExp = /test/;
export const testMap = new Map();
export const testSet = new Set();
export const testSymbol = Symbol('test');
export const testBigInt = BigInt(25);
export const testBigIntNum = 25n;
export const testAny = {
	text: testText,
	object: testObject,
	array: testArray,
	number: testNumber,
	boolean: testBoolean,
	null: testNull,
	undefined: testUndefined,
	function: testFunction,
	// lambdaFunction: testLambdaFunction,
	// date: testDate,
	// error: testError,
	// regExp: testRegExp,
	// map: testMap,
	// set: testSet,
	symbol: testSymbol,
	// bigInt: testBigInt,
	// bigIntNum: testBigIntNum,
};
