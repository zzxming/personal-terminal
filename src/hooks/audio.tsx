import { message } from 'antd';
import { useEffect, useState } from 'react';

interface AudioOptions {
    onEnd?: () => void;
}
export const useAudio = (options: AudioOptions = {}) => {
    const [audio, setAudio] = useState(document.createElement('audio'));
    const [isPause, setIsPause] = useState(true);
    const [canPlay, setCanPlay] = useState(false);

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

    useEffect(() => {
        audio.addEventListener('ended', onEnded);
        console.log('bind');
        return () => {
            audio.removeEventListener('ended', onEnded);
            console.log('unbidne');
        };
    }, [options.onEnd]);
    useEffect(() => {
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('emptied', onEmptied);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('error', onError);
        audio.addEventListener('abort', onAbort);
    }, []);

    const setAudioSrc = (src: string, { autoPlay = true } = {}) => {
        audio.pause();
        audio.src = src;
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

    return {
        audio,
        isPause,
        play,
        pause,
        setAudioSrc,
    };
};
