import to from 'await-to-js';
import { axios, AxiosResolve, AxiosReject } from '.';

interface WeatherErrorInfo {
    status: '0';
    info: string;
    infocode: string;
}

interface WeatherBaseData {
    status: '1';
    infocode: string;
    /** 查询的地址信息 */
    address: string;
    lives: WeatherLiveInfo[];
}
interface WeatherLiveInfo {
    /** 省份 */
    province: string;
    /** 城市 */
    city: string;
    /** 区域编码 */
    adcode: string;
    /** 天气现象 */
    weather: string;
    /** 实时温度 */
    temperature: string;
    temperature_float: string;
    /** 风向描述 */
    winddirection: string;
    /** 风力级别 */
    windpower: string;
    /** 空气温度 */
    humidity: string;
    humidity_float: string;
    /** 数据发布的时间 */
    reporttime: string;
}

interface WeatherAllData {
    status: '1';
    infocode: string;
    /** 查询的地址信息 */
    address: string;
    forecasts: WeatherForecast;
}
interface WeatherForecast {
    adcode: string;
    casts: WeatherForecastInfo[];
    city: string;
    province: string;
    repottime: string;
}
interface WeatherForecastInfo {
    // 日期 YYYY-MM-DD
    date: string;
    // 星期几, 1-7
    week: string;
    // 白天天气现象
    dayweather: string;
    // 晚上天气现象
    nightweather: string;
    // 白天温度
    daytemp: string;
    daytemp_float: string;
    // 晚上温度
    nighttemp: string;
    nighttemp_float: string;
    // 白天风向
    daywind: string;
    // 晚上风向
    nightwind: string;
    // 白天风力
    daypower: string;
    // 晚上风力
    nightpower: string;
}

export const getWeather = (keywords: string, type: string) =>
    to<AxiosResolve<WeatherBaseData | WeatherAllData>, AxiosReject<WeatherErrorInfo>>(
        axios.get(`/weather/amap`, { params: { keywords, type } })
    );
