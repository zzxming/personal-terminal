import { NextApiRequest, NextApiResponse } from 'next';
import { song_detail } from 'NeteaseCloudMusicApi';
import { getQuery } from '@/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        let { ids } = getQuery(req, res);
        let headerCookie = undefined;
        if (req.headers.cookie) {
            headerCookie = req.headers.cookie.split('; ').join(';');
        }

        const response = await song_detail({
            ids,
            cookie: headerCookie,
        });
        const { code, songs } = response.body;
        if (code === 200) {
            res.send({
                code: 1,
                data: songs,
            });
            return;
        }
        response.status = 400;
        throw response;
    } catch (error: any) {
        console.error(error);
        res.status(error.status || 500).send({
            code: 500,
            data: error.body || null,
            message: error.message,
        });
    }
};
