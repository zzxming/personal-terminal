import { useState } from 'react';

interface PageRequestOptions {
    startPage?: number;
    pageSize?: number;
    request: (...args: any[]) => Promise<any>;
}
export const usePage = ({ startPage = 1, pageSize = 500, request }: PageRequestOptions) => {
    const [page, setPage] = useState(startPage);

    const getNextPageData = (...args: any[]) => {
        return request(...args, { page: page, pageSize })
            .then((res: any) => {
                setPage(page + 1);
                return Promise.resolve(res);
            })
            .catch((err: any) => {
                return Promise.reject(err);
            });
    };

    return {
        page,
        setPage,
        getNextPageData,
    };
};
