import to from 'await-to-js';
import { axios, AxiosResolve, AxiosReject } from '.';
import { WeatherForecast, WeatherLiveInfo } from '@/interface/interface';

interface WeatherErrorInfo {
    code: number;
    data: {
        status: '0';
        info?: string;
        infocode?: string;
    };
    message: string;
}

interface WeatherBaseData {
    status: '1';
    infocode: string;
    /** 查询的地址信息 */
    address: string;
    lives: WeatherLiveInfo[];
}

interface WeatherAllData {
    status: '1';
    infocode: string;
    /** 查询的地址信息 */
    address: string;
    forecasts: WeatherForecast[];
}

export function getWeather(
    adcode: string,
    type: 'all'
): Promise<[AxiosReject<WeatherErrorInfo>, undefined] | [null, AxiosResolve<WeatherAllData>]>;
export function getWeather(
    adcode: string,
    type: 'base'
): Promise<[AxiosReject<WeatherErrorInfo>, undefined] | [null, AxiosResolve<WeatherBaseData>]>;
export function getWeather(adcode: string, type: 'base' | 'all') {
    return to<AxiosResolve<WeatherBaseData | WeatherAllData>, AxiosReject<WeatherErrorInfo>>(
        axios.get(`/weather/info`, { params: { adcode, type } })
    );
}

interface AdcodeSuccessData {
    status: '1';
    address: string;
    adcode: string;
}
export const getAdcode = (keyword: string) =>
    to<AxiosResolve<AdcodeSuccessData>, AxiosReject<WeatherErrorInfo>>(
        axios.get(`/weather/adcode`, { params: { keyword } })
    );
