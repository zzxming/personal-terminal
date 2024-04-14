import { NextApiRequest, NextApiResponse } from 'next';
import { STATIC_ROOT, dbQuery } from '@/server/utils';
import { getQuery } from '@/utils';
import { CloudMusic, MusicInfo } from '@/interface';
import fs from 'fs';
import path from 'path';
import { song_url, song_detail } from 'NeteaseCloudMusicApi';
import axios from 'axios';

interface MusicOptions {
    res: NextApiResponse;
    range?: string;
}
const getLocalMusic = async (sqlStr: string, { res, range }: MusicOptions) => {
    const { data } = await dbQuery<MusicInfo>(sqlStr);
    if (!data || !data.length) {
        return null;
    }
    const { path: musicPath } = data[0];
    const url = path.resolve(STATIC_ROOT, musicPath);
    const stat = fs.statSync(url);
    const fileSize = stat.size;
    let stream = fs.createReadStream(url);
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        // end 在最后取值为 fileSize - 1
        const end = parts[1] ? +parts[1] : fileSize - 1;
        const chunksize = end - start + 1;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', chunksize);
        stream = fs.createReadStream(url, { start, end });
    }
    res.setHeader('Content-Type', 'audio/mpeg; charset=UTF-8');
    res.status(range ? 206 : 200);
    return stream;
};

const getCloudMusic = async (id: string, { res, range }: MusicOptions) => {
    const response = await song_url({
        id,
    });
    console.log(response.status, response.body);
    if (!response.body.data) {
        throw {
            status: response.status,
            message: response.body?.message,
        };
    }
    const url = (
        response.body as unknown as {
            data: { url: string }[];
        }
    ).data[0]?.url;
    const stream = await axios.get(url, {
        headers: {
            'Content-Range': range,
        },
        responseType: 'stream',
    });
    for (const key in stream.headers) {
        res.setHeader(key, stream.headers[key]);
    }
    res.status(stream.status);
    return stream.data;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        // 根据id返回歌曲
        const { id, fee } = getQuery(req, res);
        const range = req.headers.range;
        let stream = null;
        if (fee === '1') {
            const response = await (song_detail as any)({ ids: id });
            const songInfo: CloudMusic = response.body.songs[0];
            const name = songInfo.name + ' - ' + songInfo.ar.map((info) => info.name).join(',');
            stream = await getLocalMusic(`select * from music where name = '${name}'`, { res, range });
            if (stream) {
                stream.pipe(res);
                return;
            }
        }
        stream = await getCloudMusic(id, { res, range });
        stream.pipe(res);
    } catch (error: any) {
        console.error(error);
        res.status(error?.status || 404).send({
            code: error?.status || 404,
            data: null,
            message: error?.message || 'Not Found',
        });
    }
};

export const config = {
    api: {
        responseLimit: false,
    },
};
