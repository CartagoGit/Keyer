"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCli = void 0;
const commander_1 = require("commander");
const package_json_1 = __importDefault(require("../package.json"));
const keyer_1 = require("./keyer");
const cli_props_1 = require("./cli-props");
const keyer_interface_1 = require("./interfaces/keyer.interface");
// Start CLI
const createCli = () => {
    const program = new commander_1.Command();
    program
        .name('keyer')
        .description(package_json_1.default.description)
        .version(package_json_1.default.version, '-v', 'output Keyer current version')
        .showHelpAfterError(cli_props_1.helpMessage)
        .helpOption('-h, --help', 'output Keyer help')
        .action((args) => {
        const firstCommand = program.args[0];
        if (!!firstCommand && !keyer_interface_1.availableCommands.includes(firstCommand)) {
            console.error(`error: unrecognized command: ${firstCommand}\n${cli_props_1.helpMessage}`);
            process.exit(1);
        }
        (0, keyer_1.keyerCommand)(args);
    });
    for (const option of Object.values(cli_props_1.keyerOptions)) {
        createOption({ command: program, optionProps: option });
    }
    Object.values(cli_props_1.commands).forEach((command) => createCommand({ commandProps: command, program }));
    program.parse();
};
exports.createCli = createCli;
const createCommand = (props) => {
    const { commandProps, program } = props;
    const { command: commandName, description, options, action } = commandProps;
    const cmd = program.command(commandName).description(description);
    if (action)
        cmd.action(action);
    Object.values(options).forEach((optionProps) => createOption({ optionProps, command: cmd }));
};
const createOption = (props) => {
    const { optionProps, command } = props;
    const { command: optionCommand, argument, short, description, default: defaultValue, isRequired, } = optionProps;
    const shortChain = short
        ? `${Array.isArray(short) ? short.join(', ') : short}, `
        : '';
    const argumentChain = argument ? ` ${argument}` : '';
    command[isRequired ? 'requiredOption' : 'option'](`${shortChain}${optionCommand}${argumentChain}`, description
        ? description + `${isRequired ? ' (required option)' : ''}`
        : undefined, defaultValue ?? undefined);
};
