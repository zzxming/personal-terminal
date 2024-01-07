import { Command, CommandOutputStatus, ConfigData } from '@/interface/interface';
import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const openCommand: Command = {
    name: 'open',
    desc: '打开页面方式',
    params: [
        {
            key: 'type',
            desc: '打开方式',
            required: true,
            legalValue: {
                self: '本页打开',
                blank: '新标签页打开',
            },
        },
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)
        const { _ } = args;

        let config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        localStorageSetItem(LOCALSTORAGECONFIG, { ...config, open: _[0] });

        return {
            constructor: '配置成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { openCommand };
