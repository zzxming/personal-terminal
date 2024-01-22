import { LOCALSTORAGECONFIG, LOCALSTORAGETIME } from '@/assets/js/const';
import { Command, CommandOutputStatus, ConfigData, TimeConfig } from '@/interface/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const timeCommand: Command = {
    name: 'time',
    desc: '显示当前时间',
    params: [],
    options: [
        {
            key: 'show',
            alias: 's',
            desc: '切换显示当前时间',
            valueNeeded: false,
        },
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args);
        const { _ } = args;

        if (args.hasOwnProperty('show')) {
            const config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
            localStorageSetItem(LOCALSTORAGECONFIG, {
                ...config,
                time: !config.time,
            });
            return {
                constructor: '配置成功',
                status: CommandOutputStatus.success,
            };
        } else {
            const nowDate = new Date();
            return {
                constructor: `${nowDate.toLocaleDateString()} ${nowDate.toLocaleTimeString()}`,
                status: CommandOutputStatus.success,
            };
        }
    },
};
const initValLocalStorageTime = () => {
    return {
        x: window.innerWidth - 240,
        y: window.innerHeight - 48,
    };
};

export { timeCommand, initValLocalStorageTime };
