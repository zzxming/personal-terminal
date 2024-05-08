'use client';
import { LOCALSTORAGEMUSIC } from '@/assets/js';
import { MusicConfig } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils';
import { message } from 'antd';
import { action, makeObservable, observable } from 'mobx';
import { PlaylistStore } from './playlistStore';

export class AudioStore {
    audio?: HTMLAudioElement;
    canPlay: boolean;
    isPause: boolean;
    volume: number = 0.8;
    playlistStore: PlaylistStore;
    constructor(playlistStore: PlaylistStore) {
        this.playlistStore = playlistStore;
        this.canPlay = false;
        this.isPause = true;
        if (typeof window !== 'undefined') {
            this.audio = new Audio();
            this.volume = 0.75;
            this.audioInit();
        }
        makeObservable(this, {
            playlistStore: false,
            audio: false,
            canPlay: observable,
            isPause: observable,
            volume: observable,
            setAudioSrc: action,
            changeVolume: action,
            play: action,
            pause: action,
        });
    }

    onEnded = () => {
        console.log('onEnded');
        if (this.playlistStore.currentMusic) {
            this.playlistStore.nextMusic();
            this.setAudioSrc(
                `/api/music/${this.playlistStore.currentMusic.id}?fee=${this.playlistStore.currentMusic.fee}`
            );
        }
    };
    onPlay = () => {
        this.isPause = this.audio!.paused;
        console.log('play');
    };
    onPause = () => {
        this.isPause = this.audio!.paused;
        console.log('pause');
    };
    onEmptied = () => {
        this.canPlay = false;
        console.log('onEmptied');
    };
    onCanPlay = () => {
        this.canPlay = true;
        console.log('onCanPlay');
    };
    onError = (e: Event) => {
        console.log(e);
        message.error(`音频错误`);
    };
    onAbort = () => {
        message.error(`音频资源加载中断`);
    };
    onVolumeChange = () => {
        this.volume = this.audio!.volume;
    };
    onLoadedMetaData = () => {
        console.log('onloadedmetadata');
    };
    onWaiting = () => {
        console.log('onWaiting');
    };
    onPlaying = () => {
        console.log('onPlaying');
    };
    onSuspend = () => {
        console.log('onSuspend');
    };
    audioInit() {
        if (!this.audio) return;
        this.audio.volume = this.volume;
        this.audio.addEventListener('onloadedmetadata', this.onLoadedMetaData);
        this.audio.addEventListener('volumechange', this.onVolumeChange);
        this.audio.addEventListener('play', this.onPlay);
        this.audio.addEventListener('pause', this.onPause);
        this.audio.addEventListener('emptied', this.onEmptied);
        this.audio.addEventListener('canplay', this.onCanPlay);
        this.audio.addEventListener('error', this.onError);
        this.audio.addEventListener('abort', this.onAbort);
        this.audio.addEventListener('ended', this.onEnded);
        this.audio.addEventListener('waiting', this.onWaiting);
        this.audio.addEventListener('playing', this.onPlaying);
        this.audio.addEventListener('suspend', this.onSuspend);
    }

    loadCurMusic() {
        if (!this.playlistStore.currentMusic) return;
        this.setAudioSrc(`/api/music/${this.playlistStore.currentMusic.id}?fee=${this.playlistStore.currentMusic.fee}`);
    }

    setAudioSrc(src: string, { autoPlay = true } = {}) {
        this.audio!.pause();
        this.audio!.src = src;
        this.canPlay = false;
        this.audio!.load();
        autoPlay && this.audio!.play();
    }
    play() {
        if (!this.canPlay) return;
        this.audio!.play();
    }
    pause() {
        this.audio!.pause();
    }
    changeVolume(value: number) {
        let volumeNum = Math.floor(value) / 100;
        volumeNum < 0 ? 0 : volumeNum > 1 ? 1 : volumeNum;
        this.audio!.volume = volumeNum;
        localStorageSetItem(LOCALSTORAGEMUSIC, {
            ...localStorageGetItem(LOCALSTORAGEMUSIC),
            volume: volumeNum,
        });
    }
}
