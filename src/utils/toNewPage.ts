import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { ConfigData, openType } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from './localStorage';

/**
 * 打开或跳转至路径
 * @param url 跳转路径
 * @param type 指定打开方式
 */
const toNewPage = (url: string, type?: openType) => {
    const config = localStorageGetItem<ConfigData>(LOCALSTORAGECONFIG);
    let open = config?.open;
    if (type) {
        open = type;
    }

    if (open === openType.self) {
        window.location.href = url;
    } else if (open === openType.blank) {
        window.open(url);
    } else {
        window.open(url);
        localStorageSetItem(LOCALSTORAGECONFIG, { ...config, open: openType.blank });
    }
};

export { toNewPage };
