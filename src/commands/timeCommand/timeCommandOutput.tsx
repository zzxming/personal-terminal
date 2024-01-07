import { useEffect, useState } from 'react';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP } from '@/assets/js/const';
import { ConfigData } from '@/interface/interface';
import { localStorageGetItem } from '@/utils/localStorage';
import css from './index.module.css';

const TimeCount: React.FC = () => {
    let [date, setDate] = useState(new Date());
    let [show, setShow] = useState(false);

    useEffect(() => {
        timeVisible();
        let timer = setInterval(() => setDate(new Date()), 200);
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], timeVisible);
        return () => {
            clearInterval(timer);
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], timeVisible);
        };
    }, []);

    const timeVisible = () => {
        let { time } = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        setShow(time);
    };

    return (
        <>{show ? <div className={css.time}>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</div> : ''}</>
    );
};

export { TimeCount };
