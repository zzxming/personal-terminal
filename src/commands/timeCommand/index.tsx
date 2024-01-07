import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { Command, CommandOutputStatus } from '@/interface/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const timeCommand: Command = {
    name: 'time',
    desc: '显示当前时间',
    params: [],
    options: [
        {
            key: 'show',
            desc: '始终显示当前时间',
            alias: 's',
            valueNeeded: false,
            legalValue: {
                on: '开启',
                off: '关闭',
            },
        },
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        const { _, show } = args;

        if (show) {
            localStorageSetItem(LOCALSTORAGECONFIG, {
                ...localStorageGetItem(LOCALSTORAGECONFIG),
                time: show === 'on' ? true : false,
            });
            return {
                constructor: '配置成功',
                status: CommandOutputStatus.success,
            };
        }
        if (_.length < 1) {
            let nowDate = new Date();
            return {
                constructor: `${nowDate.toLocaleDateString()} ${nowDate.toLocaleTimeString()}`,
                status: CommandOutputStatus.success,
            };
        }

        return {
            constructor: '参数错误',
            status: CommandOutputStatus.error,
        };
    },
};

export { timeCommand };
