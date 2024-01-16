import css from '../index.module.scss';
import { commandUseFunc } from '@/commands';
import { Table, TableColumnsType } from 'antd';
import { Command, CommandOption, CommandParam, objectValueType } from '@/interface/interface';

interface LegalValueTable {
    key: string;
    value: string;
}
interface CommandHelpProps {
    command: Command;
}

const LegalValueCreator = ({
    legalValue,
    legalValueDesc,
}: {
    legalValue?: objectValueType<CommandParam, 'legalValue'> | objectValueType<CommandOption, 'legalValue'>;
    legalValueDesc?: objectValueType<CommandParam, 'legalValueDesc'> | objectValueType<CommandOption, 'legalValueDesc'>;
}) => {
    if (!legalValue) return null;
    const columns: TableColumnsType<LegalValueTable> = [
        { title: '参数', dataIndex: 'key' },
        { title: '描述', dataIndex: 'value' },
    ];
    const dataSource: LegalValueTable[] = [];
    const isFunc = legalValue instanceof Function;
    if (!isFunc) {
        for (const key in legalValue) {
            dataSource.push({
                key,
                value: legalValue[key],
            });
        }
    }
    return (
        <>
            <p>输入值：{legalValueDesc}</p>
            {isFunc ? null : (
                <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ y: 240 }}
                />
            )}
        </>
    );
};

const CommandHelp = (props: CommandHelpProps) => {
    const { command } = props;
    if (!command) {
        return '命令不存在';
    }

    const { name, desc, params, detail, options, subCommands } = command;

    const paramsCreator = () => {
        return (
            <>
                {params.length > 0 ? (
                    <div className={css.command_param}>
                        <p className={css.command_list_desc}>参数: </p>
                        <ul className={css.command_detail}>
                            {params.map((param) => (
                                <li key={param.key}>
                                    {param.key} {param.required ? '必填' : '可选'} {param.desc}
                                    <LegalValueCreator
                                        legalValue={param.legalValue}
                                        legalValueDesc={param.legalValueDesc}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    ''
                )}
            </>
        );
    };

    const subCommandCreator = () => {
        return (
            <>
                {subCommands.length > 0 ? (
                    <div className={css.command_sub_list}>
                        <p className={css.command_list_desc}>子命令: </p>
                        <ul className={css.command_detail}>
                            {subCommands.map((subCommand) => (
                                <li key={`${name} ${subCommand.name}`}>
                                    <div className={css.command_sub}>
                                        <CommandHelp command={subCommand} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </>
        );
    };

    const optionCreator = () => {
        return (
            <>
                {options.length > 0 ? (
                    <div className={css.command_option}>
                        <p className={css.command_list_desc}>选项: </p>
                        <ul className={css.command_detail}>
                            {options.map((option) => (
                                <li key={option.key}>
                                    -{option.alias} / -{option.key} {'可选'} {option.desc}{' '}
                                    {option.valueNeeded
                                        ? option.defaultValue
                                            ? `默认值: ${option.defaultValue}`
                                            : null
                                        : null}
                                    <LegalValueCreator
                                        legalValue={option.legalValue}
                                        legalValueDesc={option.legalValueDesc}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </>
        );
    };

    return (
        <div className={css.command_help}>
            <p className={css.command_list_desc}>命令: {desc}</p>
            {detail ? <p className={css.command_list_desc}>描述: {detail}</p> : null}
            <p className={css.command_list_desc}>用法: {commandUseFunc(command)}</p>
            {paramsCreator()}
            {subCommandCreator()}
            {optionCreator()}
        </div>
    );
};

export { CommandHelp };
