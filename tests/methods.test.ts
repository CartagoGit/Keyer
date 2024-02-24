import { decrypt, decryptAny, encrypt, encryptAny } from '../src';
import {
	commonAfterAndBefore,
	testAny,
	testText,
	salt,
} from './constants/common.constant';

describe('Methods', () => {
	// COMMON VARIABLES AND FUNCTIONS
	const createEncryptedFile = () =>
		encrypt({ secretSalt: salt, toEncrypt: testText, showLog: false });
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
		expect(encrypted).not.toBe(testText);
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
		expect(decrypted).toBe(testText);
	});
	it('decryptAny() -> Must decrypt a hash a return an any type', () => {
		const decrypted = createDecryptedAnyFile(
			createEncryptedAnyFile(testAny)
		);
		expect(decrypted).toStrictEqual(testAny);
		Object.values(testAny).forEach((value) => {
			const valueDecrypted = createDecryptedAnyFile(
				createEncryptedAnyFile(value)
			);
			expect(valueDecrypted).toStrictEqual(value);
		});
	});
	it('decrypt() and decryptAny() -> Not must be decrypt a hash with a wrong salt', () => {});
});
