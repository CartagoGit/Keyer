import { commonAfterAndBefore } from './constants/common.constant';

describe('Methods', () => {
	// COMMON VARIABLES AND FUNCTIONS

	//* COMMON AFTER AND BEFORE FUNCTIONS
	commonAfterAndBefore();

	//* -> TESTS
	it('encrypt() -> Must encrypt a text and return a hash', () => {});

	it('encryptAny() -> Must encrypt any thing and return a hash', () => {
		// Test 2
	});
	it('decrypt() -> Must decrypt a hash and return a text', () => {
		// Test 3
	});
	it('decryptAny() -> Must decrypt a hash a return an any type', () => {
		// Test 4
	});
	it('decrypt() and decryptAny() -> Not must be decrypt a hash with a wrong salt', () => {});
});
