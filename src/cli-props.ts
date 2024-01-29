import { decryptCommand, encryptCommand } from '.';
import {
	IKindDefaultOption,
	IOptionProps,
	IKindKeyer,
	IKindCommand,
	ICommandProps,
	IKeyerDecryptProps,
} from './interfaces/keyer.interface';

// Props
export const helpMessage = '(add --help for additional information)';

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
	salt: {
		command: '--salt',
		argument: '<salt>',
		short: '-s',
		description: 'secret salt',
		default: null,
		isRequired: true,
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
	salt: defaultOptions.salt,
};

export const decryptOptions: Record<
	IKindDefaultOption | 'createOutput',
	IOptionProps
> = {
	file: {
		...defaultOptions.file,
		default: defaultFiles.encryptedRoute,
	},
	output: {
		...defaultOptions.output,
		description: 'route where file will decrypted',
		default: defaultFiles.decryptedRoute,
	},
	salt: defaultOptions.salt,
	createOutput: {
		command: '--create-output',
		argument: null,
		short: '-co',
		description: 'create file output',
		default: false,
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
		action: (arg: Record<IKindDefaultOption, string>) => {
			encryptCommand(arg);
		},
	},
	decrypt: {
		command: 'decrypt',
		description: 'decrypt command cli',
		options: decryptOptions,
		action: (arg: IKeyerDecryptProps) => {
			decryptCommand(arg);
		},
	},
};
