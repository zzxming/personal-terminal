import { LOCALSTORAGEMARK } from '@/assets/js/const';
import { Command, CommandOutputStatus, MarkData, openType } from '@/interface/interface';
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
        const keyword = _.join(' ');
        const { data: marks } = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
        // console.log(marks)
        let findMark = marks.find((mark) => mark.title === keyword);

        if (findMark) {
            toNewPage(findMark.url, self ? openType.self : undefined);
            return {
                constructor: '打开成功',
                status: CommandOutputStatus.success,
            };
        }

        toNewPage(`https://${keyword}`, self ? openType.self : undefined);
        return {
            constructor: '打开成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { gotoCommand };
