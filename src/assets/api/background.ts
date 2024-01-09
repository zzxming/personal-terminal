import to from 'await-to-js';
import { axios, AxiosResolve, AxiosReject } from '.';

/**
 *
 * @param {*} type 有效值为: ['meizi', 'dongman', 'fengjing', 'suiji'], 其他值则返回type为'meizi'
 * @returns imageurl
 */
export type ImageType = ['meizi', 'dongman', 'fengjing', 'suiji'];
export const getBackgroundImageUrl = async (type: ImageType) =>
    await to<AxiosResolve<string>, AxiosReject>(axios.get('/background', { params: { type } }));
