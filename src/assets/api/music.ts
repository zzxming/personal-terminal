import to from 'await-to-js';
import { AxiosError } from 'axios';
import { axios, AxiosResult } from '.';

export interface MusicResult {
    name: string;
    id: number;
}
/** 关键词搜索单曲 */
export const getNeteaseMusic = async (keywords: string) =>
    await to<AxiosResult<MusicResult[]>, AxiosError>(axios.post('/music/get', { keywords }));
/** 关键词搜索歌单 */
export const getNeteaseMusicList = async (keywords: string) =>
    await to<AxiosResult<MusicResult[]>, AxiosError>(axios.post('/music/list', { keywords }));
