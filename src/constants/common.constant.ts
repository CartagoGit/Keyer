export const invalidInstances = [Function, BigInt, Symbol] as const;

export const invalidTypes = ['symbol', 'function', 'bigint'] as const;

export const isValidType = (value: any): boolean => {
	if (
		invalidInstances.some(
			(invalidInstance) => value instanceof invalidInstance
		)
	)
		return false;
	if (
		value === null ||
		invalidTypes.every((invalidType) => typeof value !== invalidType)
	)
		return true;
	if (Array.isArray(value)) return value.every(isValidType);
	if (
		Object.getPrototypeOf(value) !== Object.prototype &&
		!!value.constructor
	)
		return false;
	for (const values of Object.values(value)) {
		if (!isValidType(values)) return false;
	}
	return true;
};
