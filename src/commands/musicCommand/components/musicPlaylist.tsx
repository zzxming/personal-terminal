import Icon from '@ant-design/icons';
import css from '../index.module.scss';
import Music from '@/assets/svg/music.svg';
import Play from '@/assets/svg/play.svg';
import Pause from '@/assets/svg/pause.svg';
import ArrowLeft from '@/assets/svg/arrow-left.svg';
import ArrowRight from '@/assets/svg/arrow-right.svg';
import { useEffect, useState } from 'react';
import { List } from 'antd';
import { useAudio } from '@/hooks';
import { getMusicList } from '@/assets/api';
import { MusicInfo } from '@/interface/interface';

export const MusicPlaylist = () => {
    const [isActive, setIsActive] = useState(false);
    const [playlist, setPlaylist] = useState<MusicInfo[]>([]);
    const [activeMusic, setActiveMusic] = useState<MusicInfo>();
    const activeMusicIndex = playlist.findIndex((info) => info.id === activeMusic?.id);

    const { audio, isPause, play, pause, setAudio } = useAudio();
    const getAllMusicList = async () => {
        const [err, res] = await getMusicList();
        if (err) return;
        setPlaylist(res.data.data);
    };
    const switchMusic = (music: MusicInfo) => {
        setAudio(music.path);
        setActiveMusic(music);
    };
    const switchMusicByIndex = (index: number) => {
        if (index < 0) {
            index = playlist.length - 1;
        } else if (index > playlist.length - 1) {
            index = 0;
        }
        switchMusic(playlist[index]);
    };

    useEffect(() => {
        getAllMusicList();
    }, []);

    return (
        <div className={css['playlist']}>
            <Icon
                className={css['playlist_icon']}
                onClick={() => setIsActive((val) => !val)}
                component={Music}
            ></Icon>
            <div className={[css['playlist_popover'], isActive ? css['active'] : css['hide']].join(' ')}>
                {activeMusic ? (
                    <>
                        <div className={css['playlist_music']}>
                            <div className={css['playlist_music_info']}>
                                <h3 className={css['playlist_music-title']}>{activeMusic.name}</h3>
                                {/* <p className={css['playlist_music-detail']}>Lorem</p> */}
                            </div>
                        </div>
                        <div className={css['playlist_music_control']}>
                            <Icon
                                className={css['playlist_icon']}
                                component={ArrowLeft}
                                onClick={() => switchMusicByIndex(activeMusicIndex - 1)}
                            ></Icon>
                            <Icon
                                className={css['playlist_icon']}
                                onClick={() => (isPause ? play() : pause())}
                                component={isPause ? Play : Pause}
                            ></Icon>
                            <Icon
                                className={css['playlist_icon']}
                                component={ArrowRight}
                                onClick={() => switchMusicByIndex(activeMusicIndex + 1)}
                            ></Icon>
                        </div>
                    </>
                ) : null}
                <List
                    className={css['playlist_list']}
                    dataSource={playlist}
                    renderItem={(item, i) => (
                        <div
                            className={[
                                css['playlist_list_item'],
                                activeMusic?.id === item.id ? css['active'] : '',
                            ].join(' ')}
                            onDoubleClick={() => switchMusic(item)}
                        >
                            <span className={css['playlist_list_item-count']}>{i + 1}</span>
                            <div className={css['playlist_list_item_detail']}>
                                <p className={css['playlist_list_item-title']}>{item.name}</p>
                                {/* <p className={css['playlist_list_item-author']}>{item}</p> */}
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
