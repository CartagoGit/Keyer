// Definitions
export type IKindKeyer =
	| 'encrypt-route'
	| 'encrypted-route'
	| 'decrypted-route';
export const availableCommands = ['encrypt', 'decrypt'] as const;
export type IKindCommand = (typeof availableCommands)[number];

export type IKindDefaultOption = 'file' | 'output' | 'salt';

export interface ICommandProps {
	command: string;
	description: string;
	options: Record<string, IOptionProps>;
	action?: (...args: any[]) => void;
}

export interface IOptionProps {
	command: string;
	argument: string | null;
	short: string | string[] | null;
	description: string;
	default: string | boolean | null;
	isRequired?: boolean;
}

export interface IKeyerCommandProps {
	encryptRoute: string;
	encryptedRoute: string;
	decryptedRoute: string;
}

export type IKeyerProps = Record<IKindDefaultOption, string>;
export type IKeyerDecryptProps = IKeyerProps & { createOutput?: boolean}
