export const replacer = (_key: string, value: any): any => {
	if (value === undefined) return 'undefined';
	if (value instanceof Error) return { errorData: value.message };
	if (value instanceof Date) return { dateData: value.toISOString() };
	if (value instanceof RegExp) return { regExpData: value.toString() };
	if (value instanceof Map) return { mapData: Array.from(value.entries()) };
	if (value instanceof Set) return { setData: Array.from(value.values()) };
	return value;
};

export const reviver = (_key: string, value: any): any => {
	if (value === 'undefined') return undefined;
	if (value?.errorData) return new Error(value.errorData);
	if (value?.dateData) return new Date(value.dateData);
	if (value?.regExpData) {
		const [regex, flags] = value.regExp.split('/');
		return new RegExp(regex, flags);
	}
	if (value?.mapData) return new Map(value.mapData);
	if (value?.setData) return new Set(value.setData);
	return value;
};
