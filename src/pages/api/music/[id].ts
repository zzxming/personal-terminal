import { NextApiRequest, NextApiResponse } from 'next';
import { STATIC_ROOT, dbQuery } from '@/server/utils';
import { getQuery } from '@/utils';
import { MusicInfo } from '@/interface';
import fs from 'fs';
import path from 'path';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        // 根据id返回歌曲
        const { id } = getQuery(req, res);
        const { data } = await dbQuery<MusicInfo>(`select * from music where id = ${id}`);
        if (!data || !data.length) {
            return res.status(404).send({
                code: 404,
                data: null,
                message: 'Not Found',
            });
        }
        const { path: musicPath } = data[0];
        try {
            const url = path.resolve(STATIC_ROOT, musicPath);
            const stat = fs.statSync(url);
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
            });
            fs.createReadStream(url).pipe(res);
        } catch (error) {
            console.log(error);
            res.send({ message: '暂无此音乐数据' });
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
