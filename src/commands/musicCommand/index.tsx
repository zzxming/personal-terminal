import { getNeteaseMusic, getNeteaseMusicList, AxiosResolve, MusicResult, AxiosReject } from '@/assets/api';
import { Command, CommandOutputStatus } from '@/interface/interface';

const musicCommand: Command = {
    name: 'music',
    desc: '网易云音乐',
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
        {
            key: 'id',
            alias: 'i',
            desc: '是否使用id获取',
            defaultValue: 'off',
            valueNeeded: false,
        },
    ],
    subCommands: [],
    async action(args, commandHandle) {
        // console.log(args)
        const { _, type, id } = args;
        const keywords = _.join(' ');

        // 0请求歌单,2请求歌曲
        const musicRequestOption: {
            [key: string]: {
                type: number;
                func: (keywords: any) => Promise<[AxiosReject | null, AxiosResolve<MusicResult[]> | undefined]>;
                height: number;
            };
        } = {
            0: { type: 0, func: getNeteaseMusicList, height: 450 },
            2: { type: 2, func: getNeteaseMusic, height: 110 },
        };
        const getTypeOption = musicRequestOption[type as number];
        let urlid: string | number = keywords;
        // 没有id搜索,正常关键字搜索
        if (id === 'off') {
            const [err, result] = await getTypeOption.func(keywords);
            if (err) {
                // console.log(err)
                return {
                    constructor: err.response?.statusText || err.message,
                    status: CommandOutputStatus.error,
                };
            }
            if (result) {
                if (result.data.code !== 0) {
                    // console.log(result)
                    return {
                        constructor: '网络错误',
                        status: CommandOutputStatus.error,
                    };
                }
                // console.log(result)
                const songs = result.data.data;
                if (songs.length < 1) {
                    return {
                        constructor: 'Not Found',
                        status: CommandOutputStatus.error,
                    };
                }
                urlid = songs[0].id;
            }
        }

        let url = `https://music.163.com/outchain/player?type=${type}&id=${urlid}&auto=1&height=${
            getTypeOption.height - 20
        }`;
        return {
            constructor: (
                <div key={`music result ${url}`}>
                    <iframe
                        frameBorder="no"
                        marginWidth={0}
                        marginHeight={0}
                        width="330"
                        height={getTypeOption.height}
                        src={url}
                        title={`${keywords}`}
                    ></iframe>
                </div>
            ),
            status: CommandOutputStatus.success,
        };
    },
};

export { musicCommand };
