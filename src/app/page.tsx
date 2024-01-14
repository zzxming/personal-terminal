'use client';
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { throttle } from 'lodash-es';
import useBackground from '@/hooks/background';
import useCommand from '@/hooks/command';
import { MarkNav } from '@/commands/markCommand/components/markNav';
import { TimeCount } from '@/commands/timeCommand/components/timeCount';
import { LOCALSTORAGECONFIG, LOCALSTORAGEEVENTMAP } from '@/assets/js/const';
import { localStorageGetItem } from '@/utils/localStorage';
import { CommandOutputStatus, ConfigData } from '@/interface/interface';
import css from './index.module.scss';
import { ErrorBoundary } from 'react-error-boundary';

const Terminal: React.FC = () => {
    const { imgurl } = useBackground();
    const commandHandle = useCommand();
    const { commands, historyCommands, historyCommandsIndex, setCommandHint, excuteCommand } = commandHandle;
    const [hintTxt, setHintTxt] = useState('');
    const view = useRef<HTMLDivElement>(null);
    const inp = useRef<HTMLInputElement>(null);
    const [configStyle, setConfigStyle] = useState<React.CSSProperties>({});

    // localstorage中config初始化及更新处理函数
    const configChange = () => {
        const { style } = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        setConfigStyle(style ? style : {});
    };

    // localstorage更新
    useEffect(() => {
        configChange();

        window.addEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], configChange);
        return () => {
            window.removeEventListener(LOCALSTORAGEEVENTMAP[LOCALSTORAGECONFIG], configChange);
        };
    }, []);

    // 保持输入会在屏幕内,最下方
    useLayoutEffect(() => {
        scrollScream();
    });

    // 更新一定要在父组件, 不如不能引起app的render, 导致不能从hook中获取最新的commands
    function commit() {
        excuteCommand(inp.current?.value.trim() || '', commandHandle, view.current as HTMLElement);
        inp.current && (inp.current.value = '');
        setHintTxt('');
        scrollScream();
    }
    // 输入框聚焦
    function focusInput(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        inp.current?.focus();
    }
    /** 保持输入框在视口内 */
    function scrollScream() {
        view.current && (view.current.scrollTop = view.current?.scrollHeight);
    }

    /**
     * 历史命令
     * @param {*} isBack 是否向上浏览历史命令
     */
    function rollBackCommand(isBack: boolean) {
        let updatedIndex = historyCommandsIndex.current + (isBack ? -1 : 1);

        // 防止越界
        if (updatedIndex < 0) {
            updatedIndex = 0;
        }
        if (updatedIndex > historyCommands.current.length - 1) {
            // 到最后一次输入, 超出则变成输入状态
            updatedIndex = historyCommands.current.length;
            inp.current && (inp.current.value = '');
            return;
        }

        historyCommandsIndex.current = updatedIndex;
        const txt = historyCommands.current[updatedIndex]?.txt;
        if (!txt) return;

        inp.current && (inp.current.value = txt);
        inp.current && inp.current.setSelectionRange(inp.current.value.length, inp.current.value.length);
    }

    function keydownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
        // console.log(e);
        const keyCode = e.key;
        // 当输入法存在时按回车key值为'Process, keyCode值为229, 普通回车key值为'Enter', keyCode为13'
        switch (keyCode) {
            case 'Enter': {
                commit();
                break;
            }
            case 'ArrowUp': {
                // 取消默认效果,不进行此操作会导致光标在input最前面
                e.preventDefault();
                rollBackCommand(true);
                break;
            }
            case 'ArrowDown': {
                rollBackCommand(false);
                break;
            }
            case 'Backspace': {
                throttleKeyPressEvnet();
                break;
            }
            case 'Tab': {
                e.preventDefault();
                completeCommandInput();
                break;
            }
            default: {
                break;
            }
        }
    }
    /** 根据输入字显示提示文字 */
    function keyPressEvent() {
        // console.log(inp.current)
        if (inp.current) {
            let commandStr = inp.current.value;
            // console.log(commandStr)
            let getCommand = setCommandHint(commandStr);
            // console.log(getCommand)
            setHintTxt(getCommand as any);
        }
    }
    const throttleKeyPressEvnet = throttle(keyPressEvent, 1000);
    /** 命令输入补全 */
    function completeCommandInput() {
        if (inp.current) {
            let inpStr = inp.current.value;
            let completeCommandName = setCommandHint(inpStr, true);
            // 如果返回补全命令比输入命令短, 代表输入有参数, 不需要补全
            if (completeCommandName.length > inpStr.length) {
                inp.current.value = completeCommandName;
            }
        }
    }

    return (
        <>
            <div
                className={css.terminal}
                onClick={focusInput}
                style={{ backgroundImage: `url(${imgurl})` }}
            >
                <div
                    className={css.terminal_mask}
                    onClick={focusInput}
                    style={configStyle}
                >
                    <MarkNav />
                    <TimeCount />
                    <div
                        ref={view}
                        className={css.terminal_command}
                    >
                        {commands.map((item) => (
                            <ErrorBoundary
                                key={item.key}
                                fallbackRender={({ error }) => (
                                    <div className={css.command_result}>
                                        <span className={`${css.command_result_status} ${css.error}`}>error</span>
                                        <div>{error.message}</div>
                                    </div>
                                )}
                            >
                                <div className={css.command_result}>
                                    {item.isResult ? (
                                        item.status !== CommandOutputStatus.success ? (
                                            <span className={`${css.command_result_status} ${css[item.status]}`}>
                                                {item.status}
                                            </span>
                                        ) : (
                                            ''
                                        )
                                    ) : (
                                        <span className={css.terminal_user}>[local]:</span>
                                    )}
                                    {item.construct}
                                </div>
                            </ErrorBoundary>
                        ))}
                        <div className={css.terminal_input}>
                            <span className={css.terminal_user}>[local]:</span>
                            {/* 多行输入 */}
                            <input
                                ref={inp}
                                className={css.command_input}
                                onKeyDown={keydownEvent}
                                onChange={throttleKeyPressEvnet}
                            />
                        </div>
                        {hintTxt ? <div className={css.terminal_hint}>hint: {hintTxt}</div> : ''}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Terminal;
