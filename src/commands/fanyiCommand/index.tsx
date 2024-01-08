import { fanyiApi, FanyiRejResult, FanyiResResult } from '@/assets/api/api';
import { Command, CommandOutputStatus } from '@/interface/interface';
import { randomID } from '@/utils/tools';
import { TranslateError } from './components/translateError';
import { lang } from '@/assets/js/translateLanguage';
import { TranslateSuccess } from './components/translatSuccess';

const fanyiCommand: Command = {
    name: 'fanyi',
    desc: '百度翻译',
    params: [
        {
            key: 'keywords',
            desc: '要翻译的内容',
            required: true,
        },
    ],
    options: [
        {
            key: 'from',
            alias: 'f',
            desc: '翻译源语言',
            defaultValue: 'auto',
            valueNeeded: true,
            legalValue: lang,
        },
        {
            key: 'to',
            alias: 't',
            desc: '翻译至目标语言',
            defaultValue: 'auto',
            valueNeeded: true,
            legalValue: lang,
        },
    ],
    subCommands: [],
    async action(args, commandHandle) {
        // console.log(args)
        let { _, to: toArg, from: fromArg } = args as { _: string[]; to: string; from: string };
        const keywords = _.join(' ');

        commandHandle.pushCommands(
            {
                constructor: '等待加载...',
                status: CommandOutputStatus.warn,
            },
            true
        );

        const [err, result] = await fanyiApi({ keywords, to: toArg, from: fromArg });
        if (err) {
            return {
                constructor: err.response?.statusText || err.message,
                status: CommandOutputStatus.error,
            };
        }
        if (result.data.code !== 0) {
            return {
                constructor: '网络错误',
                status: CommandOutputStatus.error,
            };
        }

        const rejData = result.data.data as FanyiRejResult;
        if (rejData.error_code) {
            return {
                constructor: <TranslateError error={rejData} />,
                status: CommandOutputStatus.error,
            };
        } else {
            const resData = result.data.data as FanyiResResult;
            return {
                constructor: <TranslateSuccess {...resData} />,
                status: CommandOutputStatus.success,
            };
        }
    },
};

export { fanyiCommand };
