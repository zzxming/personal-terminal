import to from 'await-to-js';
import { axios, AxiosResolve, AxiosReject } from '.';
import { CloudMusic, MusicInfo, PageQuery, CloudPlaylist } from '@/interface';

/** 关键词搜索单曲 */
export const getNeteaseMusic = (kw: string) =>
    to<AxiosResolve<CloudMusic[]>, AxiosReject>(axios.get('/music/search', { params: { kw, t: 1 } }));
/** 关键词搜索歌单 */
export const getNeteaseMusicList = (kw: string) =>
    to<AxiosResolve<Omit<CloudPlaylist, 'trackIds'>[]>, AxiosReject>(
        axios.get('/music/search', { params: { kw, t: 1000 } })
    );
/** 获取所有上传歌曲 */
export const getMusicList = (page?: PageQuery) =>
    to<AxiosResolve<MusicInfo[]>, AxiosReject>(
        axios.get('/music/list', {
            params: {
                ...page,
            },
        })
    );
/** 获取网易云歌单信息 */
export const getCloudMusicListInfo = (id: string) =>
    to<AxiosResolve<CloudPlaylist>, AxiosReject>(
        axios.get('/music/cloud/getlist/info', {
            params: {
                id,
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

/** 获取网易云歌曲信息 */
export const getCloudMusicInfo = (ids: string[]) =>
    to<AxiosResolve<CloudMusic[]>, AxiosReject>(
        axios.get('/music/cloud/getsong/info', {
            params: {
                ids: ids.join(','),
            },
        })
    );
