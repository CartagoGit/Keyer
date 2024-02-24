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
	beforeAll(() => {
		originalLogs.log = console.log;
		console.log = jest.fn();
	});
	afterAll(() => (console.log = originalLogs.log));
};

export const createInputFile = () =>
	writeFileSync(inputFile, originalText, 'utf-8');

export const outputFolder = resolve(__dirname, '..', 'outputs');
export const inputFile = resolve(outputFolder, 'test-input.txt');
export const encryptedFile = resolve(outputFolder, 'test-encrypted.txt');
export const decryptedFile = resolve(outputFolder, 'test-decrypted.txt');

export const salt = 'salt';
export const originalText = 'Original Test Text';
export const originalObject = { name: 'Test', age: 25 };
export const originalArray = ['Test', 25];
export const originalNumber = 25;
export const originalBoolean = true;
export const originalNull = null;
export const originalUndefined = undefined;
export const originalFunction = function () {};
export const originalLambdaFunction = () => {};
export const originalDate = new Date();
export const originalError = new Error('Test');
export const originalRegExp = /test/;
export const originalMap = new Map();
export const originalSet = new Set();
export const originalSymbol = Symbol('test');
export const originalBigInt = BigInt(25);
export const originalAny = {
	text: originalText,
	object: originalObject,
	array: originalArray,
	number: originalNumber,
	boolean: originalBoolean,
	null: originalNull,
	undefined: originalUndefined,
	function: originalFunction,
	lambdaFunction: originalLambdaFunction,
	date: originalDate,
	error: originalError,
	regExp: originalRegExp,
	map: originalMap,
	set: originalSet,
	symbol: originalSymbol,
	bigInt: originalBigInt,
};
