import to from 'await-to-js';
import { AxiosError } from 'axios';
import { axios, AxiosResult } from '.';

/**
 *
 * @param {*} keywords
 * @param {*} config from: 翻译前语言, to: 翻译后语言
 * @returns
 */
interface FanyiConfig {
    keywords: string;
    from: string;
    to: string;
}
export interface FanyiResResult {
    from: string;
    to: string;
    trans_result: [
        {
            /** 原语言 */
            src: string;
            /** 翻译至语言 */
            dst: string;
        }
    ];
}
export interface FanyiRejResult {
    error_code: number;
    error_message: string;
}

export const fanyiApi = async (config: FanyiConfig) =>
    await to<AxiosResult<FanyiResResult | FanyiRejResult>, AxiosError>(axios.post('/fanyi/translate', { config }));
