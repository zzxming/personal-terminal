import { initValLocalStorageConfig } from '..';
import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { Command, CommandOutputStatus } from '@/interface/interface';
import { localStorageSetItem } from '@/utils/localStorage';

const clearCommand: Command = {
    name: 'clear',
    desc: '重置配置项',
    params: [],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        localStorageSetItem(LOCALSTORAGECONFIG, initValLocalStorageConfig());
        return {
            constructor: '配置项已重置',
            status: CommandOutputStatus.success,
        };
    },
};

export { clearCommand };
