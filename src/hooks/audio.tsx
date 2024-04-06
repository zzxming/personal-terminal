import { LOCALSTORAGEMUSIC } from '@/assets/js';
import { MusicConfig } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils';
import { message } from 'antd';
import { useEffect, useState } from 'react';

interface AudioOptions {
    onEnd?: () => void;
}
export const useAudio = (options: AudioOptions = {}) => {
    const [audio, setAudio] = useState(document.createElement('audio'));
    const [isPause, setIsPause] = useState(true);
    const [canPlay, setCanPlay] = useState(false);
    const [volume, setVolume] = useState(localStorageGetItem<MusicConfig>(LOCALSTORAGEMUSIC)?.volume ?? 0.8);

    const onEnded = () => {
        options.onEnd && options.onEnd();
    };
    const onPlay = () => {
        setIsPause(audio.paused);
    };
    const onPause = () => {
        setIsPause(audio.paused);
    };
    const onEmptied = () => {
        setCanPlay(false);
    };
    const onCanPlay = () => {
        setCanPlay(true);
    };
    const onError = () => {
        message.error(`音频错误`);
    };
    const onAbort = () => {
        message.error(`音频资源加载中断`);
    };
    const onVolumeChange = () => {
        setVolume(audio.volume);
    };
    const onLoadedMetaData = () => {
        console.log('onloadedmetadata');
    };
    const audioInit = () => {
        audio.addEventListener('onloadedmetadata', onLoadedMetaData);
        audio.addEventListener('volumechange', onVolumeChange);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('emptied', onEmptied);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('error', onError);
        audio.addEventListener('abort', onAbort);
        audio.volume = volume;
    };

    useEffect(() => {
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [options.onEnd]);
    useEffect(() => {
        audioInit();
        document.body.appendChild(audio);
    }, []);

    const setAudioSrc = (src: string, { autoPlay = true } = {}) => {
        audio.pause();
        audio.src = src;
        setCanPlay(false);
        audio.load();
        autoPlay && audio.play();
    };
    const play = () => {
        if (!canPlay) return;
        audio.play();
    };
    const pause = () => {
        audio.pause();
    };
    const changeVolume = (value: number) => {
        let volumeNum = Math.floor(value) / 100;
        volumeNum < 0 ? 0 : volumeNum > 1 ? 1 : volumeNum;
        audio.volume = volumeNum;
        localStorageSetItem(LOCALSTORAGEMUSIC, {
            ...localStorageGetItem(LOCALSTORAGEMUSIC),
            volume: volumeNum,
        });
    };

    return {
        audio,
        isPause,
        volume,
        canPlay,
        play,
        pause,
        setAudioSrc,
        changeVolume,
    };
};
