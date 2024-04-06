import { getURLDomain } from '..';
import { LOCALSTORAGEMARK } from '@/assets/js/const';
import { Command, CommandOutputStatus, MarkData } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const addMark: Command = {
    name: 'add',
    desc: '添加书签',
    params: [
        {
            key: 'name',
            desc: '书签名称',
            required: true,
        },
        {
            key: 'url',
            desc: '书签网址',
            required: true,
        },
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args);

        const { _ } = args;

        const paramVal: { [key: string]: string } = {};
        paramVal['url'] = _[_.length - 1];
        paramVal['name'] = _.slice(0, _.length - 1).join(' ');
        // console.log(paramVal)

        const preMark = localStorageGetItem<MarkData>(LOCALSTORAGEMARK);
        if (preMark.data.find((mark) => mark.key === paramVal.name)) {
            return {
                constructor: `书签 ${paramVal.name} 已存在`,
                status: CommandOutputStatus.warn,
            };
        }
        // 获取目标页面的图标
        let url = paramVal.url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }
        const iconUrl = `https://${getURLDomain(url)}/favicon.ico`;
        // console.log(iconUrl)
        const data = [
            ...preMark.data,
            {
                key: paramVal.name,
                title: paramVal.name,
                url,
                icon: iconUrl,
            },
        ];
        localStorageSetItem(LOCALSTORAGEMARK, { ...preMark, data });

        return {
            constructor: '添加成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { addMark };
