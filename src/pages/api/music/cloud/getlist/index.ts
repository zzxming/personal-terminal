import { NextApiRequest, NextApiResponse } from 'next';
import { playlist_track_all } from 'NeteaseCloudMusicApi';
import { getQuery } from '@/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        let { id, page = 1, pageSize = 500 } = getQuery(req, res);
        pageSize = Number(pageSize);
        if (isNaN(pageSize)) pageSize = 500;
        if (Object.prototype.toString.call(id) === '[object Array]') {
            id = id[id.length - 1];
        }
        let headerCookie = undefined;
        if (req.headers.cookie) {
            headerCookie = req.headers.cookie.split('; ').join(';');
        }

        // 需要page和offset限制一下返回, 如果歌单内的歌曲超出1000的话会导致响应400
        const response = await (playlist_track_all as any)({
            id,
            cookie: headerCookie,
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize,
        });
        const { code, songs, privileges } = response.body;
        if (code === 200) {
            res.send({
                code: 1,
                data: (songs as any[]).map((song, index) => ({
                    ...song,
                    st: privileges[index].st,
                })),
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
