import to from 'await-to-js';
import { axios, AxiosResolve, AxiosReject } from '.';
import { CloudMusic, MusicInfo, PageQuery } from '@/interface';

export interface MusicResult {
    name: string;
    id: number;
}
/** 关键词搜索单曲 */
export const getNeteaseMusic = (kw: string) =>
    to<AxiosResolve<MusicResult[]>, AxiosReject>(axios.get('/music/search', { params: { kw, t: 1 } }));
/** 关键词搜索歌单 */
export const getNeteaseMusicList = (kw: string) =>
    to<AxiosResolve<MusicResult[]>, AxiosReject>(axios.get('/music/search', { params: { kw, t: 1000 } }));
/** 获取所有上传歌曲 */
export const getMusicList = (page?: PageQuery) =>
    to<AxiosResolve<MusicInfo[]>, AxiosReject>(
        axios.get('/music/list', {
            params: {
                ...page,
            },
        })
    );
/** 获取网易云歌单内歌曲 */
export const getCloudMusicList = (id: string, page?: PageQuery) =>
    to<AxiosResolve<CloudMusic[]>, AxiosReject>(
        axios.get('/music/cloud/getlist', {
            params: {
                id,
                ...page,
            },
        })
    );
