import to from 'await-to-js';
import { axios, AxiosResolve, AxiosReject } from '.';

export interface MusicResult {
    name: string;
    id: number;
}
/** 关键词搜索单曲 */
export const getNeteaseMusic = async (kw: string) =>
    await to<AxiosResolve<MusicResult[]>, AxiosReject>(axios.get('/music/search', { params: { kw, t: 1 } }));
/** 关键词搜索歌单 */
export const getNeteaseMusicList = async (kw: string) =>
    await to<AxiosResolve<MusicResult[]>, AxiosReject>(axios.get('/music/search', { params: { kw, t: 1000 } }));
