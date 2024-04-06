import { useEffect, useState } from 'react';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP } from '@/assets/js/const';
import { ConfigData } from '@/interface';
import { localStorageGetItem } from '@/utils/localStorage';

const useBackground = () => {
    const [imgurl, setImgurl] = useState<string>('');

    useEffect(() => {
        // 要监听到localstorage的变化

        function updateBg() {
            const { bgurl } = localStorageGetItem<ConfigData>(LOCALSTORAGECONFIG);
            setImgurl(bgurl);
        }
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], updateBg);

        updateBg();
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], updateBg);
        };
    }, []);

    return {
        imgurl,
    };
};

export default useBackground;
