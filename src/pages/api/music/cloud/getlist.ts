import { NextApiRequest, NextApiResponse } from 'next';
import { playlist_track_all } from 'NeteaseCloudMusicApi';
import { getQuery } from '@/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        let { id, cookie, page = 1, pageSize = 500 } = getQuery(req, res);
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
        playlist_track_all({
            id,
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize,
        })
            .then((response) => {
                // console.log(response)
                const { code, songs, privileges } = response.body;
                if (code === 200) {
                    res.send({
                        code: 1,
                        data: (songs as any[]).map((song, index) => ({
                            ...song,
                            st: (privileges as any[])[index].st,
                        })),
                    });
                    return;
                }
                res.send({ code: 0, message: '意外错误' });
            })
            .catch((e) => {
                console.log(e);
                res.send({
                    code: 0,
                    error: {
                        errno: e.body?.msg?.errno,
                        code: e.body?.msg?.code,
                        message: e.body?.message,
                    },
                    message: e.message || e.code || e.body.message || e.body.msg.code,
                });
            });
    } catch (e: any) {
        res.status(e.status || 500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
