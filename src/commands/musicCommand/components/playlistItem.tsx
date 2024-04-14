import { CloudPlaylist } from '@/interface';
import { Skeleton } from 'antd';
import css from '../index.module.scss';

interface PlaylistItemProps {
    info: Omit<CloudPlaylist, 'trackIds'>;
    index: number;
    loading?: boolean;
    endItem?: React.ReactNode;
    [key: string]: any;
}

export const PlaylistItem = ({ info, index, loading, endItem, ...attrs }: PlaylistItemProps) => {
    console.log(info);
    return !loading ? (
        <div className={css['playlist_item']}>
            <span className={css['playlist_item-count']}>{index + 1}</span>
            <div className={css['playlist_item_info']}>
                <p className={css['playlist_item-title']}>{info.name}</p>
                <p className={css['playlist_item_detail']}>
                    <span className={css['playlist_item-author']}>{info.creator.nickname}</span>
                    <span className={css['playlist_item-trackcount']}>共 {info.trackCount} 首歌曲</span>
                </p>
            </div>
            <div className={css['playlist_item_control']}>{endItem}</div>
        </div>
    ) : (
        <div
            className={css['playlist_skeleton']}
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
