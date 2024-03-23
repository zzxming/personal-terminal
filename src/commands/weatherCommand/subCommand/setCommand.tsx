import { getAdcode } from '@/assets/api/weather';
import { LOCALSTORAGWEATHER } from '@/assets/js/const';
import { Command, CommandOutputStatus } from '@/interface';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';

const SetCommand: Command = {
    name: 'set',
    desc: '设置天气',
    params: [
        {
            key: 'keyword',
            desc: '省份/城市/区县名称',
            required: true,
        },
    ],
    options: [],
    subCommands: [],
    async action(args, commandHandle) {
        // console.log(args);
        const { _ } = args;

        commandHandle.pushCommands(
            {
                constructor: '等待加载...',
                status: CommandOutputStatus.warn,
            },
            true
        );
        const [err, res] = await getAdcode(_.join(' '));
        if (err) {
            return {
                status: CommandOutputStatus.error,
                constructor: `城市设置失败, error ${
                    err.response ? `${err.response.data.data.infocode} ${err.response.data.data.info}` : err.message
                }`,
            };
        }

        localStorageSetItem(LOCALSTORAGWEATHER, {
            ...localStorageGetItem(LOCALSTORAGWEATHER),
            city: res.data.data.address,
            adcode: res.data.data.adcode,
        });
        return {
            status: CommandOutputStatus.success,
            constructor: `城市设置成功：${res.data.data.address}`,
        };
    },
};

export { SetCommand };
