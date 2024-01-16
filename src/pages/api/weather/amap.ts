// 高德错误code
// https://lbs.amap.com/api/webservice/guide/tools/info/
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { config } from '@/server/config';
import { getQuery } from '@/utils/query';

const getAdCode = async (keywords: string) => {
    return axios
        .get(`https://restapi.amap.com/v3/geocode/geo`, {
            params: {
                key: config.amapConfig.key,
                address: keywords,
            },
        })
        .then((res) => {
            if (res.data.status === '1') {
                return {
                    status: res.data.status,
                    address: res.data.geocodes[0].formatted_address,
                    adcode: res.data.geocodes[0].adcode,
                };
            } else {
                return res.data;
            }
        })
        .catch((err) => err.response.data);
};

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
                return res.data;
            }
        })
        .catch((err) => {
            return err.response.data;
        });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        const { keywords, type } = getQuery(req, res);
        if (!keywords) {
            res.status(400).send({ code: 400, data: null, message: '请输入地址信息' });
            return;
        }
        try {
            const result = await getAdCode(keywords);
            if (result.status === '0') throw result;
            const weather = await getWeather(result.adcode, type);
            if (weather.status === '0') throw weather;
            res.status(200).send({
                code: 0,
                data: {
                    ...weather,
                    address: result.address,
                },
            });
        } catch (e) {
            res.status(200).send({
                code: 0,
                data: e,
            });
        }
    } catch (e: any) {
        res.status(500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
