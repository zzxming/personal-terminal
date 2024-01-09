import to from 'await-to-js';
import { axios, AxiosResolve, AxiosReject } from '.';

export interface MusicResult {
    name: string;
    id: number;
}
/** 关键词搜索单曲 */
export const getNeteaseMusic = async (keywords: string) =>
    await to<AxiosResolve<MusicResult[]>, AxiosReject>(axios.post('/music/get', { keywords }));
/** 关键词搜索歌单 */
export const getNeteaseMusicList = async (keywords: string) =>
    await to<AxiosResolve<MusicResult[]>, AxiosReject>(axios.post('/music/list', { keywords }));
