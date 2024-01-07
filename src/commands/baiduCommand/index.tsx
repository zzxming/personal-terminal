import { Command, CommandOutputStatus, openType } from '@/interface/interface';
import { toNewPage } from '@/utils/toNewPage';

const baiduCommand: Command = {
    name: 'baidu',
    desc: '百度搜索',
    params: [
        {
            key: 'word',
            desc: '搜索关键字',
            required: true,
        },
    ],
    options: [
        {
            key: 'self',
            alias: 's',
            desc: '是否当前页面打开',
            valueNeeded: false,
        },
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args);

        const { _, self } = args;
        const word = _.join(' ');
        const url = `https://baidu.com/s?wd=${word}`;

        toNewPage(url, self ? openType.self : undefined);

        return {
            constructor: '跳转成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { baiduCommand };
