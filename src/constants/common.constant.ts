export const invalidTypes = [Function, BigInt] as const;

export const isValidType = (value: any): boolean => {
	if (invalidTypes.some((invalidType) => value instanceof invalidType))
		return false;
	if (value === null || typeof value !== 'object') return true;
	if (Array.isArray(value)) return value.every(isValidType);
	if (Object.getPrototypeOf(value) !== Object.prototype && !!value.constructor) return false;
	for (const values of Object.values(value)) {
		if (!isValidType(values)) return false;
	}
	return true;
};
