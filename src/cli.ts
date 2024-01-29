import { Command } from 'commander';
import pkg from '../package.json';
import { keyerCommand } from './keyer';
import {
	keyserOptions,
	commands,
	ICommandProps,
	IOptionProps,
	availableCommands,
	IKindCommand,
	helpMessage,
} from './cli-props';

// Start CLI
export const createCli = () => {
	const program = new Command();
	program
		.name('keyer')
		.description(pkg.description)
		.version(pkg.version, '-v', 'output Keyer current version')
		.showHelpAfterError(helpMessage)
		.helpOption('-h, --help', 'output Keyer help')
		.action((args) => {
			const firstCommand = program.args[0] as IKindCommand;
			if (!!firstCommand && !availableCommands.includes(firstCommand)) {
				console.error(
					`error: unrecognized command: ${firstCommand}\n${helpMessage}`
				);
				process.exit(1);
			}
			console.log('args', args);
			// keyerCommand();
		});

	for (const option of Object.values(keyserOptions)) {
		createOption({ command: program, optionProps: option });
	}

	Object.values(commands).forEach((command) =>
		createCommand({ commandProps: command, program })
	);
	// console.log(program.parse(process.argv));
	// console.log(program.parse());
	program.parse();
	const command = program.commands;
	// console.log(program.args)
	// console.log(command);
	// if(program.processedArgs)
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

	// cmd.action((args) => {
	// 	const subCommands = program.args.slice(1) as (keyof typeof options)[];
	// 	console.log('subCommand', subCommands);
	// 	console.log('args', args);
	// 	for (const subCommand of subCommands) {
	// 		if (
	// 			!!subCommand &&
	// 			!subCommand.includes('-') &&
	// 			!Object.keys(options).includes(subCommand)
	// 		) {
	// 			console.error(
	// 				`error: unrecognized command: ${subCommand}\n${helpMessage}`
	// 			);
	// 			process.exit(1);
	// 		}
	// 	}
	// 	if (action) action(args);
	// });
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
