import { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { ConfigData, Mark, MarkData } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP, LOCALSTORAGEMARK } from '@/assets/js/const';
import css from '../index.module.scss';

export const MarkNav = () => {
    const [show, setShow] = useState(false);
    const [marks, setMarks] = useState<Mark[]>([]);

    // 监听事件, 使mark同步
    useEffect(() => {
        getMark();
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEMARK], getMark);
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], getMark);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEMARK], getMark);
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], getMark);
        };
    }, []);
    /** 获取最新mark */
    const getMark = () => {
        let { data } = localStorageGetItem<MarkData>(LOCALSTORAGEMARK);
        let { mark } = localStorageGetItem<ConfigData>(LOCALSTORAGECONFIG);
        // console.log(data)
        if (!data) {
            // 初始化localstorage的mark
            localStorageSetItem(LOCALSTORAGEMARK, { data: [] });
            setShow(mark);
            setMarks([]);
            return;
        }
        setShow(mark);
        setMarks(data);
    };

    return (
        <>
            {show ? (
                <div className={css.mark_nav}>
                    {marks.map((mark) => (
                        <a
                            key={mark.key}
                            className={css.mark_nav_item}
                            href={mark.url}
                        >
                            <Avatar
                                className={css.mark_icon}
                                icon={<GlobalOutlined />}
                                src={mark.icon}
                            />
                            <span className={css.mark_link}>{mark.title}</span>
                        </a>
                    ))}
                </div>
            ) : (
                ''
            )}
        </>
    );
};
