import { Command } from 'commander';
import pkg from '../package.json';
import { keyerCommand } from '.';
import { keyerOptions, commands, helpMessage } from './cli-props';
import {
	IKindCommand,
	availableCommands,
	ICommandProps,
	IOptionProps,
	IKeyerCommandProps,
} from './interfaces/keyer.interface';

// Start CLI
export const createCli = () => {
	const program = new Command();
	program
		.name('keyer')
		.description(pkg.description)
		.version(pkg.version, '-v, --version', 'output Keyer current version')
		.showHelpAfterError(helpMessage)
		.helpOption('-h, --help', 'output Keyer help')
		.action((args: IKeyerCommandProps) => {
			const firstCommand = program.args[0] as IKindCommand;
			if (!!firstCommand && !availableCommands.includes(firstCommand)) {
				console.error(
					`error: unrecognized command: ${firstCommand}\n${helpMessage}`
				);
				process.exit(1);
			}
			keyerCommand(args);
		});

	for (const option of Object.values(keyerOptions)) {
		createOption({ command: program, optionProps: option });
	}

	Object.values(commands).forEach((command) =>
		createCommand({ commandProps: command, program })
	);

	program.parse();
};

const createCommand = (props: {
	commandProps: ICommandProps;
	program: Command;
}) => {
	const { commandProps, program } = props;
	const { command: commandName, description, options, action } = commandProps;
	const cmd = program.command(commandName).description(description);
	if (action) cmd.action(action);
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
		isRequired,
	} = optionProps;
	const shortChain = short
		? `${Array.isArray(short) ? short.join(', ') : short}, `
		: '';
	const argumentChain = argument ? ` ${argument}` : '';

	command[isRequired ? 'requiredOption' : 'option'](
		`${shortChain}${optionCommand}${argumentChain}`,
		description
			? description + `${isRequired ? ' (required option)' : ''}`
			: undefined,
		defaultValue ?? undefined
	);
};
