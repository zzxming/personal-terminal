import { NextApiRequest, NextApiResponse } from 'next';
import { STATIC_ROOT, dbQuery } from '@/server/utils';
import { getQuery } from '@/utils';
import { MusicInfo } from '@/interface';
import fs from 'fs';
import path from 'path';
import { song_url, song_detail, Response } from 'NeteaseCloudMusicApi';
import axios from 'axios';

const getLocalMusic = async (sqlStr: string) => {
    const { data } = await dbQuery<MusicInfo>(sqlStr);
    if (!data || !data.length) {
        return null;
    }
    const { path: musicPath } = data[0];
    try {
        const url = path.resolve(STATIC_ROOT, musicPath);
        fs.statSync(url);
        return fs.createReadStream(url);
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getCloudMusic = async (id: string) => {
    const response = await song_url({ id });
    const url = (
        response as unknown as Response<{
            data: { url: string }[];
            code: number;
        }>
    ).body.data[0].url;
    const stream = await axios.get(url, { responseType: 'stream' });
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
        let stream = null;
        if (fee === '1') {
            const response = await song_detail({ ids: id });
            const songInfo = response.body.songs[0];
            const name = songInfo.name + ' - ' + songInfo.ar.map((info) => info.name).join(',');
            stream = await getLocalMusic(`select * from music where name = '${name}'`);
        }
        if (stream) return stream.pipe(res);
        stream = await getCloudMusic(id);
        stream.pipe(res);
    } catch (error: any) {
        console.error(error);
        res.status(404).send({
            code: 404,
            data: null,
            message: 'Not Found',
        });
    }
};
