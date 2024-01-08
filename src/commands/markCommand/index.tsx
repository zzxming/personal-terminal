import { LOCALSTORAGECONFIG, LOCALSTORAGEMARK } from '@/assets/js/const';
import { Command, CommandOutputStatus, MarkData } from '@/interface/interface';
import { localStorageSetItem, localStorageGetItem } from '@/utils/localStorage';
import { addMark } from './subCommand/addCommand';
import { delMark } from './subCommand/delCommand';
import { modifyMark } from './subCommand/modifyCommand';
import { MarkList } from './components/markList';

const markCommand: Command = {
    name: 'mark',
    desc: '书签收藏夹',
    params: [
        {
            key: 'subCommand',
            desc: '子命令',
            required: false,
        },
    ],
    options: [
        {
            key: 'show',
            alias: 's',
            desc: '始终显示书签',
            valueNeeded: true,
            legalValue: {
                on: '开启',
                off: '关闭',
            },
        },
        {
            key: 'list',
            alias: 'l',
            desc: '列表形式展示所有书签',
            valueNeeded: false,
        },
    ],
    subCommands: [addMark, delMark, modifyMark],
    action(args, commandHandle) {
        // console.log(args);

        const { _, show, list } = args;
        if (show) {
            localStorageSetItem(LOCALSTORAGECONFIG, {
                ...localStorageGetItem(LOCALSTORAGECONFIG),
                mark: show === 'on' ? true : false,
            });
            return {
                constructor: '配置成功',
                status: CommandOutputStatus.success,
            };
        }
        if (list) {
            const { data } = localStorageGetItem(LOCALSTORAGEMARK) as MarkData;
            return {
                constructor: <MarkList data={data} />,
                status: CommandOutputStatus.success,
            };
        }

        return {
            constructor: '命令语法不正确',
            status: CommandOutputStatus.error,
        };
    },
};

/**
 * 获取网址的域名
 * @param url 网址url
 * @returns
 */
const getURLDomain = (url: string): string => {
    // console.log(url)
    let link = url;

    // 保证网址存在http
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        link = `https://${link}`;
    }
    // 除去http前缀寻找网址完整域名
    if (link.startsWith('http://')) {
        link = link.split('http://')[1];
    } else if (link.startsWith('https://')) {
        link = link.split('https://')[1];
    }
    let i = link.indexOf('/');
    if (i !== -1) {
        link = link.slice(0, i);
    }
    // console.log(link)

    return link;
};

const initValLocalStorageMark = (): MarkData => {
    return {
        data: [],
    };
};

export { markCommand, getURLDomain, initValLocalStorageMark };
