import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export let originalLogs = {
	log: console.log,
	error: console.error,
	warn: console.warn,
	info: console.info,
};
export const commonAfterAndBefore = () => {
	// After each test, delete the files
	afterEach(() => {
		const files = [inputFile, encryptedFile, decryptedFile];
		files.forEach((file) => {
			if (existsSync(file)) unlinkSync(file);
		});
	});
	// Clean console logs
	beforeAll(() => {
		originalLogs.log = console.log;
		originalLogs.info = console.info;
		console.log = jest.fn();
		console.info = jest.fn();
	});
	// Restore console logs
	afterAll(() => {
		console.log = originalLogs.log;
		console.info = originalLogs.info;
	});
};

export const createInputFile = () =>
	writeFileSync(inputFile, testAny.text, 'utf-8');

export const outputFolder = resolve(__dirname, '..', 'outputs');
export const inputFile = resolve(outputFolder, 'test-input.txt');
export const encryptedFile = resolve(outputFolder, 'test-encrypted.txt');
export const decryptedFile = resolve(outputFolder, 'test-decrypted.txt');

export const salt = 'Just a salt';

export class TestClass {
	prop: boolean = true;
	constructor(public name: string, public age: number) {}
	someFunction() {}
}

const types = [
	'text',
	'object',
	'basicObject',
	'invalidObject',
	'array',
	'number',
	'boolean',
	'null',
	'undefined',
	'function',
	'lambdaFunction',
	'date',
	'error',
	'regExp',
	'regExpChain',
	'map',
	'set',
	'symbol',
	'bigInt',
	'bigIntNum',
	'class',
] as const;

export const testAny: Record<(typeof types)[number], any> = {
	text: 'Any Test Text',
	object: { name: 'Test', age: 25 },
	basicObject: new Object({ name: 'Test', age: 25 }),
	invalidObject: {
		name: 'Test',
		age: 25,
		invalid: new TestClass('Test', 25),
	},
	array: ['Test', 25],
	number: 25,
	boolean: true,
	null: null,
	undefined: undefined,
	function: function () {},
	lambdaFunction: () => {},
	date: new Date(),
	regExp: new RegExp('test'),
	regExpChain: /test/,
	error: new Error('Test'),
	map: new Map(),
	set: new Set(),
	symbol: Symbol('test'),
	bigInt: BigInt(25),
	bigIntNum: 25n,
	class: new TestClass('Test', 25),
};

export const validTestTypes: Record<(typeof types)[number], boolean> = {
	text: true,
	object: true,
	basicObject: true,
	invalidObject: false,
	array: true,
	number: true,
	boolean: true,
	null: true,
	undefined: true,
	function: false,
	lambdaFunction: false,
	date: true,
	error: true,
	regExp: true,
	regExpChain: true,
	map: true,
	set: true,
	symbol: false,
	bigInt: false,
	bigIntNum: false,
	class: false,
};
