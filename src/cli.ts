import { Command, Option } from 'commander';
import pkg from '../package.json';

const program = new Command();

const options : Option[] =[
    
]

export const createCli = () => {

    program.name('keyer').description(pkg.description).version(pkg.version);
    console.log(program.parse(process.argv));
};
