import { commandMap, helpIgnoreCommand } from '../registerCommand';
import { searchCommand } from '..';
import { Command, CommandOutputStatus } from '@/interface/interface';
import { commandDetail, commandList } from './helpCommandOutput';

const helpCommand: Command = {
    // const originHelpCommand: Command = {
    name: 'help',
    desc: '查看命令帮助',
    params: [
        {
            key: 'command',
            desc: '命令名称',
            required: false,
        },
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)
        const { _ } = args;

        if (_.length < 1) {
            // 没有param参数, 直接输出command list
            return {
                constructor: commandList(),
                status: CommandOutputStatus.success,
            };
        } else {
            let getCommand = null;
            let searchCommandMap = commandMap;
            for (let i = 0; i < _.length; i++) {
                getCommand = searchCommand(_[i], searchCommandMap);
                if (getCommand) {
                    searchCommandMap = getCommand.subCommands;
                }
            }
            // console.log(getCommand)
            if (!getCommand) {
                return {
                    constructor: '没找到命令',
                    status: CommandOutputStatus.error,
                };
            }
            return {
                constructor: commandDetail(getCommand),
                status: CommandOutputStatus.success,
            };
        }
    },
};

// const helpCommand = new Proxy(originHelpCommand, {
//     get(origin, key: keyof Command) {
//         if (key === 'subCommands' && origin[key].length === 0) {
//             let subs = commandMap.filter(command => !helpIgnoreCommand.includes(command));
//             origin[key] = subs;
//             return origin[key]
//         }
//         return origin[key];
//     }
// });

export { helpCommand };
