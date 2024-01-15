import { List } from 'antd';
import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { ConfigData } from '@/interface/interface';
import { localStorageGetItem } from '@/utils/localStorage';
import css from './index.module.css';

interface IResultList<T> {
    data: T[];
    render: (item: T, index: number) => React.ReactNode;
}

const CommandResultListOutput = <T,>(props: IResultList<T>) => {
    const { data, render } = props;
    const { style } = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;

    return (
        <>
            {data.length < 1 ? (
                <span className={css.txt}>无数据</span>
            ) : (
                <List
                    className={css.list_item}
                    style={{ color: style.color }}
                    itemLayout="vertical"
                    dataSource={data}
                    renderItem={render}
                />
            )}
        </>
    );
};

export { CommandResultListOutput };
