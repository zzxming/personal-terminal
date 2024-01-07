import { Command } from '@/interface/interface';

const clearCommand: Command = {
    name: 'clear',
    desc: '清屏',
    params: [],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(commandHandle.commands)
        commandHandle.clearCommand();
    },
};

export { clearCommand };
