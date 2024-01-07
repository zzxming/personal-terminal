import { CommandResultListOutput } from '@/components/commandListOutput';
import { Command, CommandOutputStatus, HistoryCommand } from '@/interface/interface';
import { randomID } from '@/utils/tools';

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
        // console.log(args)
        const { _ } = args;
        const num = Number(_.join(' '));
        if (isNaN(num) || num < 0) {
            return {
                constructor: '请输入合法数字参数',
                status: CommandOutputStatus.error,
            };
        }
        const { historyCommands } = commandHandle;
        const sortHistoryCommands = [...historyCommands].reverse();
        const showHistoryCommands = num === 0 ? sortHistoryCommands : sortHistoryCommands.slice(0, num);
        showHistoryCommands.reverse();

        // console.log(sortHistoryCommands)

        return {
            constructor: (
                <CommandResultListOutput<HistoryCommand>
                    key={`history result ${randomID()}`}
                    data={showHistoryCommands}
                    render={(item, index) => (
                        <li>
                            {index + 1} {item.txt}
                        </li>
                    )}
                />
            ),
            status: CommandOutputStatus.success,
        };
    },
};

export { historyCommand };
