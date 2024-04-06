import { Command, CommandOutputStatus } from '@/interface';
import { evaluate } from 'mathjs';

const calculatorCommand: Command = {
    name: 'calc',
    desc: '简单的数学计算器',
    params: [
        {
            key: 'expression',
            desc: '表达式',
            required: true,
            legalValueDesc: '三角函数传入默认为弧度值，计算角度值需要计算转换，如计算 tan45°：calc tan(45 * PI / 180)',
            legalValue: () => true,
        },
    ],
    options: [
        {
            key: 'precision',
            alias: 'p',
            desc: `结果的保留小数点位数`,
            valueNeeded: true,
            defaultValue: '2',
            legalValueDesc: '需输入0-8的整数',
            legalValue: (val) => {
                if (isNaN(Number(val)) || !/^\+?[0-9]\d*$/.test(val)) return false;
                return Number(val) >= 0 && Number(val) <= 8;
            },
        },
    ],
    subCommands: [],
    action: (args, commandHandle) => {
        // console.log(args);
        const { _, p } = args;
        const expression = (_ as string[]).join(' ');
        const precision = parseInt(p as string, 10) || 2;

        try {
            const result = evaluate(expression);
            const formattedResult = parseFloat(result.toFixed(precision));

            commandHandle.pushCommands(
                {
                    constructor: `结果: ${formattedResult}`,
                    status: CommandOutputStatus.success,
                },
                true
            );
        } catch (error: any) {
            commandHandle.pushCommands(
                {
                    constructor: `${error.message}`,
                    status: CommandOutputStatus.error,
                },
                true
            );
        }
    },
};

export { calculatorCommand };
