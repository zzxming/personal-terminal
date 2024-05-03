import css from './index.module.scss';
import type { CSSProperties } from 'react';

interface SubListProps {
    column: number;
    ItemNums: number;
    renderItem: (index: number) => React.ReactNode;
}

const SubList = (props: SubListProps) => {
    const { column, ItemNums, renderItem } = props;
    const listStyle = {
        '--columns': column,
    } as CSSProperties;
    return (
        <div
            className={css.sub_list}
            style={listStyle}
        >
            {new Array(ItemNums).fill(0).map((_, i) => (
                <div
                    className={css.sub_list_item}
                    key={i}
                >
                    {renderItem(i)}
                </div>
            ))}
        </div>
    );
};

export { SubList };
