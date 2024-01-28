// Definitions
export type IKindKeyer =
	| 'encrypt-route'
	| 'encrypted-route'
	| 'decrypted-route';
export type IKindCommand = 'encrypt' | 'decrypt';
export type IKindDefaultOption = 'file' | 'output';

export interface ICommandProps {
	command: string;
	description: string;
	options: Record<string, IOptionProps>;
}

export interface IOptionProps {
	command: string;
	argument: string | null;
	short: string | string[] | null;
	description: string;
	default: string | boolean | null;
}

// Props
export const defaultFiles = {
	encryptRoute: '.env',
	encryptedRoute: 'keyer/encrypted.txt',
	decryptedRoute: 'keyer/decrypted.txt',
};

export const defaultOptions: Record<IKindDefaultOption, IOptionProps> = {
	file: {
		command: '--file',
		argument: '<file>',
		short: '-f',
		description: 'route file',
		default: null,
	},
	output: {
		command: '--output',
		argument: '<output>',
		short: '-o',
		description: 'route file output',
		default: null,
	},
};

export const encryptOptions: Record<IKindDefaultOption, IOptionProps> = {
	file: {
		...defaultOptions.file,
		description: 'route where is the file for encrypting',
		default: defaultFiles.encryptRoute,
	},
	output: {
		...defaultOptions.output,
		description: 'route where file encrypted will create',
		default: defaultFiles.encryptedRoute,
	},
};

export const decryptOptions: Record<IKindDefaultOption, IOptionProps> = {
	file: {
		...defaultOptions.file,
		default: defaultFiles.encryptedRoute,
	},
	output: {
		...defaultOptions.output,
		description: 'route where file will decrypted',
		default: defaultFiles.decryptedRoute,
	},
};

export const keyserOptions: Record<IKindKeyer, IOptionProps> = {
	'encrypt-route': {
		command: 'encrypt-route',
		argument: '<encrypt-route>',
		short: '-er',
		description: 'route from file to encrypt',
		default: defaultFiles.encryptRoute,
	},
	'encrypted-route': {
		command: 'encrypted-route',
		argument: '<encrypted-route>',
		short: '-edr',
		description: 'route from file when it will be encrypted',
		default: defaultFiles.encryptedRoute,
	},
	'decrypted-route': {
		command: 'decrypted-route',
		argument: '<decrypted-route>',
		short: '-dr',
		description: 'route from file when it will be decrypted',
		default: defaultFiles.decryptedRoute,
	},
};

export const commands: Record<IKindCommand, ICommandProps> = {
	encrypt: {
		command: 'encrypt',
		description: 'encrypt command cli',
		options: encryptOptions,
	},
	decrypt: {
		command: 'decrypt',
		description: 'decrypt command cli',
		options: decryptOptions,
	},
};
