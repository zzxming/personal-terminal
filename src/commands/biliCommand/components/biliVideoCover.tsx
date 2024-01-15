import { useEffect, useState } from 'react';
import css from '../index.module.scss';
import { getBiliPic } from '@/assets/api';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import Count from '@/assets/svg/count.svg';
import Danmaku from '@/assets/svg/danmu.svg';
import { formatNumberToDisplay } from '@/utils/format';

interface BiliVideoCoverProps {
    pic: string;
    play: number;
    danmaku: number;
    duration: string;
}
const BiliVideoCover = ({ pic, play, danmaku, duration }: BiliVideoCoverProps) => {
    const [loading, setLoading] = useState(false);
    const [picSrc, setPicSrc] = useState('');
    useEffect(() => {
        setLoading(true);
        getBiliPic(pic).then(([err, res]) => {
            if (err || res.data.code !== 0) {
                return 'error';
            }
            setPicSrc(res.data.data);
            setLoading(false);
        });
    }, [pic]);
    const stats = [
        {
            key: 'play',
            icon: Count,
            count: formatNumberToDisplay(play),
        },
        {
            key: 'danmaku',
            icon: Danmaku,
            count: formatNumberToDisplay(danmaku),
        },
    ];
    const displayDuration = duration
        .split(':')
        .map((num) => num.padStart(2, '0'))
        .join(':');
    return (
        <div className={css.video_cover}>
            <div className={css.video_cover_mask}>
                <div className={css.video_cover_info}>
                    {stats.map(({ key, icon, count }) => (
                        <span
                            key={key}
                            className={css['video_cover_info-stats']}
                        >
                            <Icon
                                component={icon}
                                className={css.icon}
                            ></Icon>
                            <span>{count}</span>
                        </span>
                    ))}
                    <span className={css['video_cover_info-duration']}>{displayDuration}</span>
                </div>
            </div>
            {loading ? <LoadingOutlined className={css['video_cover-loading']} /> : ''}
            {picSrc ? (
                <img
                    className={css['video_cover-img']}
                    src={picSrc}
                    loading="lazy"
                />
            ) : (
                ''
            )}
        </div>
    );
};

export { BiliVideoCover };
