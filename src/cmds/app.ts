import * as yargs from 'yargs';

import { Command, publish } from './commands';

class AppCommand implements Command {
    public name : string = 'app';
    public desc : string = 'Create an empty repo';
    public builder(argv) {
        // tslint:disable-next-line: no-unused-expression
        yargs
            .commandDir('app-cmds')
            .demandCommand()
            .argv;
    }
    public handler(argv) {}
}

publish(new AppCommand(), module);
