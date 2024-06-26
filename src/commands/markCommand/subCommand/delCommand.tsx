import { LOCALSTORAGEMARK } from '@/assets/js/const';
import { Command, CommandOutputStatus, MarkData } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const delMark: Command = {
    name: 'del',
    desc: '删除书签',
    params: [
        {
            key: 'name',
            desc: '书签名称',
            required: true,
        },
    ],
    options: [],
    subCommands: [],
    action(args, commandHandle) {
        // console.log(args)

        const { _ } = args;
        const name = _.join(' ');
        const preMark = localStorageGetItem<MarkData>(LOCALSTORAGEMARK);
        if (preMark && preMark.data) {
            const data = [...preMark.data];
            const i = data.findIndex((mark) => mark.key === name);
            if (i !== -1) {
                data.splice(i, 1);
            }
            localStorageSetItem(LOCALSTORAGEMARK, { ...preMark, data });
        }

        return {
            constructor: '删除成功',
            status: CommandOutputStatus.success,
        };
    },
};

export { delMark };
