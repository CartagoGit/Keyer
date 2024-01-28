import { Command } from 'commander';
import pkg from '../package.json';
import { keyerCommand } from './keyer';
import { keyserOptions, commands, ICommandProps, IOptionProps } from './cli-props';


// Start CLI
export const createCli = () => {
	const program = new Command();
	program
		.name('keyer')
		.description(pkg.description)
		.version(pkg.version, '-v', 'output Keyer current version')
		.showHelpAfterError('(add --help for additional information)')
		.helpOption('-h, --help', 'output Keyer help');

	for (const option of Object.values(keyserOptions)) {
		createOption({ command: program, optionProps: option });
	}

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
