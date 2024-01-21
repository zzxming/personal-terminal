import { cloudsearch } from 'NeteaseCloudMusicApi';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        let { kw, t = 1, limit = 10 } = req.query;
        if (!kw) {
            res.status(400).send({ message: '请搜索关键字' });
            return;
        }
        t instanceof Array && (t = t[0]);
        if (isNaN(Number(t))) {
            res.status(400).send({ message: 't参数错误' });
            return;
        }
        t = Number(t);
        kw instanceof Array && (kw = kw.join(' '));
        limit instanceof Array && (limit = limit[0]);

        const result = await cloudsearch({
            keywords: kw,
            type: t,
            limit,
        }).catch((e) => {
            throw {
                message: e.body.msg,
                status: e.status,
            };
        });
        const key: {
            [key: number]: string;
        } = {
            1: 'songs',
            1000: 'playlists',
        };

        const data = result.body?.result as any;
        res.status(200).send({
            code: 0,
            data: data?.[key[t]] ?? [],
        });
    } catch (e: any) {
        res.status(e.status || 500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
