import { isValidType } from '../src/constants/common.constant';
import { testAny, validTestTypes } from './constants/common.constant';

describe('Check valid types', () => {
	Object.entries(testAny).forEach(([key, value]) => {
		it(`Check ${key} type`, () => {
			expect(isValidType(value)).toBe(
				validTestTypes[key as keyof typeof validTestTypes]
			);
		});
	});
	it('Check every kind of type', () => {
		Object.entries(testAny).forEach(([key, value]) => {
			expect(isValidType(value)).toBe(
				validTestTypes[key as keyof typeof validTestTypes]
			);
		});
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
});
