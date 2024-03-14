import { Command, CommandOutputStatus, ConfigData } from '@/interface/interface';
import { musicSearchCommand } from '@/commands/musicCommand/subCommand/searchCommand';
import { localStorageGetItem, localStorageSetItem } from '@/utils';
import { LOCALSTORAGECONFIG } from '@/assets/js/const';

const musicCommand: Command = {
    name: 'music',
    desc: '网易云音乐',
    params: [],
    options: [
        {
            key: 'playlist',
            alias: 'p',
            desc: '显示播放列表',
            valueNeeded: false,
        },
    ],
    subCommands: [musicSearchCommand],
    async action(args, commandHandle) {
        const { _, p } = args;

        if (p) {
            const config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
            localStorageSetItem(LOCALSTORAGECONFIG, {
                ...config,
                musicPlaylist: !config.musicPlaylist,
            });
            return {
                constructor: '配置成功',
                status: CommandOutputStatus.success,
            };
        }

        return {
            constructor: '命令语法不正确',
            status: CommandOutputStatus.error,
        };
    },
};

export { musicCommand };
