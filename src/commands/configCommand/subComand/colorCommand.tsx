import { Command, CommandOutputStatus, ConfigData } from '@/interface/interface';
import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const colorCommand: Command = {
    name: 'color',
    desc: '打开页面方式',
    params: [
        {
            key: 'color',
            desc: '颜色十六进制值',
            required: true,
        },
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)
        const { _ } = args;

        let config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        let style = { ...config.style, color: _.join(' ') };
        // console.log( { ...config, style })

        localStorageSetItem(LOCALSTORAGECONFIG, { ...config, style });

        return {
            constructor: '配置成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { colorCommand };
