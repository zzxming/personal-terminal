import { LOCALSTORAGWEATHER } from '@/assets/js/const';
import { Command, CommandOutputStatus } from '@/interface/interface';
import { localStorageSetItem } from '@/utils/localStorage';

const SetCommand: Command = {
    name: 'set',
    desc: '设置天气',
    params: [
        {
            key: 'keyword',
            desc: '省份/城市/区县名称',
            required: true,
        },
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        console.log(args);
        const { _ } = args;
        localStorageSetItem(LOCALSTORAGWEATHER, _.join(' '));
        return {
            status: CommandOutputStatus.success,
            constructor: '城市设置成功',
        };
    },
};

const initValLocalStorageWeather = () => {
    return {
        city: '',
        forecast: true,
    };
};
export { SetCommand, initValLocalStorageWeather };
