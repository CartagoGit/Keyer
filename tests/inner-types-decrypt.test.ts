import { isValidType } from '../src/constants/common.constant';
import { testAny } from './constants/common.constant';
import { createDecryptedAnyFile, createEncryptedAnyFile } from './methods.test';

describe('Inner types decrypt', () => {
	// Check with inner types
	Object.entries(testAny).forEach(([key, value]) => {
		if (isValidType(value)) {
			it(`decryptAny() -> Must decrypt '${key}' kind of valid types`, () => {
				const valueDecrypted = createDecryptedAnyFile(
					createEncryptedAnyFile(value)
				);
				if (value === undefined)
					return expect(valueDecrypted).toBeUndefined();
				expect(valueDecrypted).toStrictEqual(value);
			});
		} else {
			it(`decryptAny() -> Must throw an error with '${key}' kind of invalid types`, () => {
				expect(() =>
					createDecryptedAnyFile(createEncryptedAnyFile(value))
				).toThrow('Invalid type');
			});
		}
	});
});
