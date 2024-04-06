import { LOCALSTORAGECONFIG, LOCALSTORAGEMARK } from '@/assets/js/const';
import { Command, CommandOutputStatus, ConfigData, MarkData, openType } from '@/interface';
import { localStorageGetItem } from '@/utils/localStorage';
import { toNewPage } from '@/utils/toNewPage';

const gotoCommand: Command = {
    name: 'goto',
    desc: '打开网页',
    params: [
        {
            key: 'url',
            desc: '跳转路径/书签名',
            required: true,
        },
    ],
    options: [
        {
            key: 'self',
            alias: 's',
            desc: '是否当前页面打开',
            valueNeeded: false,
        },
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args);
        const { _, self } = args;

        const keyword = _[0];
        const { open } = localStorageGetItem<ConfigData>(LOCALSTORAGECONFIG);
        const { data: marks } = localStorageGetItem<MarkData>(LOCALSTORAGEMARK);
        const findMark = marks.find((mark) => mark.title === keyword);
        const openUrl = findMark ? findMark.url : `https://${keyword}`;
        toNewPage(openUrl, self ? openType.self : open);
        return {
            constructor: '打开成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { gotoCommand };
