
/** mark命令在localstorage中存储的key */
export const LOCALSTORAGEMARK = 'mark';

/** bg命令在localstorage中存储的key */
export const LOCALSTORAGEBGURL = 'bgurl';

/** config命令在localstorage中存储的key */
export const LOCALSTORAGECONFIG = 'config';

/** 改变在localstorage中存储值时触发的事件 */
export const LOCALSTORAGEEVENTMAP: { [key: string]: string } = {
    [LOCALSTORAGEMARK]: 'markEvent',
    [LOCALSTORAGEBGURL]: 'bgurlEvent',
    [LOCALSTORAGECONFIG]: 'configEvent',
}