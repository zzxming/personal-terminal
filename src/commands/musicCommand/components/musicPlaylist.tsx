import Icon, { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import Music from '@/assets/svg/music.svg';
import Play from '@/assets/svg/play.svg';
import Pause from '@/assets/svg/pause.svg';
import ArrowLeft from '@/assets/svg/arrow-left.svg';
import ArrowRight from '@/assets/svg/arrow-right.svg';
import Volume from '@/assets/svg/volume.svg';
import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Popover, Skeleton, Slider } from 'antd';
import { useAudio } from '@/hooks';
import { getCloudMusicListInfo, getCloudMusicInfo } from '@/assets/api';
import { CloudMusic, PlaylistConfig, CloudPlaylist } from '@/interface';
import { LOCALSTORAGEPLAYLIST, LOCALSTORAGEEVENTMAP } from '@/assets/js';
import { localStorageGetItem } from '@/utils';
import { MusicItemTag } from '@/commands/musicCommand/components/musicItemTag';
import css from '../index.module.scss';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

export const MusicPlaylist = () => {
    const [isActive, setIsActive] = useState(false);
    const [playlistMusic, setPlaylistMusic] = useState<CloudMusic[]>([]);
    const [playlistInfo, setPlaylistInfo] = useState<CloudPlaylist>();
    const tracks = playlistInfo?.trackIds || [];
    const [activeMusic, setActiveMusic] = useState<CloudMusic>();
    const activeMusicIndex = playlistMusic.findIndex((info) => info?.id === activeMusic?.id);
    const [loading, setLoading] = useState(false);
    const onEnd = useCallback(() => {
        switchMusicByIndex(activeMusicIndex + 1);
    }, [activeMusicIndex]);
    const { audio, isPause, volume, canPlay, play, pause, setAudioSrc, changeVolume } = useAudio({ onEnd });
    const audioVolume = volume * 100;

    const switchDisplay = () => {
        setIsActive((val) => !val);
    };
    const switchMusic = (music: CloudMusic) => {
        if (!music || music.id === activeMusic?.id) return;
        setActiveMusic(music);
        // 从这里切换，若fee=1请求本地是否存在，如果不存在则获取cloud并message提示当前为vip
        // 否则切换本地，并提示当前切换至本地
        setAudioSrc(`/api/music/${music.id}?fee=${music.fee}`);
    };
    const switchMusicByIndex = (index: number) => {
        if (index < 0) {
            index = playlistMusic.length - 1;
        } else if (index > playlistMusic.length - 1) {
            index = 0;
        }
        switchMusic(playlistMusic[index]);
    };
    const removeMusicFromPlaylist = (event: MouseEvent, index: number) => {
        event.stopPropagation();
        setPlaylistMusic((val) => {
            const newVal = [...val];
            newVal.splice(index, 1);
            return newVal;
        });
    };

    const getMusicsInfo = async (ids: string[]) => {
        const [err, res] = await getCloudMusicInfo(ids);
        if (err) return;
        return res.data.data;
    };
    const getPlaylistInfo = async (id: string) => {
        setLoading(true);
        const [err, res] = await getCloudMusicListInfo(id);
        setLoading(false);
        if (err) return;
        setPlaylistInfo(res.data.data);
        setPlaylistMusic(new Array(res.data.data.trackCount));
    };
    const loadMoreItems = async (startIndex: number, stopIndex: number) => {
        const songs = await getMusicsInfo(tracks.slice(startIndex, stopIndex + 1).map((item) => `${item.id}`));
        if (!songs) return;
        setPlaylistMusic((value) => {
            const val = [...value];
            val.splice(startIndex, stopIndex - startIndex + 1, ...songs);
            return val;
        });
    };
    const isItemLoaded = (index: number) => !!playlistMusic[index];

    const refreshPlaylist = () => {
        const config = localStorageGetItem<PlaylistConfig>(LOCALSTORAGEPLAYLIST);
        if (!config || !config.id) return;
        setPlaylistMusic([]);
        setPlaylistInfo(undefined);
        getPlaylistInfo(config.id);
    };

    useEffect(() => {
        refreshPlaylist();
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEPLAYLIST], refreshPlaylist);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEPLAYLIST], refreshPlaylist);
        };
    }, []);

    return (
        <div className={css['playlist']}>
            <Icon
                className={css['playlist_icon']}
                onClick={switchDisplay}
                component={Music}
            ></Icon>
            <div className={[css['playlist_popover'], isActive ? css['active'] : css['hide']].join(' ')}>
                {activeMusic ? (
                    <>
                        <div className={css['playlist_music']}>
                            <div className={css['playlist_music_info']}>
                                <h3 className={css['playlist_music-title']}>{activeMusic.name}</h3>
                                <p className={css['playlist_music-detail']}>
                                    {activeMusic.ar.map((a) => a.name).join('/')}
                                </p>
                            </div>
                        </div>
                        <div className={css['playlist_music_control']}>
                            <Icon
                                className={css['playlist_icon']}
                                component={ArrowLeft}
                                onClick={() => switchMusicByIndex(activeMusicIndex - 1)}
                            ></Icon>
                            {!canPlay ? (
                                <LoadingOutlined />
                            ) : (
                                <Icon
                                    className={css['playlist_icon']}
                                    onClick={() => (isPause ? play() : pause())}
                                    component={isPause ? Play : Pause}
                                ></Icon>
                            )}
                            <Icon
                                className={css['playlist_icon']}
                                component={ArrowRight}
                                onClick={() => switchMusicByIndex(activeMusicIndex + 1)}
                            ></Icon>
                            <Popover
                                content={
                                    <div className={css['playlist_music-volume']}>
                                        <Slider
                                            vertical
                                            defaultValue={audioVolume}
                                            onChange={changeVolume}
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
                {loading ? (
                    <div className={css['playlist_list-loading']}>
                        <LoadingOutlined />
                    </div>
                ) : (
                    <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={playlistInfo?.trackCount || 0}
                        loadMoreItems={loadMoreItems}
                    >
                        {({ onItemsRendered, ref }) => (
                            <FixedSizeList
                                ref={ref}
                                height={288}
                                itemCount={playlistInfo?.trackCount || 0}
                                itemSize={52}
                                width={'100%'}
                                onItemsRendered={onItemsRendered}
                            >
                                {({ index, style }) => {
                                    const info = playlistMusic[index];
                                    return info ? (
                                        <button
                                            className={[
                                                css['playlist_list_item'],
                                                index === activeMusicIndex ? css['active'] : '',
                                            ].join(' ')}
                                            style={style}
                                            onClick={() => switchMusic(info)}
                                        >
                                            <span className={css['playlist_list_item-count']}>{index + 1}</span>
                                            <div className={css['playlist_list_item_info']}>
                                                <p className={css['playlist_list_item-title']}>{info.name}</p>
                                                <p className={css['playlist_list_item_detail']}>
                                                    <MusicItemTag info={info} />
                                                    <span className={css['playlist_list_item-author']}>
                                                        {info.ar.map((a) => a.name).join('/')}
                                                    </span>
                                                </p>
                                            </div>
                                            <span
                                                className={css['playlist_list_item-remove']}
                                                onClick={(e) => removeMusicFromPlaylist(e, index)}
                                            >
                                                <CloseOutlined />
                                            </span>
                                        </button>
                                    ) : (
                                        <div
                                            className={css['playlist_list_skeleton']}
                                            style={style}
                                        >
                                            <Skeleton
                                                active
                                                title={{ width: '70%' }}
                                                paragraph={false}
                                            />
                                        </div>
                                    );
                                }}
                            </FixedSizeList>
                        )}
                    </InfiniteLoader>
                )}
            </div>
        </div>
    );
};
