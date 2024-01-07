import { useCallback, useEffect, useState } from 'react';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP } from '@/assets/js/const';
import { ConfigData } from '@/interface/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const useBackgroundImage = () => {
    const [imgurl, setImgurl] = useState<string>('');

    const setbackgroundImage = useCallback((imgurl: string) => {
        // console.log(imgurl)
        localStorageSetItem(LOCALSTORAGECONFIG, { ...localStorageGetItem(LOCALSTORAGECONFIG), bgurl: imgurl });
        setImgurl(imgurl);
        return '更换成功';
    }, []);

    useEffect(() => {
        // 要监听到localstorage的变化
        setbackgroundImage((localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData).bgurl);

        function updateBg() {
            let { bgurl } = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
            // console.log(bgurl)
            setImgurl(bgurl);
        }
        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], updateBg);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], updateBg);
        };
    }, []);

    return {
        imgurl,
        setbackgroundImage,
    };
};

export default useBackgroundImage;
