import { BiliVideoInfo } from '@/interface/interface';
import css from '../index.module.scss';
import { BiliVideoCover } from './biliVideoCover';
import Icon from '@ant-design/icons';
import Up from '@/assets/svg/up.svg';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

// export type BiliVideoInfo = {
//     pic: string;
//     bvid: string;
//     play: number;
//     id: number;
//     danmaku: number;
//     title: string;
//     author: string;
//     senddate: number;
//     duration: string;
//     arcurl: string;
//     mid: number;
// };
interface BiliVideoItemProps {
    info: BiliVideoInfo;
    playVideo: (bvid: string) => void;
}
const BiliVideoItem = ({
    info: { bvid, title, pic, play, danmaku, senddate, duration, author },
    playVideo,
}: BiliVideoItemProps) => {
    const displayRelativeDate = dayjs.unix(senddate).fromNow();

    const openVideo = () => {
        playVideo(bvid);
    };
    return (
        <div
            className={css.video_item}
            onClick={openVideo}
        >
            <BiliVideoCover
                pic={pic}
                play={play}
                danmaku={danmaku}
                duration={duration}
            />
            <div className={css.video_info}>
                <h3
                    className={css['video_info-title']}
                    dangerouslySetInnerHTML={{ __html: title }}
                ></h3>
                <p className={css['video_info_bottom']}>
                    <span className={css.video_info_owner}>
                        <Icon
                            className={css.icon}
                            component={Up}
                        ></Icon>
                        <span className={css['video_info-author']}>{author}</span>
                        <span className={css['video_info-date']}>{displayRelativeDate}</span>
                    </span>
                </p>
            </div>
        </div>
    );
};

export { BiliVideoItem };
