import { LOCALSTORAGEPLAYLIST } from '@/assets/js/const';
import { Command, CommandOutputStatus } from '@/interface';
import { localStorageSetItem } from '@/utils';

const setPlaylistCommand: Command = {
    name: 'playlist',
    desc: '设置歌单',
    params: [
        {
            key: 'id',
            desc: '歌单id',
            required: true,
        },
    ],
    options: [],
    subCommands: [],
    async action(args, commandHandle) {
        const { _ } = args;
        localStorageSetItem(LOCALSTORAGEPLAYLIST, { id: _[0] });
        return {
            constructor: `设置歌单：${_[0]}`,
            status: CommandOutputStatus.success,
        };
    },
};

export { setPlaylistCommand };
