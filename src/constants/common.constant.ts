const validTypes = ['boolean', 'number', 'string', 'undefined'];
const invalidTypes = ['function', 'symbol', 'bigint'];

export const isValidType = (value: any): boolean => {
	if (value === null || validTypes.includes(typeof value)) return true;
	if (Array.isArray(value)) return value.every(isValidType);
	if (value === undefined) return true;
	if (invalidTypes.includes(typeof value)) return false;
	if (
		Object.getPrototypeOf(value) !== Object.prototype &&
		!!value.constructor
	)
		return false;
	return Object.values(value).every(isValidType);
};
