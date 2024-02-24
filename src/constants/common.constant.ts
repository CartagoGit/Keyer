const validTypes = ['boolean', 'number', 'string', 'undefined'];
const invalidTypes = ['function', 'symbol', 'bigint'];
const validInstances = [Date, RegExp, Map, Set, Error];

export const isValidType = (value: any): boolean => {
	if (value === null || validTypes.includes(typeof value)) return true;
	if (Array.isArray(value)) return value.every(isValidType);
	if (validInstances.some((instance) => value instanceof instance))
		return true;
	if (invalidTypes.includes(typeof value)) return false;
	if (
		Object.getPrototypeOf(value) !== Object.prototype &&
		!!value.constructor
	)
		return false;
	return Object.values(value).every(isValidType);
};
