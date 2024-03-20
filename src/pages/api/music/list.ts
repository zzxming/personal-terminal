import { NextApiRequest, NextApiResponse } from 'next';
import { dbQuery } from '@/server/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        const { data } = await dbQuery('SELECT * FROM music');
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
