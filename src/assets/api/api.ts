import originAxios, { AxiosError } from 'axios';

export const axios = originAxios.create({
    baseURL: '/api',
});

export interface AxiosResolve<T> {
    data: {
        code: number;
        data: T;
        message?: string;
    };
}
export interface AxiosReject<T = { message: string }> extends AxiosError<T> {}
