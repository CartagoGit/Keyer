import { resolve } from 'node:path';

export const outputFolder = resolve(__dirname, '..', 'outputs');

export let originalLogs = {
	log: console.log,
	error: console.error,
	warn: console.warn,
	info: console.info,
};

export const cleanLogsInTests = () => {
	beforeAll(() => {
		originalLogs.log = console.log;
		console.log = jest.fn();
	});
	afterAll(() => (console.log = originalLogs.log));
};
