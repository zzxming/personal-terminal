'use client';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState, type MouseEvent, useContext, useRef } from 'react';
import { getCloudMusicInfo } from '@/assets/api';
import { LOCALSTORAGEPLAYLIST, LOCALSTORAGEEVENTMAP } from '@/assets/js';
import { CloudMusic, PlaylistConfig } from '@/interface';
import { localStorageGetItem } from '@/utils';
import { MusicItem } from '@/commands/musicCommand/components/musicItem';
import css from '../index.module.scss';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { observer } from 'mobx-react-lite';
import { PlaylistStoreContext } from '@/lib';

interface MusicPlaylistProps {
    itemClick: (info: CloudMusic, index: number) => void;
}

export const MusicPlaylist = observer(({ itemClick }: MusicPlaylistProps) => {
    const playlistStore = useContext(PlaylistStoreContext);
    const tracks = playlistStore.playlistInfo?.trackIds || [];
    const [loading, setLoading] = useState(false);

    const removeMusicFromPlaylist = (event: MouseEvent, index: number) => {
        event.stopPropagation();
        playlistStore.setPlaylistMusic(index, 1);
    };

    const getMusicsInfo = async (ids: string[]) => {
        const [err, res] = await getCloudMusicInfo(ids);
        if (err) return;
        return res.data.data;
    };
    const loadMoreItems = async (startIndex: number, stopIndex: number) => {
        if (!tracks.length) return;
        const songs = await getMusicsInfo(tracks.slice(startIndex, stopIndex + 1).map((item) => `${item.id}`));
        if (!songs) return;
        playlistStore.setPlaylistMusic(startIndex, stopIndex - startIndex + 1, ...songs);
    };
    const isItemLoaded = (index: number) => !!playlistStore.playlistMusic[index];

    const getPlaylistInfo = async (id: string) => {
        setLoading(true);
        await playlistStore.replacePlaylistById(id);
        setLoading(false);
    };
    const refreshPlaylist = async () => {
        const config = localStorageGetItem<PlaylistConfig>(LOCALSTORAGEPLAYLIST);
        if (!config || !config.id) return;
        playlistStore.setPlaylistInfo(null);
        playlistStore.setPlaylistMusic(0, playlistStore.playlistMusic.length);
        await getPlaylistInfo(config.id);
    };

    useEffect(() => {
        refreshPlaylist();
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEPLAYLIST], refreshPlaylist);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGEPLAYLIST], refreshPlaylist);
        };
    }, []);

    return (
        <>
            {loading ? (
                <div className={css['playlist_list-loading']}>
                    <LoadingOutlined />
                </div>
            ) : (
                <InfiniteLoader
                    key={playlistStore.playlistInfo?.id}
                    isItemLoaded={isItemLoaded}
                    itemCount={playlistStore.playlistInfo?.trackCount || 0}
                    loadMoreItems={loadMoreItems}
                >
                    {({ onItemsRendered, ref }) => (
                        <FixedSizeList
                            className={css['playlist_list']}
                            ref={ref}
                            height={288}
                            itemCount={playlistStore.playlistInfo?.trackCount || 0}
                            itemSize={52}
                            width={'100%'}
                            onItemsRendered={onItemsRendered}
                        >
                            {({ index, style }) => {
                                const info = playlistStore.playlistMusic[index];
                                return (
                                    <MusicItem
                                        className={index === playlistStore.currentMusicIndex ? css['active'] : ''}
                                        loading={!info}
                                        info={info}
                                        index={index}
                                        onClick={itemClick}
                                        onRemove={removeMusicFromPlaylist}
                                        style={style}
                                    />
                                );
                            }}
                        </FixedSizeList>
                    )}
                </InfiniteLoader>
            )}
        </>
    );
});
