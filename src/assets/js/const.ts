/** mark 命令在 localstorage 中存储的 key */
export const LOCALSTORAGEMARK = 'mark';

/** config 命令在 localstorage 中存储的 key */
export const LOCALSTORAGECONFIG = 'config';

/** log 命令在 localstorage 中存储的 key */
export const LOCALSTORAGELOG = 'log';

/** weather 命令在 localstorage 中存储的 key */
export const LOCALSTORAGWEATHER = 'weather';

/** time 命令在 localstorage 中存储的 key */
export const LOCALSTORAGETIME = 'time';

/** 改变在 localstorage 中存储值时触发的事件 */
export const LOCALSTORAGEEVENTMAP: { [key: string]: string } = {
    [LOCALSTORAGEMARK]: 'markEvent',
    [LOCALSTORAGECONFIG]: 'configEvent',
    [LOCALSTORAGELOG]: 'logEvent',
    [LOCALSTORAGWEATHER]: 'weatherEvent',
    [LOCALSTORAGETIME]: 'timeEvent',
};
