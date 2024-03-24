import { Command, CommandOutputStatus, ConfigData } from '@/interface';
import { cloudCommand } from '@/commands/musicCommand/subCommand/cloudCommand';
import { localStorageGetItem, localStorageSetItem } from '@/utils';
import { LOCALSTORAGECONFIG } from '@/assets/js/const';

const musicCommand: Command = {
    name: 'music',
    desc: '音乐',
    params: [],
    options: [
        {
            key: 'playlist',
            alias: 'p',
            desc: '显示播放列表',
            valueNeeded: false,
        },
    ],
    subCommands: [cloudCommand],
    async action(args, commandHandle) {
        const { _, p } = args;

        if (p) {
            const config = localStorageGetItem<ConfigData>(LOCALSTORAGECONFIG);
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

export const initValLocalStoragePlaylist = () => {
    return {
        id: '',
    };
};
