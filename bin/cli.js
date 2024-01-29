"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCli = void 0;
var commander_1 = require("commander");
var package_json_1 = __importDefault(require("../package.json"));
var keyer_1 = require("./keyer");
var cli_props_1 = require("./cli-props");
var keyer_interface_1 = require("./interfaces/keyer.interface");
// Start CLI
var createCli = function () {
    var program = new commander_1.Command();
    program
        .name('keyer')
        .description(package_json_1.default.description)
        .version(package_json_1.default.version, '-v', 'output Keyer current version')
        .showHelpAfterError(cli_props_1.helpMessage)
        .helpOption('-h, --help', 'output Keyer help')
        .action(function (args) {
        var firstCommand = program.args[0];
        if (!!firstCommand && !keyer_interface_1.availableCommands.includes(firstCommand)) {
            console.error("error: unrecognized command: ".concat(firstCommand, "\n").concat(cli_props_1.helpMessage));
            process.exit(1);
        }
        (0, keyer_1.keyerCommand)(args);
    });
    for (var _i = 0, _a = Object.values(cli_props_1.keyerOptions); _i < _a.length; _i++) {
        var option = _a[_i];
        createOption({ command: program, optionProps: option });
    }
    Object.values(cli_props_1.commands).forEach(function (command) {
        return createCommand({ commandProps: command, program: program });
    });
    program.parse();
};
exports.createCli = createCli;
var createCommand = function (props) {
    var commandProps = props.commandProps, program = props.program;
    var commandName = commandProps.command, description = commandProps.description, options = commandProps.options, action = commandProps.action;
    var cmd = program.command(commandName).description(description);
    if (action)
        cmd.action(action);
    Object.values(options).forEach(function (optionProps) {
        return createOption({ optionProps: optionProps, command: cmd });
    });
};
var createOption = function (props) {
    var optionProps = props.optionProps, command = props.command;
    var optionCommand = optionProps.command, argument = optionProps.argument, short = optionProps.short, description = optionProps.description, defaultValue = optionProps.default, isRequired = optionProps.isRequired;
    var shortChain = short
        ? "".concat(Array.isArray(short) ? short.join(', ') : short, ", ")
        : '';
    var argumentChain = argument ? " ".concat(argument) : '';
    command[isRequired ? 'requiredOption' : 'option']("".concat(shortChain).concat(optionCommand).concat(argumentChain), description
        ? description + "".concat(isRequired ? ' (required option)' : '')
        : undefined, defaultValue !== null && defaultValue !== void 0 ? defaultValue : undefined);
};
