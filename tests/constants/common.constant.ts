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
	writeFileSync(inputFile, testAny.text, 'utf-8');

export const outputFolder = resolve(__dirname, '..', 'outputs');
export const inputFile = resolve(outputFolder, 'test-input.txt');
export const encryptedFile = resolve(outputFolder, 'test-encrypted.txt');
export const decryptedFile = resolve(outputFolder, 'test-decrypted.txt');

export const salt = 'salt';

export class TestClass {
	prop: boolean = true;
	constructor(public name: string, public age: number) {}
	someFunction() {}
}
export const testAny = {
	text: 'Any Test Text',
	object: { name: 'Test', age: 25 },
	array: ['Test', 25],
	number: 25,
	boolean: true,
	null: null,
	undefined: undefined,
	function: function () {},
	lambdaFunction: () => {},
	// date: new Date(),
	error: new Error('Test'),
	// regExp: /test/,
	map: new Map(),
	set: new Set(),
	// symbol: Symbol('test'),
	// bigInt: BigInt(25),
	// bigIntNum:  25n,
	class: new TestClass('Test', 25),
};


