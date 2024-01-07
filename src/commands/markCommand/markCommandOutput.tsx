import { useEffect, useState } from 'react';
import { Avatar, Card, List } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { ConfigData, Mark, MarkData } from '@/interface/interface';
import css from './index.module.css';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP, LOCALSTORAGEMARK } from '@/assets/js/const';
import { CommandResultListOutput } from '@/components/commandListOutput';

const MarkNav: React.FC = () => {
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
        let { data } = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
        let { mark } = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
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
            {show && marks.length > 0 ? (
                <div className={css.mark_nav}>
                    <List
                        dataSource={marks}
                        split={false}
                        renderItem={(item) => (
                            <List.Item title={`${item.title}${'\n'}${item.url}`}>
                                <a
                                    className={css.mark_nav_item}
                                    href={item.url}
                                >
                                    <Avatar
                                        className={css.mark_icon}
                                        icon={<GlobalOutlined />}
                                        src={item.icon}
                                    />
                                    <span className={css.mark_link}>{item.title}</span>
                                </a>
                            </List.Item>
                        )}
                    />
                </div>
            ) : (
                ''
            )}
        </>
    );
};

const MarkList: React.FC = () => {
    let { data } = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;

    return (
        <CommandResultListOutput<Mark>
            data={data}
            render={(item, index) => (
                <li className={css.mark_list_item}>
                    <Card
                        type="inner"
                        title={
                            <>
                                <Avatar
                                    className={css.mark_icon}
                                    icon={<GlobalOutlined />}
                                    src={item.icon}
                                />
                                {item.title}
                            </>
                        }
                    >
                        <span
                            className={css.mark_list_item_title}
                            title={item.url}
                        >
                            {item.url}
                        </span>
                    </Card>
                </li>
            )}
        />
    );
};

export { MarkNav, MarkList };
