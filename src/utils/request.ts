import { NextApiRequest, NextApiResponse } from 'next';

export const getQuery = (req: NextApiRequest, res: NextApiResponse) => {
    const query = req.query;
    const result: { [key: string]: string } = {};
    for (const key in query) {
        let val = query[key]!;
        if (val instanceof Array) {
            val = val[0];
        }
        if (['page', 'pageSize', 'limit'].includes(key)) {
            if (!/^\+?[1-9]\d*$/.test(val)) {
                res.status(400).json({ code: 0, data: null, message: `${key}必须是正整数` });
                throw new Error(`${key}必须是正整数`);
            }
        }
        result[key] = val;
    }
    return result;
};
