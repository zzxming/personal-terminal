import { Command, CommandOutputStatus } from '@/interface';
import { musicSearchCommand } from '@/commands/musicCommand/subCommand/cloudSearchCommand';
import { setPlaylistCommand } from '@/commands/musicCommand/subCommand/cloudSetPlaylistCommand';

const cloudCommand: Command = {
    name: 'cloud',
    desc: '网易云音乐',
    params: [],
    options: [],
    subCommands: [musicSearchCommand, setPlaylistCommand],
    async action(args, commandHandle) {
        const {} = args;

        return {
            constructor: '命令语法不正确',
            status: CommandOutputStatus.error,
        };
    },
};

export { cloudCommand };
