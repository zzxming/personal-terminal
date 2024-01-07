import { Command, CommandOutputStatus } from '@/interface/interface';
import { randomID } from '@/utils/tools';
import { GetLogTable } from './logCommandOutput';

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
            constructor: <GetLogTable key={`log result ${randomID()}`} />,
            status: CommandOutputStatus.success,
        };
    },
};

export { logCommand };
