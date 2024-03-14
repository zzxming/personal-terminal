import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useAudio = () => {
    const [audio] = useState(document.createElement('audio'));
    const [isPause, setIsPause] = useState(true);
    const [canPlay, setCanPlay] = useState(false);

    useEffect(() => {
        audio.addEventListener('pause', () => {
            setIsPause(audio.paused);
        });
        audio.addEventListener('emptied', () => {
            setCanPlay(false);
        });
        audio.addEventListener('canPlay', () => {
            setCanPlay(true);
        });
        audio.addEventListener('error', (event) => {
            message.error(`音频错误：${event.message}`);
        });
        audio.addEventListener('abort', () => {
            message.error(`音频资源加载中断`);
        });
    }, []);
    const setAudio = (src: string, { autoPlay = true } = {}) => {
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
        setAudio,
    };
};
