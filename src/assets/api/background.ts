import to from 'await-to-js';
import { AxiosError } from 'axios';
import { axios, AxiosResult } from '.';

/**
 *
 * @param {*} type 有效值为: ['meizi', 'dongman', 'fengjing', 'suiji'], 其他值则返回type为'meizi'
 * @returns imageurl
 */
export type ImageType = ['meizi', 'dongman', 'fengjing', 'suiji'];
export const getBackgroundImageUrl = async (type: ImageType) =>
    await to<AxiosResult<string>, AxiosError>(axios.get('/background', { params: { type } }));
