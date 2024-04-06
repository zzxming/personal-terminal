import { Command, CommandOutputStatus } from '@/interface';
import { BiliVideoIframe } from './components/biliVideoIframe';
import { searchCommand } from './subCommand/searchCommand';

const biliCommand: Command = {
    name: 'bili',
    desc: 'b站视频功能',
    params: [
        {
            key: 'bvid',
            desc: '播放的视频bv号',
            required: true,
        },
    ],
    options: [],
    subCommands: [searchCommand],
    action(args, commandHandle) {
        // console.log(args);
        let { _ } = args;

        return {
            constructor: <BiliVideoIframe bv={String(_[0])} />,
            status: CommandOutputStatus.success,
        };
    },
};

export { biliCommand };
