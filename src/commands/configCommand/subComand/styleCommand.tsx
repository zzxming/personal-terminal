import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { Command, CommandOutputStatus, ConfigData } from '@/interface/interface';
import { localStorageSetItem, localStorageGetItem } from '@/utils/localStorage';

const styleCommand: Command = {
    name: 'style',
    desc: '基础样式',
    params: [],
    options: [
        {
            key: 'color',
            alias: 'cor',
            desc: '颜色十六进制值',
            valueNeeded: true,
        },
        {
            key: 'backgroundcolor',
            alias: 'bgcor',
            desc: '背景颜色十六进制值',
            valueNeeded: true,
        },
        {
            key: 'clear',
            alias: 'c',
            desc: '清除样式',
            valueNeeded: false,
        },
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args);
        const { _ } = args;

        const config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        let style: ConfigData['style'] = {
            ...config.style,
        };
        if (args.c) {
            style = {};
        }

        args.bgcor && (style.backgroundColor = String(args.bgcor));
        args.cor && (style.color = String(args.cor));
        localStorageSetItem(LOCALSTORAGECONFIG, { ...config, style });

        return {
            constructor: '配置成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { styleCommand };
