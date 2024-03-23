import { useEffect, useRef, useState } from 'react';
import { LOCALSTORAGETIME, LOCALSTORAGEEVENTMAP, LOCALSTORAGECONFIG } from '@/assets/js/const';
import { ConfigData, TimeConfig } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';
import css from '../index.module.scss';
import { useDraggable } from '@/hooks/draggable';

const TimeCount: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [config, setConfig] = useState(localStorageGetItem<TimeConfig>(LOCALSTORAGETIME));

    useEffect(() => {
        timeVisible();
        const timer = setInterval(() => setDate(new Date()), 200);
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGETIME], timeVisible);
        return () => {
            clearInterval(timer);
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGETIME], timeVisible);
        };
    }, []);

    const timeVisible = () => {
        const { time } = localStorageGetItem<ConfigData>(LOCALSTORAGECONFIG);
        setShow(time);
    };

    const timeRef = useRef<HTMLDivElement | null>(null);
    useDraggable(timeRef, {
        callback({ x, y }) {
            const config = localStorageGetItem<TimeConfig>(LOCALSTORAGETIME);
            localStorageSetItem(LOCALSTORAGETIME, {
                ...config,
                x,
                y,
            });
            setConfig({ x, y });
        },
    });

    return (
        <>
            {show ? (
                <div
                    ref={timeRef}
                    className={css.time}
                    style={{ left: config.x, top: config.y }}
                >{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</div>
            ) : (
                ''
            )}
        </>
    );
};

export { TimeCount };
