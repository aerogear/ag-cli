import {Command, publish} from "../commands";

class AppInitCommand implements Command {
    public name : string = 'init';
    public desc : string = 'Initialize a new app';
    public handler(argv) {
        console.log('app init called');
    }
}

publish(new AppInitCommand(), module);
