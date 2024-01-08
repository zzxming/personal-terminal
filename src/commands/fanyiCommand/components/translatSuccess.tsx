import { FanyiResResult } from '@/assets/api';
import css from '../index.module.scss';
import { lang } from '@/assets/js/translateLanguage';

interface TranslateSuccessProps extends FanyiResResult {}
export const TranslateSuccess = (props: TranslateSuccessProps) => {
    const { to, from, trans_result } = props;
    return (
        <div className={css.translate_success}>
            <div className={css.translate_item}>
                <p className={css.translate_lang}>{lang[from]}</p>
                <p className={css.translate_content}>{trans_result[0].src}</p>
            </div>

            <div className={css.translate_item}>
                <p className={css.translate_lang}>{lang[to]}</p>
                <p className={css.translate_content}>{trans_result[0].dst}</p>
            </div>
        </div>
    );
};
