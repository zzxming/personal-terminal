import { LOCALSTORAGEEVENTMAP } from '@/assets/js/const';

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

const localStorageGetItem = <T>(key: string): T => {
    let result = localStorage.getItem(key);
    // 非json格式字符串会报错
    // 获取值 null 时判断是否需要初始值
    if (result === null) {
        return localStorageInitValue<T>(key);
    }
    try {
        return JSON.parse(result) as T;
    } catch {
        return result as T;
    }
};
/** localstorage 中需要初始值的 key 和对应初始值生成函数 */
const localStorageInitValueMap: {
    [key: string]: () => any;
} = {};
/**
 * 判断 key 是否存在初始值, 赋值并返回对应初始值
 * @param key 在 localstorage 的 key
 * @returns 对应 localstorage 初始值, 或null
 */
const localStorageInitValue = <T = any>(key: string) => {
    if (localStorageInitValueMap[key]) {
        const initValue = localStorageInitValueMap[key]() as T;
        localStorageSetItem(key, initValue);
        return initValue;
    }
    throw new Error(`localStorage 初始值函数不存在`);
};

export { localStorageSetItem, localStorageGetItem, localStorageInitValue, localStorageInitValueMap };
