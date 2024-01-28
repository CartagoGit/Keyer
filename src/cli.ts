import { Command } from 'commander';
import pkg from '../package.json';
import { keyerCommand } from './keyer';

// Definitions
type IKindCommand = 'encrypt' | 'decrypt';
type IKindDefaultOption = 'file' | 'output';

interface ICommandProps {
	command: string;
	description: string;
	options: Record<string, IOptionProps>;
}

interface IOptionProps {
	command: string;
	argument: string | null;
	short: string | string[] | null;
	description: string;
	default: string | boolean | null;
}

// Props
export const defaultFiles = {
	encryptFile: '.env',
	decryptFile: 'keyer/encrypted-hash.txt',
	decryptedFile: 'keyer/decrypted-envs.txt',
};

const defaultOptions: Record<IKindDefaultOption, IOptionProps> = {
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

const commands: Record<IKindCommand, ICommandProps> = {
	encrypt: {
		command: 'encrypt',
		description: 'Encrypt command cli',
		options: {
			file: {
				...defaultOptions.file,
				description: 'route where is the file for encrypting',
				default: defaultFiles.encryptFile,
			},
			output: {
				...defaultOptions.output,
				description: 'route where file encrypted will create',
				default: defaultFiles.decryptFile,
			},
		},
	},
	decrypt: {
		command: 'decrypt',
		description: 'Decrypt command cli',
		options: {
			file: {
				...defaultOptions.file,
				default: defaultFiles.decryptFile,
			},
			output: {
				...defaultOptions.output,
				description: 'route where file will decrypted',
				default: defaultFiles.encryptFile,
			},
		},
	},
};

// Start CLI

export const createCli = () => {
	const program = new Command();
	program
		.name('keyer')
		.description(pkg.description)
		.version(pkg.version, '-v', 'output Keyer current version')
		.showHelpAfterError('(add --help for additional information)')
		.helpOption('-h, --help', 'output Keyer help')
		.action(() => {
			keyerCommand();
		});

	Object.values(commands).forEach((command) =>
		createCommand({ commandProps: command, program })
	);
	console.log(program.parse(process.argv));
};

const createCommand = (props: {
	commandProps: ICommandProps;
	program: Command;
}) => {
	const { commandProps, program } = props;
	const { command: commandName, description, options } = commandProps;
	const cmd = program.command(commandName).description(description);
	Object.values(options).forEach((optionProps) =>
		createOption({ optionProps, command: cmd })
	);
};

const createOption = (props: {
	optionProps: IOptionProps;
	command: Command;
}) => {
	const { optionProps, command } = props;
	const {
		command: optionCommand,
		argument,
		short,
		description,
		default: defaultValue,
	} = optionProps;
	const shortChain = short
		? `${Array.isArray(short) ? short.join(', ') : short}, `
		: '';
	const argumentChain = argument ? ` ${argument}` : '';
	command.option(
		`${shortChain}${optionCommand}${argumentChain}`,
		description || undefined,
		defaultValue || undefined
	);
};
