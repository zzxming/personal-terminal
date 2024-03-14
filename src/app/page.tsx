'use client';
import { useRef, useLayoutEffect, useState, useEffect, ChangeEvent } from 'react';
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
import { WeatherDetail } from '@/commands/weatherCommand/component/weatherDetail';

const Terminal: React.FC = () => {
    const { imgurl } = useBackground();
    const commandHandle = useCommand();
    const { commands, historyCommands, historyCommandsIndex, setCommandHint, excuteCommand } = commandHandle;
    const [hintTxt, setHintTxt] = useState('');
    const view = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [globalConfig, setGlobalConfig] = useState<ConfigData>();

    // localstorage中config初始化及更新处理函数
    const configChange = () => {
        const config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
        setGlobalConfig(config);
    };

    // localstorage更新
    useEffect(() => {
        inputRef.current && Object.assign(inputRef.current.style, calcTextareaHeight(inputRef.current));
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
        excuteCommand(inputRef.current?.value.trim() || '', commandHandle);
        inputRef.current && (inputRef.current.value = '');
        setHintTxt('');
        inputRef.current && Object.assign(inputRef.current.style, calcTextareaHeight(inputRef.current));
        scrollScream();
    }
    // 输入框聚焦
    function focusInput(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        inputRef.current?.focus();
    }
    /** 保持输入框在视口内 */
    function scrollScream() {
        view.current && (view.current.scrollTop = view.current?.scrollHeight);
    }

    /**
     * 历史命令
     * @param {boolean} isBack 是否向上浏览历史命令
     */
    function rollBackCommand(isBack: boolean) {
        if (!inputRef.current) return;
        let updatedIndex = historyCommandsIndex.current + (isBack ? -1 : 1);

        // 防止越界
        if (updatedIndex < 0) {
            updatedIndex = 0;
        }
        if (updatedIndex > historyCommands.current.length - 1) {
            // 到最后一次输入, 超出则变成输入状态
            updatedIndex = historyCommands.current.length;
            inputRef.current.value = '';
            return;
        }

        historyCommandsIndex.current = updatedIndex;
        const txt = historyCommands.current[updatedIndex]?.txt;
        if (!txt) return;

        inputRef.current.value = txt;
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }

    function keydownEvent(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        // console.log(e);
        const keyCode = e.key;
        // 当输入法存在时按回车key值为'Process, keyCode值为229, 普通回车key值为'Enter', keyCode为13'
        switch (keyCode) {
            case 'Enter': {
                e.preventDefault();
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
        // console.log(inputRef.current)
        if (inputRef.current) {
            setHintTxt(setCommandHint(inputRef.current.value));
        }
    }
    const inputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!inputRef.current) return;
        inputRef.current && Object.assign(inputRef.current.style, calcTextareaHeight(inputRef.current));
        throttleKeyPressEvnet();
    };
    const throttleKeyPressEvnet = throttle(keyPressEvent, 1000);
    /** 命令输入补全 */
    function completeCommandInput() {
        if (inputRef.current) {
            const inpStr = inputRef.current.value;
            const completeCommandName = setCommandHint(inpStr, true);
            // 如果返回补全命令比输入命令短, 代表输入有参数, 不需要补全
            if (completeCommandName.length > inpStr.length) {
                inputRef.current.value = completeCommandName;
            }
        }
    }

    const CONTEXT_STYLE = [
        'letter-spacing',
        'line-height',
        'padding-top',
        'padding-bottom',
        'font-family',
        'font-weight',
        'font-size',
        'text-rendering',
        'text-transform',
        'width',
        'text-indent',
        'padding-left',
        'padding-right',
        'border-width',
        'box-sizing',
    ];
    const HIDDEN_STYLE = `
        height:0 !important;
        visibility:hidden !important;
        overflow:hidden !important;
        position:absolute !important;
        z-index:-1000 !important;
        top:0 !important;
        right:0 !important;
    `;
    // /** 计算 textarea 高度 */
    const calcTextareaHeight = (targetElement: HTMLTextAreaElement) => {
        // 获取要计算的 textarea 相关属性
        const style = getComputedStyle(targetElement);
        const boxSizing = style.getPropertyValue('box-sizing');
        const paddingSize =
            Number.parseFloat(style.getPropertyValue('padding-bottom')) +
            Number.parseFloat(style.getPropertyValue('padding-top'));
        const borderSize =
            Number.parseFloat(style.getPropertyValue('border-bottom-width')) +
            Number.parseFloat(style.getPropertyValue('border-top-width'));
        const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(';');
        // 创建一个不可见的 textarea

        const hiddenTextarea = document.createElement('textarea');
        document.body.appendChild(hiddenTextarea);
        // 设置 textarea 的 value 一致
        hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`);
        hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';
        // 获取总高度并计算结果高度, 仅保存了最小一行高
        let height = hiddenTextarea.scrollHeight;
        if (boxSizing === 'border-box') {
            height = height + borderSize;
        } else if (boxSizing === 'content-box') {
            height = height - paddingSize;
        }
        hiddenTextarea.value = '';
        const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
        let minHeight = singleRowHeight * 1;
        if (boxSizing === 'border-box') {
            minHeight = minHeight + paddingSize + borderSize;
        }
        height = Math.max(minHeight, height);
        hiddenTextarea.parentNode?.removeChild(hiddenTextarea);
        return {
            minHeight: `${minHeight}px`,
            height: `${height}px`,
        };
    };
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
                    style={globalConfig?.style}
                >
                    {globalConfig?.mark ? <MarkNav /> : null}
                    {globalConfig?.time ? <TimeCount /> : null}
                    {globalConfig?.weather ? <WeatherDetail /> : null}
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
                            <textarea
                                ref={inputRef}
                                className={css.command_input}
                                onKeyDown={keydownEvent}
                                onChange={inputChange}
                            ></textarea>
                        </div>
                        {hintTxt ? <div className={css.terminal_hint}>hint: {hintTxt}</div> : ''}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Terminal;
