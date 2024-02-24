export const replacer = (_key: string, value: any): any => {
	if (value === undefined) return 'undefined';
	if (value instanceof Function)
		return JSON.stringify({ function: value.toString(), name: value.name });

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
	return value;
};
