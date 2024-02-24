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

	it('encryptAny() -> Must encrypt any thing and return a hash', () => {
		const encrypted = createEncryptedAnyFile(testAny);
		expect(encrypted).not.toBe(testAny);
		Object.values(testAny).forEach((value) => {
			const valueEncrypted = createEncryptedAnyFile(value);
			expect(valueEncrypted).not.toBe(value);
		});
	});
	it('decrypt() -> Must decrypt a hash and return a text', () => {
		const decrypted = createDecryptedFile();
		expect(decrypted).toBe(testAny.text);
	});
	it('decryptAny() -> Must decrypt a hash a return an any type', () => {
		const decrypted = createDecryptedAnyFile(
			createEncryptedAnyFile(testAny)
		);
		if (isValidType(testAny)) {
			return expect(() => decrypted).toThrow();
		}

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
