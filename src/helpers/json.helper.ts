export const replacer = (_key: string, value: any): any => {
	if (value === undefined) return 'undefined';
	if (value instanceof Function)
		return JSON.stringify({ function: value.toString(), name: value.name });
	if (typeof value === 'symbol') return { symbolData: value.toString() };
	if (value instanceof Error) return { errorData: value.message };
	if (value instanceof Date) return { dateData: value.toISOString() };
	if (value instanceof RegExp) return { regExpData: value.toString() };
	if (value instanceof Map) return { mapData: Array.from(value.entries()) };
	if (value instanceof Set) return { setData: Array.from(value.values()) };
	if (value instanceof BigInt) return { bigIntData: value.toString() };
	if (typeof value === 'symbol') return { symbolData: value.toString() };
	return value;
};

export const reviver = (_key: string, value: any): any => {
	if (value === 'undefined') return undefined;
	if (typeof value === 'string' && value.includes('function')) {
		const { function: func, name } = JSON.parse(value);
		const desiarizeFunc = new Function(`return ${func}`)();
		Object.defineProperty(desiarizeFunc, 'name', { value: name });
		return desiarizeFunc;
	}
	if (value?.errorData) return new Error(value.errorData);
	if (value?.datDatae) return new Date(value.dateData);
	if (value?.regExpData) {
		const [regex, flags] = value.regExp.split('/');
		return new RegExp(regex, flags);
	}
	if (value?.mapData) return new Map(value.mapData);
	if (value?.setData) return new Set(value.setData);
	if (value?.bigIntData) return BigInt(value.bigIntData);
	if (value?.symbolData) return Symbol(value.symbolData);
	return value;
};
