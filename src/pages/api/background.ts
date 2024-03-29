import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const types = ['meizi', 'dongman', 'fengjing', 'suiji'];

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        let { type } = req.query;
        if (type instanceof Array) {
            type = type[0];
        }
        if (!type || !types.includes(type)) {
            console.info(`/background type参数错误: ${type}, 使用默认type值`);
            type = types[0];
        }
        const imageApiUrl = `https://api.btstu.cn/sjbz/api.php?lx=${type}&format=json`;

        const result = await axios
            .get(imageApiUrl)
            .then((res) => res.data.imgurl)
            .catch((e) => {
                throw {
                    status: e.status,
                    message: e.message,
                };
            });
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
