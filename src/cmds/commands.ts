export interface Command {
    name: string;
    desc: string;
    builder?: any;
    handler(argv: string[]) : void;
}

export function publish(cliCommand: Command, commandModule: any) {
    commandModule.exports.command = cliCommand.name;
    commandModule.exports.desc = cliCommand.desc;
    commandModule.exports.builder = cliCommand.builder || {};
    commandModule.exports.handler = cliCommand.handler;
}
