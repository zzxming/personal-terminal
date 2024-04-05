import Icon, { CloseOutlined } from '@ant-design/icons';
import css from '../index.module.scss';
import Music from '@/assets/svg/music.svg';
import Play from '@/assets/svg/play.svg';
import Pause from '@/assets/svg/pause.svg';
import ArrowLeft from '@/assets/svg/arrow-left.svg';
import ArrowRight from '@/assets/svg/arrow-right.svg';
import Volume from '@/assets/svg/volume.svg';
import { useCallback, useEffect, useState } from 'react';
import { Divider, List, Popover, Slider, Typography } from 'antd';
import { useAudio, usePage } from '@/hooks';
import { getCloudMusicList } from '@/assets/api';
import { CloudMusic, PageQuery, PlaylistConfig } from '@/interface';
import { LOCALSTORAGEPLAYLIST, LOCALSTORAGEEVENTMAP } from '@/assets/js/const';
import { localStorageGetItem } from '@/utils';
import InfiniteScroll from 'react-infinite-scroll-component';

export const MusicPlaylist = () => {
    const [isActive, setIsActive] = useState(false);
    const [playlist, setPlaylist] = useState<CloudMusic[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [activeMusic, setActiveMusic] = useState<CloudMusic>();
    const activeMusicIndex = playlist.findIndex((info) => info.id === activeMusic?.id);
    const [loading, setLoading] = useState(false);
    const onEnd = useCallback(() => {
        switchMusicByIndex(activeMusicIndex + 1);
    }, [activeMusicIndex]);
    const { audio, isPause, volume, play, pause, setAudioSrc, changeVolume } = useAudio({ onEnd });
    const audioVolume = volume * 100;

    const switchMusic = (music: CloudMusic) => {
        setActiveMusic(music);
        // 从这里切换，若fee=1请求本地是否存在，如果不存在则获取cloud并message提示当前为vip
        // 否则切换本地，并提示当前切换至本地
        setAudioSrc(`/api/music/${music.id}?fee=${music.fee}`);
    };
    const switchMusicByIndex = (index: number) => {
        if (index < 0) {
            index = playlist.length - 1;
        } else if (index > playlist.length - 1) {
            index = 0;
        }
        switchMusic(playlist[index]);
    };
    const getPlaylist = (id: string, pageQuery: PageQuery) =>
        getCloudMusicList(id, pageQuery).then(([err, res]) => {
            if (err) {
                setHasMore(false);
                return;
            }
            setHasMore(res.data.data.length <= pageQuery.pageSize);
            setPlaylist([...playlist, ...res.data.data]);
        });

    const { getNextPageData } = usePage({ request: getPlaylist, pageSize: 20 });

    const getPlaylistId = () => {
        const config = localStorageGetItem<PlaylistConfig>(LOCALSTORAGEPLAYLIST);
        if (!config || !config.id) return;
        if (loading) return;
        setHasMore(true);
        setLoading(true);
        getNextPageData(config.id).finally(() => setLoading(false));
        // getNextPageData('406044909').finally(() => setLoading(false));
    };

    const refreshPlaylist = () => {
        setPlaylist([]);
        getPlaylistId();
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
                onClick={() => setIsActive((val) => !val)}
                component={Music}
            ></Icon>
            <div className={[css['playlist_popover'], isActive ? css['active'] : css['hide']].join(' ')}>
                {activeMusic ? (
                    <>
                        <div className={css['playlist_music']}>
                            <div className={css['playlist_music_info']}>
                                <h3 className={css['playlist_music-title']}>{activeMusic.name}</h3>
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
                <div
                    id="playlist_list"
                    className={css['playlist_list']}
                >
                    <InfiniteScroll
                        dataLength={playlist.length}
                        next={getPlaylistId}
                        hasMore={hasMore}
                        loader={
                            <div className={css['playlist_list_load']}>
                                <Typography.Text type="secondary">loading...</Typography.Text>
                            </div>
                        }
                        endMessage={<Divider plain>没有更多</Divider>}
                        scrollableTarget="playlist_list"
                        inverse={false}
                    >
                        {playlist.length ? (
                            <List
                                dataSource={playlist}
                                renderItem={(item, i) => (
                                    <button
                                        className={[
                                            css['playlist_list_item'],
                                            activeMusic?.id === item.id ? css['active'] : '',
                                        ].join(' ')}
                                        onClick={() => switchMusic(item)}
                                    >
                                        <span className={css['playlist_list_item-count']}>{i + 1}</span>
                                        <div className={css['playlist_list_item_detail']}>
                                            <p className={css['playlist_list_item-title']}>{item.name}</p>
                                        </div>
                                    </button>
                                )}
                            />
                        ) : null}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};
