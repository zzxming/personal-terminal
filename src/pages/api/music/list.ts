import { NextApiRequest, NextApiResponse } from 'next';
import { dbQuery } from '@/server/utils';
import { getQuery } from '@/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        const { page = 1, pageSize = 500 } = getQuery(req, res);
        const { data } = await dbQuery(`SELECT * FROM music limit ${(+page - 1) * +pageSize}, ${pageSize}`);
        res.status(200).send({
            data,
            code: 0,
        });
    } catch (e: any) {
        res.status(e.status || 500).send({
            code: 500,
            data: null,
            message: e.message,
        });
    }
};
