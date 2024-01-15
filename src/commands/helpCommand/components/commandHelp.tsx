import css from '../index.module.scss';
import { commandUseFunc } from '@/commands';
import { Table, TableColumnsType } from 'antd';
import { Command, CommandOption, objectValueType } from '@/interface/interface';

interface LegalValueTable {
    key: string;
    value: string;
}
interface CommandHelpProps {
    command: Command;
}
const CommandHelp = (props: CommandHelpProps) => {
    const { command } = props;
    if (!command) {
        return '命令不存在';
    }

    const { name, desc, params, options, subCommands } = command;

    const legalTable = (legalValue: objectValueType<CommandOption, 'legalValue'>) => {
        if (!legalValue) return '';
        const columns: TableColumnsType<LegalValueTable> = [
            { title: '参数', dataIndex: 'key' },
            { title: '描述', dataIndex: 'value' },
        ];
        const dataSource: LegalValueTable[] = [];

        for (const key in legalValue) {
            dataSource.push({
                key,
                value: legalValue[key],
            });
        }
        return (
            <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                scroll={{ y: 240 }}
            />
        );
    };

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
                                    {legalTable(param.legalValue)}
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
                ) : (
                    ''
                )}
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
                                    -{option.alias},{option.key} {'可选'} {option.desc}{' '}
                                    {option.valueNeeded
                                        ? option.defaultValue
                                            ? `默认值: ${option.defaultValue}`
                                            : ''
                                        : ''}
                                    {legalTable(option.legalValue)}
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

    return (
        <div className={css.command_help}>
            <p className={css.command_list_desc}>命令: {desc}</p>
            <p className={css.command_list_desc}>用法: {commandUseFunc(command)}</p>
            {paramsCreator()}
            {subCommandCreator()}
            {optionCreator()}
        </div>
    );
};

export { CommandHelp };
