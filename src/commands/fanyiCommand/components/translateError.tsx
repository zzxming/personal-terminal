import { FanyiRejResult } from '@/assets/api';
import css from '../index.module.scss';

interface TranslateErrorProps {
    error: FanyiRejResult;
}
export const TranslateError = (props: TranslateErrorProps) => {
    const { error } = props;
    return (
        <div className={css.translate_error}>
            error code: {error.error_code}, {error.error_msg}, detail see{' '}
            <a
                href="https://api.fanyi.baidu.com/doc/21"
                style={{ color: '#1890ff' }}
                target="_blank"
            >
                接入文档
            </a>
        </div>
    );
};
