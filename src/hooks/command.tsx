import React, { useRef, useState } from 'react';
import minimist from 'minimist';
import { commandUseFunc, searchCommand } from '@/commands/index';
import { commandMap } from '@/commands/registerCommand';
import {
    Command,
    CommandActionOutput,
    CommandOutput,
    CommandOutputStatus,
    CommandParamArgs,
    HistoryCommand,
} from '@/interface';
import css from '@/app/index.module.scss';
import { randomID } from '@/utils/tools';
import { SubList } from '@/components/subList';

// setCommandHint 函数中的 commands 类型使用 Command[] 有问题, 导致 commandMap 没法传入, 使用 typeof 获取类型
export interface UseCommandHook {
    commands: CommandOutput[];
    historyCommands: React.MutableRefObject<HistoryCommand[]>;
    historyCommandsIndex: React.MutableRefObject<number>;
    clearCommand: () => void;
    excuteCommand: (command: string, commandHandle: UseCommandHook) => void;
    setCommandHint: (str: string, isCompletion?: boolean, commands?: typeof commandMap) => string;
    pushCommands: (command: CommandActionOutput, isResult: boolean) => void;
    setSubCommandsList: (commandStr: string) => void;
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
    const paramParse = (commands: string[]) => {
        return minimist(commands);
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
            const commandParams: CommandParamArgs = paramParse(commandFragment.slice(1)); // 命令参数
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

    const getSubCommandList = (name: string, commands = commandMap): Command[] | null => {
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            if (command.name === name) return command.subCommands;
            if (command.subCommands.length) {
                const getCommand = getSubCommandList(name, command.subCommands);
                if (getCommand) return getCommand;
            }
        }
        return null;
    };

    const setSubCommandsList = (commandStr: string) => {
        const commandName = commandStr.split(' ').slice(-1)[0];
        if (commandName) {
            const subCommands = getSubCommandList(commandName);
            if (subCommands) {
                pushCommands(
                    {
                        constructor: (
                            <SubList
                                column={6}
                                ItemNums={subCommands.length}
                                renderItem={(i) => subCommands[i].name}
                            ></SubList>
                        ),
                        status: CommandOutputStatus.success,
                    },
                    true
                );
            }
        }
    };

    return {
        commands,
        historyCommands,
        historyCommandsIndex,
        clearCommand,
        excuteCommand,
        setCommandHint,
        pushCommands,
        setSubCommandsList,
    };
};

export default useCommand;
