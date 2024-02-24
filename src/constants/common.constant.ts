export const invalidTypes = [Function, BigInt] as const;

export const isValidType = (value: any): boolean => {
	if (invalidTypes.some((invalidType) => value instanceof invalidType))
		return false;
	if (value === null || typeof value !== 'object' || Array.isArray(value))
		return true;
	if (typeof value.constructor === 'function' && value.constructor.name)
		return false;
	for (const values of Object.values(value)) {
		if (!isValidType(values)) return false;
	}
	return true;
};
