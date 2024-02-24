export const replacer = (_key: string, value: any): any => {
	if (value === undefined) return 'undefined';
	if (value instanceof Error) return { errorData: value.message };
	if (value instanceof RegExp) return { regExpData: value.toString() };
	if (value instanceof Map) return { mapData: Array.from(value.entries()) };
	if (value instanceof Set) return { setData: Array.from(value.values()) };
	return value;
};

export const reviver = (_key: string, value: any): any => {
	// if(value?.dateData)
	if (value === 'undefined') return undefined;
	if (
		typeof value === 'string' &&
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
	) {
		// Date instances enter in stringify directly in typeof string, then we need to check if it's a date with a regex
		return new Date(value);
	}
	if (value?.errorData) return new Error(value.errorData);
	if (value?.regExpData) {
		const match = value.regExpData.match(/\/(.*)\/([gimuy]*)/);
		if (match) {
			const [, pattern, flags] = match;
			return new RegExp(pattern, flags);
		} else throw new Error('Invalid RegExp');
	}
	if (value?.mapData) return new Map(value.mapData);
	if (value?.setData) return new Set(value.setData);
	return value;
};
