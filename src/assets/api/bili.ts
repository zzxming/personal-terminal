import { BiliPageInfo, BiliTypeVideo, BiliVideo, BiliVideoSearchInfo } from '@/interface/interface';
import to from 'await-to-js';
import { AxiosError } from 'axios';
import { axios, AxiosResult } from '.';

/**
 * bilibili搜索
 * @param { keywords, page, pageSize } params 关键词, 请求页数, 一页数据量
 * @returns
 */
interface BiliSearchParam {
    keywords: string;
    page: number;
    pageSize: number;
}

export interface BiliSearchResult {
    pageinfo: {
        [key: string]: BiliPageInfo;
    };
    result: {
        result_type: string;
        data: BiliVideo[];
    }[];
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
    search_type: string;
}
// 根据类型搜索返回结果
export interface BiliTypeSearchResult extends BiliVideoSearchInfo {
    result: BiliTypeVideo[];
}
/** 根据类型搜索结果 */
export const getBiliSearchTypeResult = async (params: BiliTypeSearchParam) =>
    await to<AxiosResult<BiliTypeSearchResult>, AxiosError>(axios.get('/bili/searchtype', { params }));
