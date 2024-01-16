import { getWeather } from '@/assets/api/weather';
import { LOCALSTORAGWEATHER } from '@/assets/js/const';
import { Command, CommandOutputStatus } from '@/interface/interface';
import { SetCommand } from './subCommand/setCommand';

// weather param // 搜索某地的实时天气
// weather -fc parms  // 搜索某地的预报天气
// weather -s  // 显示天气挂件
// weather set param // 设置天气预报挂件显示的城市

// 使用 set 设置
const weatherCommand: Command = {
    name: 'weather',
    desc: '显示天气信息',
    params: [
        {
            key: 'keyword',
            desc: '省份/城市/区县名称',
            required: true,
        },
    ],
    options: [
        {
            key: 'forecast',
            alias: 'fc',
            desc: '返回天气预报',
            valueNeeded: false,
        },
    ],
    subCommands: [SetCommand],
    action(args) {
        console.log(args);
        const { _, forecast } = args;

        return {
            status: CommandOutputStatus.success,
            constructor: 'weatherCommand',
        };
    },
};
export { weatherCommand };
