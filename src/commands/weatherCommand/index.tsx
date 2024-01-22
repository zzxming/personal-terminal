import { getAdcode, getWeather } from '@/assets/api/weather';
import { LOCALSTORAGECONFIG, LOCALSTORAGWEATHER } from '@/assets/js/const';
import { Command, CommandOutputStatus, ConfigData, WeatherConfig } from '@/interface/interface';
import { SetCommand } from './subCommand/setCommand';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';
import { WeatherForecastList } from './component/WeatherForecastList';

// weather param // 搜索某地的实时天气
// weather -fc parms  // 搜索某地的预报天气
// weather -s  // 显示天气挂件
// weather set param // 设置天气预报挂件显示的城市
// weather clear // 清除天气挂件显示的城市配置

// 使用 set 设置
const weatherCommand: Command = {
    name: 'weather',
    desc: '显示天气信息',
    params: [],
    options: [
        {
            key: 'show',
            alias: 's',
            desc: '显示天气挂件',
            valueNeeded: false,
        },
        {
            key: 'forecast',
            alias: 'fc',
            desc: '返回天气预报',
            valueNeeded: true,
        },
    ],
    subCommands: [SetCommand],
    async action(args, commandHandle) {
        // console.log(args);
        const { _, show: isShow, forecast } = args;

        if (isShow) {
            const weatherConfig = localStorageGetItem(LOCALSTORAGWEATHER) as WeatherConfig;
            if (!weatherConfig.city) {
                return {
                    status: CommandOutputStatus.error,
                    constructor: '请先设置城市',
                };
            }
            const globalConfig = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
            localStorageSetItem(LOCALSTORAGECONFIG, {
                ...globalConfig,
                weather: !globalConfig.weather,
            });

            return {
                status: CommandOutputStatus.success,
                constructor: '设置成功',
            };
        }
        if (forecast) {
            let queryCity = forecast;
            if (forecast instanceof Boolean) {
                queryCity = (localStorageGetItem(LOCALSTORAGWEATHER) as WeatherConfig).city;
            }
            commandHandle.pushCommands(
                {
                    constructor: '等待加载...',
                    status: CommandOutputStatus.warn,
                },
                true
            );
            const [codeError, codeRes] = await getAdcode(queryCity as string);
            if (codeError) {
                return {
                    status: CommandOutputStatus.error,
                    constructor: `城市查询失败, error ${
                        codeError.response
                            ? `${codeError.response.data.data.infocode} ${codeError.response.data.data.info}`
                            : codeError.message
                    }`,
                };
            }
            commandHandle.pushCommands(
                {
                    constructor: `查询城市 ${codeRes.data.data.address} 天气中`,
                    status: CommandOutputStatus.warn,
                },
                true
            );
            const [weatherErr, weatherRes] = await getWeather(codeRes.data.data.adcode, 'all');
            if (weatherErr || weatherRes.data.data.status !== '1') {
                let message = '';
                if (weatherRes) {
                    message = weatherRes.data.data.infocode;
                } else if (!weatherErr.response) {
                    message = weatherErr.message || String(weatherErr.status);
                } else {
                    message =
                        weatherErr.response.data.data.infocode ||
                        weatherErr.response.data.message ||
                        weatherErr.message;
                }
                return {
                    status: CommandOutputStatus.error,
                    constructor: `天气查询失败, error ${message}`,
                };
            }

            return {
                status: CommandOutputStatus.success,
                constructor: (
                    <WeatherForecastList
                        address={codeRes.data.data.address}
                        forecast={weatherRes.data.data.forecasts[0]}
                    />
                ),
            };
        }

        return {
            status: CommandOutputStatus.success,
            constructor: '',
        };
    },
};

const initValLocalStorageWeather = () => {
    return {
        city: '',
        x: window.innerWidth - 240,
        y: 16,
    };
};
export { weatherCommand, initValLocalStorageWeather };
