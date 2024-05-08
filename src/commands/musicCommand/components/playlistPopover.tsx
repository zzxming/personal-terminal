import Icon, { LoadingOutlined } from '@ant-design/icons';
import Music from '@/assets/svg/music.svg';
import Play from '@/assets/svg/play.svg';
import Pause from '@/assets/svg/pause.svg';
import ArrowLeft from '@/assets/svg/arrow-left.svg';
import ArrowRight from '@/assets/svg/arrow-right.svg';
import Volume from '@/assets/svg/volume.svg';
import { useContext, useEffect, useState } from 'react';
import { Popover, Slider } from 'antd';
import { CloudMusic, MusicConfig } from '@/interface';
import { MusicPlaylist } from '@/commands/musicCommand/components/musicPlaylist';
import css from '../index.module.scss';
import { observer } from 'mobx-react-lite';
import { AudioStoreContext, PlaylistStoreContext } from '@/lib';
import { localStorageGetItem } from '@/utils';
import { LOCALSTORAGEMUSIC } from '@/assets/js';

export const PlaylistPopover = observer(() => {
    const audioStore = useContext(AudioStoreContext);
    const playlistStore = useContext(PlaylistStoreContext);
    const [isActive, setIsActive] = useState(false);
    const audioVolume = audioStore.volume * 100;

    useEffect(() => {
        audioStore.changeVolume(localStorageGetItem<MusicConfig>(LOCALSTORAGEMUSIC)?.volume);
    }, []);

    const switchDisplay = () => {
        setIsActive((val) => !val);
    };
    const switchMusic = (music: CloudMusic) => {
        if (!music || music.id === playlistStore.currentMusic?.id) return;
        playlistStore.setCurrentMusic(music);
        audioStore.loadCurMusic();
    };
    const switchMusicByIndex = (index: number) => {
        if (index < 0) {
            index = playlistStore.playlistMusic.length - 1;
        } else if (index > playlistStore.playlistMusic.length - 1) {
            index = 0;
        }
        switchMusic(playlistStore.playlistMusic[index]);
    };

    return (
        <div className={css['playlist']}>
            <Icon
                className={css['playlist_icon']}
                onClick={switchDisplay}
                component={Music}
            ></Icon>
            <div className={[css['playlist_popover'], isActive ? css['active'] : css['hide']].join(' ')}>
                {playlistStore.currentMusic ? (
                    <>
                        <div className={css['playlist_music']}>
                            <div className={css['playlist_music_info']}>
                                <h3 className={css['playlist_music-title']}>{playlistStore.currentMusic.name}</h3>
                                <p className={css['playlist_music-detail']}>
                                    {playlistStore.currentMusic.ar.map((a) => a.name).join('/')}
                                </p>
                            </div>
                        </div>
                        <div className={css['playlist_music_control']}>
                            <Icon
                                className={css['playlist_icon']}
                                component={ArrowLeft}
                                onClick={() => switchMusicByIndex(playlistStore.currentMusicIndex - 1)}
                            ></Icon>
                            {!audioStore.canPlay ? (
                                <LoadingOutlined />
                            ) : (
                                <Icon
                                    className={css['playlist_icon']}
                                    onClick={() => (audioStore.isPause ? audioStore.play() : audioStore.pause())}
                                    component={audioStore.isPause ? Play : Pause}
                                ></Icon>
                            )}
                            <Icon
                                className={css['playlist_icon']}
                                component={ArrowRight}
                                onClick={() => switchMusicByIndex(playlistStore.currentMusicIndex + 1)}
                            ></Icon>
                            <Popover
                                content={
                                    <div className={css['playlist_music-volume']}>
                                        <Slider
                                            vertical
                                            defaultValue={audioVolume}
                                            onChange={audioStore.changeVolume}
                                        />
                                    </div>
                                }
                            >
                                <Icon
                                    className={css['playlist_icon']}
                                    component={Volume}
                                ></Icon>
                            </Popover>
                        </div>
                    </>
                ) : null}
                <MusicPlaylist itemClick={switchMusic} />
            </div>
        </div>
    );
});
