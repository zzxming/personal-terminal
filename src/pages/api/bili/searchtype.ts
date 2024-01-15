import { getQuery } from '@/utils/query';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils';

interface SearchBiliTypeQuery {
    keywords: string;
    search_type: string;
    page?: number | string;
    pageSize?: number | string;
}
// b站搜索登录用户和未登录用户搜索结果是不同的, 登录用户会传递 cookie 中的 SESSDATA, 此 cookie 控制搜索结果
const biliSearchType = async ({ keywords, page = 1, pageSize = 42, search_type }: SearchBiliTypeQuery) => {
    const cookie = await axios
        .get(`https://api.bilibili.com/x/frontend/finger/spi`)
        .then((data) => `buvid3=${data.data.data.b_3};`);

    return await axios
        .get(
            `https://api.bilibili.com/x/web-interface/search/type?page=${page}&page_size=${pageSize}&keyword=${encodeURI(
                keywords
            )}&search_type=${search_type}`,
            {
                headers: {
                    cookie,
                },
            }
        )
        .then((data) => {
            const { page, pagesize, numPages, numResults, result } = data.data.data;
            return {
                page,
                pagesize,
                numResults,
                numPages,
                result: result ?? [],
            };
        })
        .catch((e) => {
            throw {
                status: e.status,
                message: e.response.data.message,
            };
        });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        const { keywords, page, pageSize, search_type } = getQuery(req, res);
        if (!keywords) {
            res.status(400).send({ code: 0, data: null, message: '请传入搜索关键字' });
            return;
        }
        if (!search_type) {
            res.status(400).send({ code: 0, data: null, message: '请传入搜索类型' });
            return;
        }
        const result = await biliSearchType({ keywords, page, pageSize, search_type });
        res.status(200).send({
            code: 0,
            data: result,
        });
    } catch (e: any) {
        res.status(e.status || 500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
