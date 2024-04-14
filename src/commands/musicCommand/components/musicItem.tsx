import { CloudMusic } from '@/interface';
import { type MouseEvent } from 'react';
import { Skeleton } from 'antd';
import { MusicItemTag } from '@/commands/musicCommand/components/musicItemTag';
import { CloseOutlined } from '@ant-design/icons';
import css from '../index.module.scss';

interface MusicItemProps {
    info: CloudMusic;
    loading?: boolean;
    onClick?: (info: CloudMusic, index: number) => void;
    index: number;
    onRemove?: (e: MouseEvent, index: number) => void;
    className?: string;
    endItem?: React.ReactNode;
    [key: string]: any;
}

export const MusicItem = ({
    info,
    loading,
    onClick,
    index,
    onRemove,
    className,
    endItem,
    ...attrs
}: MusicItemProps) => {
    const mergedClassName = [css['music_item'], className].join(' ');
    const handleClick = () => {
        onClick && onClick(info, index);
    };
    return !loading ? (
        <div
            className={mergedClassName}
            onClick={handleClick}
            {...attrs}
        >
            <span className={css['music_item-count']}>{index + 1}</span>
            <div className={css['music_item_info']}>
                <p className={css['music_item-title']}>{info.name}</p>
                <p className={css['music_item_detail']}>
                    <MusicItemTag info={info} />
                    <span className={css['music_item-author']}>{info.ar.map((a) => a.name).join('/')}</span>
                </p>
            </div>
            <div className={css['music_item_control']}>
                {onRemove ? (
                    <span
                        className={css['music_item-remove']}
                        onClick={(e) => onRemove(e, index)}
                    >
                        <CloseOutlined />
                    </span>
                ) : null}
                {endItem}
            </div>
        </div>
    ) : (
        <div
            className={css['music_skeleton']}
            {...attrs}
        >
            <Skeleton
                active
                title={{ width: '70%' }}
                paragraph={false}
            />
        </div>
    );
};
