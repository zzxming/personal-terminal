import React, { useRef, useState } from 'react';
import { commandUseFunc, searchCommand } from '@/commands/index';
import { commandMap } from '@/commands/registerCommand';
import {
    Command,
    CommandActionOutput,
    CommandOption,
    CommandOutput,
    CommandOutputStatus,
    CommandParamArgs,
    HistoryCommand,
} from '@/interface/interface';
import css from '@/app/index.module.scss';
import { randomID } from '@/utils/tools';

// setCommandHint 函数中的 commands 类型使用 Command[] 有问题, 导致 commandMap 没法传入, 使用 typeof 获取类型
export interface UseCommandHook {
    commands: CommandOutput[];
    historyCommands: React.MutableRefObject<HistoryCommand[]>;
    historyCommandsIndex: React.MutableRefObject<number>;
    clearCommand: () => void;
    excuteCommand: (command: string, commandHandle: UseCommandHook) => void;
    setCommandHint: (str: string, isCompletion?: boolean, commands?: typeof commandMap) => string;
    pushCommands: (command: CommandActionOutput, isResult: boolean) => void;
}

const useCommand = (): UseCommandHook => {
    // commands内存jsx或者文本命令,history内存string(命令原文本)
    const [commands, setCommands] = useState<CommandOutput[]>([]);
    const historyCommands = useRef<HistoryCommand[]>([]);
    const historyCommandsIndex = useRef(historyCommands.current.length);

    const pushCommands = (command: CommandActionOutput, isResult: boolean) => {
        // 空命令直接输出
        let { constructor, status } = command;
        if (constructor === '') {
            setCommands((cur) => [
                ...cur,
                {
                    construct: <div className={css.command_txt}></div>,
                    isResult,
                    key: randomID(),
                    status: CommandOutputStatus.success,
                },
            ]);
            return;
        }

        const className = typeof constructor === 'string' ? css.command_txt : css.command_iframe;
        setCommands((cur) => [
            ...cur,
            {
                construct: <div className={className}>{constructor}</div>,
                isResult,
                key: randomID(),
                status: status || CommandOutputStatus.success,
            },
        ]);
    };
    /**
     * 新增历史命令
     * @param {*} command 命令字符串
     */
    const pushHistoryCommands = (command: string) => {
        historyCommands.current.push({ txt: command });
        historyCommandsIndex.current = historyCommands.current.length;
    };
    /**
     * 清屏
     */
    const clearCommand = () => {
        setCommands([]);
    };

    /**
     * 解析参数和选项
     * @param command 执行命令
     * @param commands 除命令外的命令字符串数组
     * @param option 命令的 options 选项, 若有则按 option 中的key返回
     * @returns 解析完成后对象, _为输入参数
     */
    const paramParse = (command: Command, commands: string[], option?: CommandOption[]) => {
        const params: CommandParamArgs = {
            _: [],
        };
        // console.log(commands)
        for (let i = 0; i < commands.length; i++) {
            if (commands[i] === '') continue;

            const nowParams = commands[i];
            if (!nowParams.startsWith('-')) {
                params._.push(nowParams);
                continue;
            }

            const commandHasOptions = command.options.reduce((pre, cur) => {
                pre[cur.key] = cur;
                pre[cur.alias] = cur;
                return pre;
            }, {} as { [key: string]: CommandOption });

            const alias = nowParams.slice(1);
            // 传递了option, 根据option判断此参数是否有效
            let commandOption: CommandOption | undefined;
            if (option) {
                commandOption = option.find((item) => item.alias === alias);
                // option参数不存在
                if (!commandOption) {
                    continue;
                }
            }
            // 若没有传递option传递, 或参数不需要值, 直接根据输入参数记录param
            if (
                (commandHasOptions[alias] && !commandHasOptions[alias].valueNeeded) ||
                !commands[i + 1] ||
                commands[i + 1].startsWith('-')
            ) {
                params[alias] = true;
                commandOption && (params[commandOption.key] = true);
            } else {
                // 匹配带空格的参数值
                // 如: mark modify 原来的名字 原来名字第二段 -n 第一段 第二段
                // 保证 -n 获取的参数值是 '第一段 第二段' , _ 匹配的值是 ['原来的名字', '原来名字第二段']
                let count = 1;
                let paramVal: string[] = [];
                do {
                    paramVal.push(commands[i + count]);
                    count += 1;
                } while (commands[i + count] && !commands[i + count].startsWith('-'));
                params[alias] = paramVal.join(' ');
                commandOption && (params[commandOption.key] = paramVal.join(' '));
                // i + count 会越界或得到参数名(-n), 减1, for 结束会加1
                i += count - 1;
            }
        }

        // console.log(commands);
        // console.log(params);
        return params;
    };
    /**
     * 执行字符串命令
     * @param command 命令字符串
     * @param commandHandle command hook
     */
    const excuteCommand = async (command: string, commandHandle: UseCommandHook) => {
        if (command.trim() === '') {
            pushCommands({ constructor: command }, false);
            return;
        }

        const commandFragment = command.split(' ');
        const resultCommand = searchCommand(commandFragment[0]);

        pushCommands({ constructor: command }, false);
        pushHistoryCommands(command);
        let result: CommandActionOutput;
        if (resultCommand) {
            // 子命令检测
            let actionCommand = resultCommand; // 最终执行命令
            const commandParams: CommandParamArgs = paramParse(actionCommand, commandFragment.slice(1)); // 命令参数
            while (actionCommand.subCommands.length > 0) {
                // 若子命令输入正确, 则改变最终执行命令, 并删除参数第一位子命令 name
                // 若输入错误则执行原本命令
                let subCommand = actionCommand.subCommands.find((subCommand) => subCommand.name === commandParams._[0]);
                if (subCommand) {
                    actionCommand = subCommand;
                    commandParams._.splice(0, 1);
                } else {
                    break;
                }
            }
            // 根据执行命令的option中key保存params参数
            const options = actionCommand.options;
            const paramsObj = { ...commandParams };
            for (let option of options) {
                if (paramsObj[option.alias]) {
                    paramsObj[option.key] = paramsObj[option.alias];
                }
            }
            // 确认param的数量正确
            const paramsCount = actionCommand.params.reduce((count, param) => (param.required ? ++count : count), 0);
            if (paramsObj._.length < paramsCount) {
                // param参数必须,但未输入
                pushCommands(
                    {
                        constructor: 'param参数缺少',
                        status: CommandOutputStatus.error,
                    },
                    true
                );
                return;
            }
            // params合法值判断
            for (let i = 0; i < actionCommand.params.length; i++) {
                const item = paramsObj._[i];
                const legalValue = actionCommand.params[i].legalValue;
                if (legalValue) {
                    let valid = true;
                    if (legalValue instanceof Function) {
                        if (!legalValue(item, i)) valid = false;
                    } else {
                        if (!Object.keys(legalValue).includes(item)) valid = false;
                    }

                    if (!valid) {
                        pushCommands(
                            {
                                constructor: `param ${actionCommand.params[i].key} 参数错误`,
                                status: CommandOutputStatus.error,
                            },
                            true
                        );
                        return;
                    }
                }
            }
            // option参数, 赋默认值
            for (let i = 0; i < options.length; i++) {
                const item = options[i];
                const getValue = paramsObj[item.alias];
                // option存在默认值, 输入option值为true或没有输入option值, 赋默认值
                if (item.defaultValue !== undefined && !getValue) {
                    paramsObj[item.alias] = item.defaultValue;
                    paramsObj[item.key] = item.defaultValue;
                }
                // 当存在输入值约束时, 进行判断参数是否合理
                if (item.valueNeeded && item.legalValue && paramsObj[item.alias]) {
                    let valid = true;
                    if (item.legalValue instanceof Function) {
                        if (!item.legalValue(paramsObj[item.alias] as string)) valid = false;
                    } else {
                        if (!Object.keys(item.legalValue).includes(paramsObj[item.alias].toString())) valid = false;
                    }
                    if (!valid) {
                        pushCommands(
                            {
                                constructor: `option ${item.key} 参数错误`,
                                status: CommandOutputStatus.error,
                            },
                            true
                        );
                        return;
                    }
                }
            }
            // 执行
            const commandReturn = await actionCommand.action(paramsObj, commandHandle);
            // 无返回值不记录
            if (!commandReturn) {
                return;
            }
            result = commandReturn;
        } else {
            // 命令不存在
            result = {
                constructor: '命令不存在',
                status: CommandOutputStatus.error,
            };
        }
        pushCommands(result, true);
    };
    /**
     *
     * 显示的提示文字
     * @param str 当前输入命令
     * @param isCompletion 是否为命令补全
     * @param commands 查看命令范围
     * @returns 提示文字
     */
    const setCommandHint = (str: string, isCompletion: boolean = false, commands = commandMap): string => {
        str = str.trim();
        // 空字符返回
        if (str === '') {
            return '';
        }
        let inpArr = str.split(' ');
        // 主命令输入
        let mainCommandInp = inpArr[0];
        let mainCommand = commands.filter((command) => {
            return command.name.startsWith(mainCommandInp);
        })[0];

        if (!mainCommand) {
            return '';
        }
        // 是否存在子命令
        let subCommands = mainCommand.subCommands;
        if (subCommands.length > 0 && inpArr.length > 1) {
            let subHint = setCommandHint(inpArr.slice(1).join(' '), isCompletion, subCommands);
            if (subHint !== '') {
                return isCompletion ? `${mainCommand.name} ${subHint}` : `${mainCommandInp} ${subHint}`;
            }
        }
        return isCompletion ? mainCommand.name : commandUseFunc(mainCommand);
    };

    return {
        commands,
        historyCommands,
        historyCommandsIndex,
        clearCommand,
        excuteCommand,
        setCommandHint,
        pushCommands,
    };
};

export default useCommand;
