import originAxios from 'axios';

export const axios = originAxios.create({
    baseURL: '/api',
});

export interface AxiosResult<T> {
    data: {
        code: number;
        data: T;
        message?: string;
    };
}
