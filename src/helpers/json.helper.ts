export const replacer = (_key: string, value: any): any => {
	if (value === undefined) return 'undefined';
	if (value instanceof Function)
		return JSON.stringify({ function: value.toString(), name: value.name });
	if (typeof value === 'symbol') return { symbol: value.toString() };
	if (value instanceof Error) return { error: value.message };
	if (value instanceof Date) return { date: value.toISOString() };
	if (value instanceof RegExp) return { regExp: value.toString() };
	if (value instanceof Map) return { map: Array.from(value.entries()) };
	if (value instanceof Set) return { set: Array.from(value.values()) };
	if (value instanceof BigInt) return { bigInt: value.toString() };
	if (typeof value === 'symbol') return { symbol: value.toString() };
	return value;
};

export const reviver = (_key: string, value: any): any => {
	console.log(
		_key,
		value,
		typeof value === 'string' && value.includes('function')
	);
	if (value === 'undefined') return undefined;
	if (typeof value === 'string' && value.includes('function')) {
		const { function: func, name } = JSON.parse(value);
		const desiarizeFunc = new Function(`return ${func}`)();
		Object.defineProperty(desiarizeFunc, 'name', { value: name });
		return desiarizeFunc;
	}
	if (value?.error) return new Error(value.error);
	if (value?.date) return new Date(value.date);
	if (value?.regExp) {
		const [regex, flags] = value.regExp.split('/');
		return new RegExp(regex, flags);
	}
	if (value?.map) return new Map(value.map);
	if (value?.set) return new Set(value.set);
	if (value?.bigInt) return BigInt(value.bigInt);
	if (value?.symbol) return Symbol(value.symbol);
	return value;
};
