import { WeatherForecast } from '@/interface/interface';
import { WeatherForecastCard } from './weatherForecastCard';
import css from '../index.module.scss';
import { Col, Row } from 'antd';

interface WeatherForecastListProps {
    address: string;
    forecast: WeatherForecast;
}
export const WeatherForecastList = ({ address, forecast }: WeatherForecastListProps) => {
    return (
        <>
            <p>查询地区：{address}</p>
            <Row
                className={css['weather_forecast_list']}
                gutter={[12, 12]}
            >
                {forecast.casts.map((forecast) => (
                    <Col
                        key={forecast.date}
                        xs={24}
                        md={12}
                        xl={6}
                    >
                        <WeatherForecastCard
                            info={forecast}
                            address={address}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
};
