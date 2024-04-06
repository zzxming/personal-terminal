import { config } from '@/server/config';
import { getQuery } from '@/utils/request';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

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
                throw {
                    ...res.data,
                    status: 400,
                };
            }
        })
        .catch((err) => {
            if (err.response) return err.response;
            throw err;
        });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    const { keyword } = getQuery(req, res);
    if (!keyword) {
        res.status(400).send({ code: 400, data: null, message: '请输入地址信息' });
        return;
    }
    try {
        const result = await getAdCode(keyword);
        if (result.status !== '1') throw result;
        res.status(200).send({
            code: 0,
            data: result,
        });
    } catch (e: any) {
        console.log('err', e);
        res.status(e.status || 500).send({
            code: e.status || 500 || 500,
            data: e,
            message: e.info || e.message,
        });
    }
};
