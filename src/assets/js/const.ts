/** mark命令在localstorage中存储的key */
export const LOCALSTORAGEMARK = 'mark';

/** config命令在localstorage中存储的key */
export const LOCALSTORAGECONFIG = 'config';

/** log命令在localstorage中存储的key */
export const LOCALSTORAGELOG = 'log';

/** 改变在localstorage中存储值时触发的事件 */
export const LOCALSTORAGEEVENTMAP: { [key: string]: string } = {
    [LOCALSTORAGEMARK]: 'markEvent',
    [LOCALSTORAGECONFIG]: 'configEvent',
    [LOCALSTORAGELOG]: 'logEvent',
};
