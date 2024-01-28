import * as yargsPkg from 'yargs';
import { hideBin } from 'yargs/helpers';

// Keyer CLI
export const createCli = () => {
	const yargs = yargsPkg.default;
	console.log(yargs().argv);
	return yargs(hideBin(process.argv)).command(
		'$0', // command name
		'Keyer library CLI', // command description
		(yargs) => createCLiOptions(yargs),
		(argv): void => {
			console.log('Keyer CLI', argv);
			if (argv.version)
				console.log(
					'Keyer version: ' + require('../package.json').version
				);
			else if (argv.help) console.log('Keyer help:');
			// else script({ envArg: argv.envFile, hashArg: argv.hashFile });
		}
	).argv;
};

// Cli Options
const createCLiOptions = (yargs: yargsPkg.Argv<{}>) => {
	return yargs
		.version(false)
		.option('encryptFile', {
			alias: 'ef',
			description:
				'Route where is the file for encrypting for automatic cli - Default: /.env',
			type: 'string',
		})
		.option('decryptFile', {
			alias: 'df',
			description:
				'Route for the new hash file for automatic cli - Default: /keyer/encrypted-hash.txt',
			type: 'string',
		})
		.option('encrypt', {
			alias: 'e',
			description: 'Use de encrypt method in the route file',
			type: 'boolean',
		})
		.option('decrypt', {
			alias: 'd',
			description: 'Use de decrypt method in the route file',
			type: 'boolean',
		})
		.option('version', {
			alias: 'v',
			description: 'Library version',
			type: 'boolean',
		})
		.option('help', {
			alias: 'h',
			description: 'Library help',
			type: 'boolean',
		});
};
