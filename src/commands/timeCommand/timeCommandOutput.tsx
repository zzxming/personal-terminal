import { useEffect, useState } from 'react';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP } from '@/assets/js/const';
import { ConfigData } from '@/interface/interface';
import { localStorageGetItem } from '@/utils/localStorage';
import css from './index.module.scss';

const TimeCount: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    useEffect(() => {
        timeVisible();
        const timer = setInterval(() => setDate(new Date()), 200);
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], timeVisible);
        return () => {
            clearInterval(timer);
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], timeVisible);
        };
    }, []);

    const timeVisible = () => {
        const { time } = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        setShow(time);
    };

    return (
        <>{show ? <div className={css.time}>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</div> : ''}</>
    );
};

export { TimeCount };
