import md5 from 'md5';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { config } from '@/server/config';

interface TranslateConfig {
    to?: string;
    from?: string;
}
const translate = async (keywords: string, { to = 'auto', from = 'auto' }: TranslateConfig) => {
    const salt = new Date().getTime();
    const { appid, key } = config.baiduFanYiConfig;
    if (!appid || !key) {
        return {
            error_code: 50000,
            error_msg: '请配置百度翻译appid和key',
        };
    }
    const sign = md5(appid + keywords + salt + key);
    // 两个都行
    // const url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
    const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
    return await axios
        .get(url, {
            params: {
                q: keywords,
                from,
                to,
                appid,
                salt,
                sign,
            },
        })
        .then((res) => res.data)
        .catch((e) => {
            throw e;
        });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        let { keywords, to, from } = req.query;
        if (!keywords) {
            res.status(400).send({ code: 400, data: null, message: '请输入翻译文字' });
            return;
        }
        keywords instanceof Array && (keywords = keywords.join('\n'));
        to instanceof Array && (to = to[0]);
        from instanceof Array && (from = from[0]);

        const result = await translate(keywords, { to, from });

        res.status(200).send({
            code: 0,
            data: result,
        });
    } catch (e: any) {
        res.status(500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
