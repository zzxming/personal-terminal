import { Command, CommandOutputStatus } from '@/interface/interface';
import { BiliVideoList } from '../components/biliVideoList';

const result_type = [
    'tips',
    'esports',
    'activity',
    'web_game',
    'card',
    'media_bangumi',
    'media_ft',
    'bili_user',
    'user',
    'star',
    'video',
];

const searchCommand: Command = {
    name: 'search',
    desc: 'b站搜索',
    params: [
        {
            key: 'keyword',
            desc: '关键词',
            required: true,
        },
    ],
    options: [
        {
            key: 'type',
            alias: 't',
            desc: '搜索类型',
            defaultValue: 'video',
            valueNeeded: true,
            legalValue: {
                video: '视频',
                // bili_user: '用户'
            },
        },
    ],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)
        let { _, type, bv } = args;
        if (!result_type.includes(type as string)) {
            return {
                constructor: 'option type error',
                status: CommandOutputStatus.error,
            };
        }

        const keywords = _.join(' ');
        if (type instanceof Array) {
            type = type[0];
        }

        const playVideo = (bv: string) => {
            commandHandle.excuteCommand(`bili ${bv}`, commandHandle);
        };
        return {
            constructor: (
                <BiliVideoList
                    keywords={keywords}
                    type={String(type)}
                    playVideo={playVideo}
                />
            ),
            status: CommandOutputStatus.success,
        };
    },
};

export { searchCommand };
