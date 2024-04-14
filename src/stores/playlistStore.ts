'use client';
import { getCloudMusicListInfo } from '@/assets/api';
import { CloudPlaylist, CloudMusic } from '@/interface';
import { message } from 'antd';
import { action, makeObservable, observable, computed } from 'mobx';

enum State {
    pending = 'pending',
    done = 'done',
    error = 'error',
}
export class PlaylistStore {
    playlistInfo: null | CloudPlaylist;
    playlistMusic: CloudMusic[];
    currentMusic: null | CloudMusic;
    state = State.done;

    constructor() {
        this.playlistInfo = null;
        this.playlistMusic = [];
        this.currentMusic = null;
        makeObservable(this, {
            playlistInfo: observable,
            playlistMusic: observable,
            currentMusic: observable,
            currentMusicIndex: computed,
            setPlaylistInfo: action,
            setPlaylistMusic: action,
            setCurrentMusic: action,
            nextMusic: action,
            lastMusic: action,
            calclateLastMusicIndex: false,
            calclateNextMusicIndex: false,
            replacePlaylistById: action,
        });
    }
    get currentMusicIndex() {
        if (!this.currentMusic) return -1;
        return this.playlistMusic.findIndex((item) => item?.id === this.currentMusic?.id);
    }

    calclateLastMusicIndex() {
        return (this.currentMusicIndex - 1 + this.playlistMusic.length) % this.playlistMusic.length;
    }
    calclateNextMusicIndex() {
        return (this.currentMusicIndex + 1) % this.playlistMusic.length;
    }
    nextMusic() {
        const index = this.calclateNextMusicIndex();
        this.currentMusic = this.playlistMusic[index];
    }
    lastMusic() {
        const index = this.calclateLastMusicIndex();
        this.currentMusic = this.playlistMusic[index];
    }

    setPlaylistInfo(info: CloudPlaylist | null) {
        this.playlistInfo = info;
    }
    setPlaylistMusic(startIndex: number, removeItemNum: number = 0, ...value: CloudMusic[]) {
        this.playlistMusic.splice(startIndex, removeItemNum, ...value);
    }
    setCurrentMusic(music: CloudMusic) {
        this.currentMusic = music;
    }

    async replacePlaylistById(id: string) {
        this.state = State.pending;
        const [err, res] = await getCloudMusicListInfo(id);
        if (err) {
            this.state = State.error;
            return message.error('获取播放列表信息失败');
        }
        this.setPlaylistInfo(res.data.data);
        this.setPlaylistMusic(0, this.playlistMusic.length, ...new Array(res.data.data.trackCount));
        this.state = State.done;
    }
}
