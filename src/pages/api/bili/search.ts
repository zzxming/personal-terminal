import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getQuery } from '@/utils/request';

interface SearchBiliQuery {
    keywords: string;
    page?: number | string;
    pageSize?: number | string;
}
const biliSearch = async ({ keywords, page = 1, pageSize = 42 }: SearchBiliQuery) => {
    const cookie = await axios
        .get(`https://api.bilibili.com/x/frontend/finger/spi`)
        .then((data) => `buvid3=${data.data.data.b_3};`);
    // 搜索所有类型

    return await axios
        .get(
            `http://api.bilibili.com/x/web-interface/search/all/v2?page=${page}&page_size=${pageSize}&keyword=${encodeURI(
                keywords
            )}`,
            {
                headers: {
                    cookie,
                },
            }
        )
        .then((data) => {
            return {
                pageinfo: data.data.data.pageinfo ?? {},
                result: data.data.data.result ?? [],
            };
        })
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
        const { keywords, page, pageSize } = getQuery(req, res);
        if (!keywords) {
            res.status(400).send({ message: '请传入搜索关键字' });
            return;
        }
        const result = await biliSearch({ keywords, page, pageSize });
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
