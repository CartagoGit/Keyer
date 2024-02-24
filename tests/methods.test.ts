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
	const createDecryptedFile = (saltModified = salt) =>
		decrypt({
			secretSalt: saltModified,
			toDecrypt: createEncryptedFile(),
			showLog: false,
		});
	const createDecryptedAnyFile = (toDecrypt: string, saltModified = salt) =>
		decryptAny({ secretSalt: saltModified, toDecrypt, showLog: false });

	//* COMMON AFTER AND BEFORE FUNCTIONS
	commonAfterAndBefore();

	//* -> TESTS
	it('encrypt() -> Must encrypt a text and return a hash', () => {
		const encrypted = createEncryptedFile();
		expect(encrypted).not.toBe(testAny.text);
	});
	it('Check valid types for encrypt/decrypt any -> Must check valid/invalid types ', () => {
		expect(isValidType(testAny.object)).toBe(true);
		expect(isValidType(testAny.invalidObject)).toBe(false);

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
		// Check with valid and invalid types
		if (isValidType(testAny)) {
			const decrypted = createDecryptedAnyFile(
				createEncryptedAnyFile(testAny)
			);

			let parsedAny = { ...testAny };
			for (const [key, value] of Object.entries(parsedAny)) {
				if (value === undefined)
					delete parsedAny[key as keyof typeof parsedAny];
			}
			expect(decrypted).toStrictEqual(parsedAny);
		} else {
			expect(() =>
				createDecryptedAnyFile(createEncryptedAnyFile(testAny))
			).toThrow();
		}
		// Check with valid type
		const decryptedObject = createDecryptedAnyFile(
			createEncryptedAnyFile(testAny.object)
		);
		expect(decryptedObject).toStrictEqual(testAny.object);
		// Chekc with inner types
		Object.values(testAny).forEach((value) => {
			if (isValidType(value)) {
				const valueDecrypted = createDecryptedAnyFile(
					createEncryptedAnyFile(value)
				);
				if (value === undefined)
					return expect(valueDecrypted).toBeUndefined();
				expect(valueDecrypted).toStrictEqual(value);
			} else {
				expect(() =>
					createDecryptedAnyFile(createEncryptedAnyFile(value))
				).toThrow('Invalid type');
			}
		});
	});
	it('decrypt() and decryptAny() -> Not must be decrypt a hash with a wrong salt', () => {
		expect(() => createDecryptedFile('wrongSalt')).toThrow();
		expect(createDecryptedFile(salt)).toBe(testAny.text);
		expect(() =>
			createDecryptedAnyFile(createEncryptedAnyFile(testAny), 'wrongSalt')
		).toThrow();
		expect(
			createDecryptedAnyFile(createEncryptedAnyFile(testAny.object), salt)
		).toStrictEqual(testAny.object);
	});
});
