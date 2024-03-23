import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { config } from '@/server/config';
import { getQuery } from '@/utils/request';

const getWeather = async (adcode: string, extensions: string = 'base') => {
    return axios
        .get(`https://restapi.amap.com/v3/weather/weatherInfo`, {
            params: {
                key: config.amapConfig.key,
                city: adcode,
                extensions,
            },
        })
        .then((res) => {
            if (res.data.status === '1') {
                return res.data;
            } else {
                return {
                    ...res.data,
                    status: res.status,
                };
            }
        })
        .catch((err) => {
            if (err.response) return err.response;
            throw err.response;
        });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    const { adcode, type } = getQuery(req, res);
    if (!adcode) {
        res.status(400).send({ code: 400, data: null, message: '请输入地址信息' });
        return;
    }
    try {
        const weather = await getWeather(adcode, type);
        if (weather.status !== '1') throw weather;
        res.status(200).send({
            code: 0,
            data: weather,
        });
    } catch (e: any) {
        res.status(e.status || 500).send({
            code: e.status || 500,
            data: e,
            message: e.info || e.message,
        });
    }
};
