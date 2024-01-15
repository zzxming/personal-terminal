import { getQuery } from '@/utils/query';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const biliPic = async (pic: string) => {
    return await axios
        .get(`${pic}`, {
            responseType: 'arraybuffer',
        })
        .then(
            (data) =>
                `data:${data.headers['content-type']};base64,${Buffer.from(data.data, 'binary').toString('base64')}`
        )
        .catch((e) => {
            throw e;
        });
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        let { pic } = getQuery(req, res);
        if (!pic) {
            res.status(400).send({ message: '请传入图片地址' });
            return;
        }
        if (!pic.startsWith('http')) {
            pic = `http:${pic}`;
        }
        const result = await biliPic(pic);
        res.status(200).send({
            code: 0,
            data: result,
        });
    } catch (e: any) {
        res.status(500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
