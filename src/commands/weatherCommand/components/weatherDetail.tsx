import Icon from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import Locate from '@/assets/svg/locate.svg';
import Cloud from '@/assets/svg/cloud.svg';
import CloudRain from '@/assets/svg/cloudRain.svg';
import Sun from '@/assets/svg/sun.svg';
import Wind from '@/assets/svg/wind.svg';
import Droplets from '@/assets/svg/droplets.svg';
import Thermometer from '@/assets/svg/thermometer.svg';
import SnowFlake from '@/assets/svg/snowFlake.svg';
import { ConfigData, WeatherConfig, WeatherLiveInfo } from '@/interface/interface';
import { getWeather } from '@/assets/api/weather';
import css from '../index.module.scss';
import { localStorageGetItem } from '@/utils/localStorage';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP, LOCALSTORAGWEATHER } from '@/assets/js/const';
import { withInitLoading } from '@/components/loading';
import { useDraggable } from '@/hooks/draggable';

interface DetailList {
    icon: (data: WeatherLiveInfo) => React.FC;
    attr: keyof WeatherLiveInfo;
    format: (data: WeatherLiveInfo) => string;
}

interface WeatherDetailProps {
    address: string;
    detail?: WeatherLiveInfo;
    error?: string;
}
const WeatherDetailInner: React.FC<WeatherDetailProps> = ({ address, detail, error }) => {
    const infolist: DetailList[] = [
        {
            icon: () => Thermometer,
            attr: 'temperature',
            format(data) {
                return `${data.temperature_float}℃`;
            },
        },
        {
            icon(data) {
                const cloudStr = [
                    '云',
                    '霾',
                    '雾',
                    '尘',
                    '沙',
                    '强风',
                    '疾风',
                    '大风',
                    '烈风',
                    '风暴',
                    '狂爆风',
                    '飓风',
                    '热带风暴',
                ];
                if (cloudStr.find((v) => data.weather.includes(v))) return Cloud;
                const rainStr = ['雨'];
                if (rainStr.find((v) => data.weather.includes(v))) return CloudRain;
                const snowStr = ['雪', '冷'];
                if (snowStr.find((v) => data.weather.includes(v))) return SnowFlake;
                return Sun;
            },
            attr: 'weather',
            format(data) {
                return `${data.weather}`;
            },
        },
        {
            icon: () => Wind,
            attr: 'winddirection',
            format(data) {
                return `${data.winddirection} - ${data.windpower}级`;
            },
        },
        {
            icon: () => Droplets,
            attr: 'humidity',
            format(data) {
                return `${data.humidity_float}%`;
            },
        },
    ];

    return (
        <>
            {detail ? (
                <div className={css.weather_inner}>
                    <div className={css.weather_item}>
                        <Icon
                            className={css['weather-icon']}
                            component={Locate}
                        />
                        <span className={css['weather-text']}>{address}</span>
                    </div>
                    {infolist.map((item) => (
                        <div
                            className={css.weather_item}
                            key={item.attr}
                        >
                            <Icon
                                className={css['weather-icon']}
                                component={item.icon(detail)}
                            />
                            <span className={css['weather-text']}>{item.format(detail)}</span>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <>
                    <p>error: {error}</p>
                    <p>
                        <a
                            href="https://lbs.amap.com/api/webservice/guide/tools/info/"
                            style={{ color: '#1890ff' }}
                            target="_blank"
                        >
                            错误代码查询
                        </a>
                    </p>
                </>
            ) : null}
        </>
    );
};
const WeatherDetail = () => {
    const [weatherDetail, setWeatherDetail] = useState<WeatherLiveInfo>();
    const [weatherError, setWeatherError] = useState('');
    const [city, setCity] = useState('');
    const [show, setShow] = useState(false);
    const [config, setConfig] = useState(localStorageGetItem(LOCALSTORAGWEATHER) as WeatherConfig);
    const [isLoading, setIsLoading] = useState(true);

    const visible = () => {
        const config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        setShow(config.weather);
    };
    useEffect(() => {
        visible();
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], visible);
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGWEATHER], getWeatherInfo);
        const timer = setInterval(getWeatherInfo, 1000 * 3600 * 2);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], visible);
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGWEATHER], getWeatherInfo);
            clearInterval(timer);
        };
    }, []);

    const getWeatherInfo = () => {
        const weatherConfig = localStorageGetItem(LOCALSTORAGWEATHER) as WeatherConfig;
        setCity(weatherConfig.city);
        return getWeather(weatherConfig.adcode, 'base').then(([err, res]) => {
            if (err || res.data.data.status !== '1') {
                if (res) return setWeatherError(res.data.data.infocode);
                if (!err.response) return setWeatherError(err.message || String(err.status));
                return setWeatherError(err.response.data.data.infocode || err.response.data.message || err.message);
            }
            setWeatherDetail(res.data.data.lives[0]);
        });
    };
    const Detail = useMemo(() => withInitLoading(WeatherDetailInner, getWeatherInfo), []);

    const weatherRef = useRef<HTMLDivElement | null>(null);
    useDraggable(weatherRef, {
        callback({ x, y }) {},
    });

    return show ? (
        <div
            ref={weatherRef}
            className={css.weather}
            style={{ left: config.x, top: config.y }}
        >
            <Detail
                address={city}
                detail={weatherDetail}
                error={weatherError}
            />
        </div>
    ) : null;
};

export { WeatherDetail };
