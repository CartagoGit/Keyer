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
});
