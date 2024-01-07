import { getURLDomain } from '..';
import { LOCALSTORAGEMARK } from '@/assets/js/const';
import { Command, CommandOutputStatus, MarkData } from '@/interface/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const modifyMark: Command = {
    name: 'modify',
    desc: '修改书签',
    params: [
        {
            key: 'name',
            desc: '书签名称',
            required: true,
        },
    ],
    options: [
        {
            key: 'name',
            alias: 'n',
            desc: '修改后的书签名',
            valueNeeded: true,
        },
        {
            key: 'url',
            alias: 'u',
            desc: '修改后的书签网址',
            valueNeeded: true,
        },
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        const { _ } = args;
        const name = args.name?.toString();
        const url = args.url?.toString();

        const namekey = _.join(' ');
        const { data: marks } = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
        // console.log(marks)
        let markIndex = marks.findIndex((mark) => mark.key === namekey);
        if (markIndex === -1) {
            return {
                constructor: '书签不存在',
                status: CommandOutputStatus.error,
            };
        }
        // 可以使用命令执行(先删除合并数据后再添加), 但会导致command历史记录污染, 所以还是手动
        let originMark = marks[markIndex];
        let markUrl: string = url;
        let iconUrl: string;
        if (url) {
            if (!(markUrl as string).startsWith('http://') && !(markUrl as string).startsWith('https://')) {
                markUrl = `https://${markUrl}`;
            }
            iconUrl = `https://${getURLDomain(markUrl)}/favicon.ico`;
        } else {
            markUrl = originMark.url;
            iconUrl = originMark.icon;
        }

        marks.splice(markIndex, 1, {
            ...originMark,
            key: name ?? namekey,
            title: name ?? namekey,
            url: markUrl,
            icon: iconUrl,
        });

        localStorageSetItem(LOCALSTORAGEMARK, { data: [...marks] });

        return {
            constructor: '修改成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { modifyMark };
