import { getNeteaseMusic, getNeteaseMusicList } from '@/assets/api';
import { Command, CommandOutputStatus } from '@/interface';
import { MusicRequestType } from '../types';
import { MusicSearchListItem } from '@/commands/musicCommand/components/musicSearchListItem';

export const musicSearchCommand: Command = {
    name: 'search',
    desc: '在网易云音乐搜索',
    params: [
        {
            key: 'name',
            desc: '获取关键词',
            required: true,
        },
    ],
    options: [
        {
            key: 'type',
            alias: 't',
            desc: '获取类型',
            defaultValue: 2,
            valueNeeded: true,
            legalValue: {
                0: '歌单',
                2: '歌曲',
            },
        },
        // {
        //     key: 'id',
        //     alias: 'i',
        //     desc: '是否使用id获取',
        //     defaultValue: 'off',
        //     valueNeeded: false,
        // },
    ],
    subCommands: [],
    async action(args, commandHandle) {
        // console.log(args);
        let { _ } = args;
        const type = Number(args.type) as MusicRequestType;
        const keywords = _.join(' ');
        // 0请求歌单,2请求歌曲
        const musicRequestOption = {
            [MusicRequestType.Playlist]: { func: getNeteaseMusicList },
            [MusicRequestType.Song]: { func: getNeteaseMusic },
        };
        const getTypeOption = musicRequestOption[type];
        const [err, result] = await getTypeOption.func(keywords);
        if (err) {
            return {
                constructor: err.response?.data?.message || err.response?.statusText || err.message,
                status: CommandOutputStatus.error,
            };
        }
        if (result.data.code !== 0) {
            return {
                constructor: '网络错误',
                status: CommandOutputStatus.error,
            };
        }
        const data = result.data.data;
        if (data.length < 1) {
            return {
                constructor: 'Not Found',
                status: CommandOutputStatus.error,
            };
        }

        const construct = (
            <MusicSearchListItem
                type={type}
                data={data}
            />
        );
        return {
            constructor: construct || '类型错误',
            status: construct ? CommandOutputStatus.success : CommandOutputStatus.error,
        };

        // const url = `https://music.163.com/outchain/player?type=${type}&id=${urlid}&auto=1&height=${
        //     getTypeOption.height - 20
        // }`;
        // return {
        //     constructor: (
        //         <iframe
        //             frameBorder="no"
        //             marginWidth={0}
        //             marginHeight={0}
        //             width="330"
        //             height={getTypeOption.height}
        //             src={url}
        //             title={`${keywords}`}
        //         ></iframe>
        //     ),
        //     status: CommandOutputStatus.success,
        // };
    },
};
