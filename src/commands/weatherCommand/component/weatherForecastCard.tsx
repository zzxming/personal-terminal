import { WeatherForecastInfo } from '@/interface/interface';
import Cloud from '@/assets/svg/cloud.svg';
import CloudRain from '@/assets/svg/cloudRain.svg';
import Sun from '@/assets/svg/sun.svg';
import Wind from '@/assets/svg/wind.svg';
import Thermometer from '@/assets/svg/thermometer.svg';
import SnowFlake from '@/assets/svg/snowFlake.svg';
import css from '../index.module.scss';
import { useMemo } from 'react';
import { Col, Row } from 'antd';
import Icon from '@ant-design/icons';

interface WeatherForecastCardProps {
    info: WeatherForecastInfo;
    address: string;
}
interface WeatherInfoItemProps {
    icon: React.FC;
    text: string;
}
const WeatherInfoItem = ({ icon, text }: WeatherInfoItemProps) => {
    return (
        <div className={css['weather_forecast_info_item']}>
            <Icon
                component={icon}
                className={css['weather-icon']}
            />
            <div className={css['weather_forecast-text']}>{text}</div>
        </div>
    );
};
export const WeatherForecastCard = ({ info, address }: WeatherForecastCardProps) => {
    const curIcon = useMemo(() => {
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
        if (cloudStr.find((v) => info.dayweather.includes(v))) return Cloud;
        const rainStr = ['雨'];
        if (rainStr.find((v) => info.dayweather.includes(v))) return CloudRain;
        const snowStr = ['雪', '冷'];
        if (snowStr.find((v) => info.dayweather.includes(v))) return SnowFlake;
        return Sun;
    }, [info]);

    const dayInfo = [
        {
            icon: Thermometer,
            text: `${info.daytemp_float}°C`,
        },
        {
            icon: curIcon,
            text: info.dayweather,
        },
        {
            icon: Wind,
            text: `${info.daywind} - ${info.daypower}级`,
        },
    ];
    const nightInfo = [
        {
            icon: Thermometer,
            text: `${info.nighttemp_float}°C`,
        },
        {
            icon: curIcon,
            text: info.nightweather,
        },
        {
            icon: Wind,
            text: `${info.nightwind} - ${info.nightpower}级`,
        },
    ];
    return (
        <div className={css['weather_forecast_card']}>
            <div className={css['weather_forecast_header']}>
                <div className={`${css['weather_forecast-text']} ${css['title']}`}>{address}</div>
            </div>
            <div className={css['weather_forecast_info']}>
                <Row
                    className={css['weather_forecast_detail']}
                    gutter={12}
                >
                    <Col
                        className={css['weather_forecast_box']}
                        span={12}
                    >
                        <div className={`${css['weather_forecast_info_item']} ${css['title']}`}>白天</div>
                        {dayInfo.map((v) => (
                            <WeatherInfoItem {...v} />
                        ))}
                    </Col>
                    <Col
                        className={css['weather_forceast_box']}
                        span={12}
                    >
                        <div className={`${css['weather_forecast_info_item']} ${css['title']}`}>夜晚</div>
                        {nightInfo.map((v) => (
                            <WeatherInfoItem {...v} />
                        ))}
                    </Col>
                </Row>
                <div className={`${css['weather_forecast_info_item']} ${css['date']}`}>
                    <div className="text-xs text-gray-400">{info.date}</div>
                </div>
            </div>
        </div>
    );
};
