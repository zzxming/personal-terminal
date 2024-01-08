import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { Command, CommandOutputStatus } from '@/interface/interface';
import { localStorageSetItem, localStorageGetItem } from '@/utils/localStorage';

const clearCommand: Command = {
    name: 'clear',
    desc: '清除背景图片',
    params: [],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        localStorageSetItem(LOCALSTORAGECONFIG, {
            ...localStorageGetItem(LOCALSTORAGECONFIG),
            bgurl: '',
        });
        return {
            constructor: '背景图片已清除',
            status: CommandOutputStatus.success,
        };
    },
};

export { clearCommand };
