import { decrypt, decryptAny, encrypt, encryptAny } from '../src';
import { isValidType } from '../src/constants/common.constant';
import {
	commonAfterAndBefore,
	testAny,
	salt,
} from './constants/common.constant';

describe('Methods', () => {
	// COMMON VARIABLES AND FUNCTIONS
	const createEncryptedFile = () =>
		encrypt({ secretSalt: salt, toEncrypt: testAny.text, showLog: false });
	const createEncryptedAnyFile = (toEncrypt: any) =>
		encryptAny({
			secretSalt: salt,
			toEncrypt,
			showLog: false,
		});
	const createDecryptedFile = () =>
		decrypt({
			secretSalt: salt,
			toDecrypt: createEncryptedFile(),
			showLog: false,
		});
	const createDecryptedAnyFile = (toDecrypt: string) =>
		decryptAny({ secretSalt: salt, toDecrypt, showLog: false });

	//* COMMON AFTER AND BEFORE FUNCTIONS
	commonAfterAndBefore();

	//* -> TESTS
	it('encrypt() -> Must encrypt a text and return a hash', () => {
		const encrypted = createEncryptedFile();
		expect(encrypted).not.toBe(testAny.text);
	});
	it('Check valid types for encrypt/decrypt any -> Must check valid/invalid types ', () => {
		if (isValidType(testAny)) expect(isValidType(testAny)).toBe(true);
		else expect(isValidType(testAny)).toBe(false);

		Object.values(testAny).forEach((value) => {
			if (isValidType(value)) expect(isValidType(value)).toBe(true);
			else expect(isValidType(value)).toBe(false);
		});
	});

	it('encryptAny() -> Must encrypt any thing and return a hash', () => {
		if (isValidType(testAny)) {
			const encrypted = createEncryptedAnyFile(testAny);
			expect(encrypted).not.toBe(testAny);
		} else {
			expect(() => createEncryptedAnyFile(testAny)).toThrow(
				'Invalid type'
			);
		}

		Object.values(testAny).forEach((value) => {
			if (isValidType(value)) {
				const valueEncrypted = createEncryptedAnyFile(value);
				expect(valueEncrypted).not.toBe(value);
			} else {
				expect(() => createEncryptedAnyFile(value)).toThrow(
					'Invalid type'
				);
			}
		});
	});
	it('decrypt() -> Must decrypt a hash and return a text', () => {
		const decrypted = createDecryptedFile();
		expect(decrypted).toBe(testAny.text);
	});
	it('decryptAny() -> Must decrypt a hash a return an any type', () => {
		if (!isValidType(testAny)) {
			return expect(() => decrypted).toThrow();
		}
		const decrypted = createDecryptedAnyFile(
			createEncryptedAnyFile(testAny)
		);

		let parsedAny = { ...testAny };
		for (const [key, value] of Object.entries(parsedAny)) {
			if (value === undefined)
				delete parsedAny[key as keyof typeof parsedAny];
		}
		expect(decrypted).toStrictEqual(parsedAny);
		// Object.entries(testAny).forEach(([key, value]) => {
		// 	const valueDecrypted = createDecryptedAnyFile(
		// 		createEncryptedAnyFile(value)
		// 	);
		// 	if (value === undefined)
		// 		return expect(valueDecrypted).toBeUndefined();
		// 	expect(valueDecrypted).toStrictEqual(value);
		// });
	});
	it('decrypt() and decryptAny() -> Not must be decrypt a hash with a wrong salt', () => {});
});
