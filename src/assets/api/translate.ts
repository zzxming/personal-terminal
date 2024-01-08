import to from 'await-to-js';
import { AxiosError } from 'axios';
import { axios, AxiosResult } from '.';
import { lang } from '@/assets/js/translateLanguage';

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
    from: keyof typeof lang;
    to: keyof typeof lang;
    trans_result: [
        {
            /** 原语言 */
            src: keyof typeof lang;
            /** 翻译至语言 */
            dst: keyof typeof lang;
        }
    ];
}
export interface FanyiRejResult {
    error_code: number;
    error_msg: string;
}

export const fanyiApi = async (params: FanyiConfig) =>
    await to<AxiosResult<FanyiResResult | FanyiRejResult>, AxiosError>(axios.get('/translate', { params }));
