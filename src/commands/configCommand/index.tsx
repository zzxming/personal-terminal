import { Command, CommandOutputStatus, ConfigData, openType } from '@/interface/interface';
import { clearCommand } from './subComand/clearCommand';
import { openCommand } from './subComand/openCommand';
import { styleCommand } from './subComand/styleCommand';
import { ConfigList } from './components/configList';

const configCommand: Command = {
    name: 'config',
    desc: '配置选项',
    params: [
        {
            key: 'sub',
            desc: '配置选项',
            required: false,
        },
    ],
    options: [
        {
            key: 'list',
            alias: 'l',
            desc: '列表形式展示所有配置属性',
            valueNeeded: false,
        },
    ],
    subCommands: [openCommand, styleCommand, clearCommand],
    action(args, commandHandle) {
        // console.log(args)
        const { list } = args;

        if (list) {
            return {
                constructor: <ConfigList />,
                status: CommandOutputStatus.success,
            };
        }
        return {
            constructor: '参数错误',
            status: CommandOutputStatus.error,
        };
    },
};

const initValLocalStorageConfig = (): ConfigData => {
    return {
        open: openType.blank,
        style: {},
        bgurl: '',
        mark: true,
        time: false,
        weather: false,
        musicPlaylist: false,
    };
};

export { configCommand, initValLocalStorageConfig };
