import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP, LOCALSTORAGELOG, LOCALSTORAGEMARK } from '@/assets/js/const';
import { initValLocalStorageConfig } from '@/commands/configCommand';
import { initValLocalStorageLog } from '@/commands/logCommand';
import { initValLocalStorageMark } from '@/commands/markCommand';

// 重写 setItem , 使同页面能够监听到 localstorage 的变化
const localStorageSetItem = (key: string, value: any) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    // 同步背景图片的更新
    let eventName = LOCALSTORAGEEVENTMAP[key];
    if (eventName) {
        let setItem = new Event(eventName);
        localStorage.setItem(key, value);
        window.dispatchEvent(setItem);
        return;
    }
    localStorage.setItem(key, value);
};

const localStorageGetItem = (key: string) => {
    let result = localStorage.getItem(key);
    // 非json格式字符串会报错
    try {
        // 获取值 null 时判断是否需要初始值
        if (result === null) {
            result = localStorageInitValue(key);
        }
        return result ? JSON.parse(result) : null;
    } catch (e) {
        return result;
    }
};
/** localstorage 中需要初始值的 key 和对应初始值生成函数 */
const localStorageInitValueMap: {
    [key: string]: () => any;
} = {
    [LOCALSTORAGEMARK]: initValLocalStorageMark,
    [LOCALSTORAGECONFIG]: initValLocalStorageConfig,
    [LOCALSTORAGELOG]: initValLocalStorageLog,
};
/**
 * 判断 key 是否存在初始值, 赋值并返回对应初始值
 * @param key 在 localstorage 的 key
 * @returns 对应 localstorage 初始值, 或null
 */
const localStorageInitValue = (key: string) => {
    if (localStorageInitValueMap[key]) {
        let initValue = localStorageInitValueMap[key]();
        localStorageSetItem(key, initValue);
        return initValue;
    }
    return null;
};

export { localStorageSetItem, localStorageGetItem };
