import { Command, CommandOutputStatus, LogData } from '@/interface/interface';
import { LogTable } from './components/logTable';

// 日期,内容.根据日期分类.
const logCommand: Command = {
    name: 'log',
    desc: '个人日志',
    params: [],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args);

        return {
            constructor: <LogTable />,
            status: CommandOutputStatus.success,
        };
    },
};

const initValLocalStorageLog = (): LogData => {
    return {};
};

export { logCommand, initValLocalStorageLog };
