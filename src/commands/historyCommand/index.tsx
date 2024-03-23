import { Command, CommandOutputStatus } from '@/interface';
import { HistoryList } from './components/historyList';

const historyCommand: Command = {
    name: 'history',
    desc: '查看历史命令',
    params: [
        {
            key: 'num',
            desc: '显示历史条数',
            required: false,
        },
    ],
    options: [],
    subCommands: [],
    async action(args, commandHandle) {
        // console.log(args);
        const { _ } = args;

        const num = Number(_[0] || 0);
        if (isNaN(num) || num < 0) {
            return {
                constructor: '请输入合法数字参数',
                status: CommandOutputStatus.error,
            };
        }
        const { historyCommands } = commandHandle;
        const sortHistoryCommands = [...historyCommands.current].reverse();
        const showHistoryCommands = num === 0 ? sortHistoryCommands : sortHistoryCommands.slice(0, num);
        showHistoryCommands.reverse();
        return {
            constructor: <HistoryList data={showHistoryCommands} />,
            status: CommandOutputStatus.success,
        };
    },
};

export { historyCommand };
