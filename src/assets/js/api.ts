import to from 'await-to-js';
import originAxios, { AxiosError } from 'axios';
import { BiliPageInfo, BiliTypeVideo, BiliVideo, BiliVideoSearchInfo } from '../../interface/interface';

export const axios = originAxios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api': '/'
});

export interface AxiosResult<T> {
    data: {
        code: number
        data: T
        message?: string
    }
}
/**
 * 
 * @param {*} keywords 
 * @param {*} config from: 翻译前语言, to: 翻译后语言
 * @returns 
 */
interface FanyiConfig {
    keywords: string
    from: string
    to: string
}
export interface FanyiResResult {
    from: string
    to: string
    trans_result: [
        {
            /** 原语言 */
            src: string
            /** 翻译至语言 */
            dst: string
        }
    ]
}
export interface FanyiRejResult {
    error_code: number
    error_message: string
}

export const fanyiApi = async (config: FanyiConfig) => 
    await to<AxiosResult<FanyiResResult | FanyiRejResult>, AxiosError>(axios.post('/fanyi/translate', { config }))


export interface MusicResult {
    name: string
    id: number
}
/** 关键词搜索单曲 */
export const getNeteaseMusic = async (keywords: string) => 
    await to<AxiosResult<MusicResult[]>, AxiosError>(axios.post('/music/get', { keywords }));
/** 关键词搜索歌单 */
export const getNeteaseMusicList = async (keywords: string) => 
    await to<AxiosResult<MusicResult[]>, AxiosError>(axios.post('/music/list', { keywords }));

/**
 * 
 * @param {*} type 有效值为: ['meizi', 'dongman', 'fengjing', 'suiji'], 其他值则返回type为'meizi'
 * @returns imageurl
 */
export type ImageType = ['meizi', 'dongman', 'fengjing', 'suiji']
export const getBackgroundImageUrl = async (type: ImageType) => 
    await to<AxiosResult<string>, AxiosError>(axios.get('/background/random', { params: { type } }));

/**
 * bilibili搜索
 * @param { keywords, page, pageSize } params 关键词, 请求页数, 一页数据量
 * @returns 
 */
interface BiliSearchParam {
    keywords: string
    page: number
    pageSize: number
}

export interface BiliSearchResult {
    pageinfo: {
        [key: string]: BiliPageInfo
    }
    result: {
        result_type: string
        data: BiliVideo[]
    }[]
}
/** bilibili搜索 */
export const getBiliSearchResult = async (params: BiliSearchParam) => 
    await to<AxiosResult<BiliSearchResult>, AxiosError>(axios.get('/bili/search', { params }));
/** 获取bilibili图片 */
export const getBiliPic = async (pic: string) => 
    await to<AxiosResult<string>, AxiosError>(axios.get('/bili/pic', { params: { pic } }));

/**
 * 
 * @param { keywords, page, pageSize, search_type }  关键词, 请求页数, 一页数据量, 搜索类型
 * @returns 
 */
interface BiliTypeSearchParam extends BiliSearchParam {
    search_type: string
}
// 根据类型搜索返回结果
export interface BiliTypeSearchResult extends BiliVideoSearchInfo {
    result: BiliTypeVideo[]
}
/** 根据类型搜索结果 */
export const getBiliSearchTypeResult = async (params: BiliTypeSearchParam) => 
    await to<AxiosResult<BiliTypeSearchResult>, AxiosError>(axios.get('/bili/searchtype', { params }));

