import { CloudMusic, CloudPlaylist } from '@/interface';
import { MusicItem } from '@/commands/musicCommand/components/musicItem';
import { PlaylistItem } from '@/commands/musicCommand/components/playlistItem';
import { Button, List } from 'antd';
import css from '../index.module.scss';
import Play from '@/assets/svg/play.svg';
import Icon from '@ant-design/icons';
import { MusicRequestType } from '../types';
import { useContext } from 'react';
import { AudioStoreContext, PlaylistStoreContext } from '@/lib';

interface MusicSearchListItemProps {
    type: MusicRequestType;
    data: (Omit<CloudPlaylist, 'trackIds'> | CloudMusic)[];
}

export const MusicSearchListItem = ({ type, data }: MusicSearchListItemProps) => {
    type DataType = typeof type extends MusicRequestType.Playlist
        ? Omit<CloudPlaylist, 'trackIds'>
        : typeof type extends MusicRequestType.Song
        ? CloudMusic
        : never;

    const playlistStore = useContext(PlaylistStoreContext);
    const audioStore = useContext(AudioStoreContext);
    let renderItem = null;

    const switchMusic = (item: CloudMusic) => {
        playlistStore.setPlaylistMusic(playlistStore.currentMusicIndex + 1, 0, item);
        playlistStore.nextMusic();
        audioStore.loadCurMusic();
    };
    const replacePlaylist = (item: CloudPlaylist) => {
        playlistStore.replacePlaylistById(`${item.id}`);
    };
    if (type === MusicRequestType.Playlist) {
        renderItem = (item: DataType, index: number) => (
            <List.Item>
                <PlaylistItem
                    info={item}
                    index={index}
                    endItem={
                        <Button
                            onClick={() => replacePlaylist(item)}
                            icon={
                                <Icon
                                    className={css['playlist_icon']}
                                    component={Play}
                                ></Icon>
                            }
                        />
                    }
                />
            </List.Item>
        );
    } else if (type === MusicRequestType.Song) {
        renderItem = (item: DataType, index: number) => (
            <List.Item>
                <MusicItem
                    info={item}
                    index={index}
                    endItem={
                        <Button
                            onClick={() => switchMusic(item)}
                            icon={
                                <Icon
                                    className={css['playlist_icon']}
                                    component={Play}
                                ></Icon>
                            }
                        />
                    }
                />
            </List.Item>
        );
    }
    if (renderItem) {
        return (
            <List
                className={css['search_result_list']}
                bordered
                dataSource={data as DataType[]}
                renderItem={renderItem}
            />
        );
    }
    return null;
};
