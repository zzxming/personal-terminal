import css from './index.module.scss';
import { commandMap } from '../registerCommand';
import { commandUseFunc } from '..';
import { Table, TableColumnsType } from 'antd';
import { Command, CommandOption, objectValueType } from '@/interface/interface';
import { randomID } from '@/utils/tools';

interface LegalValueTable {
    key: string;
    value: string;
}

const commandList = () => (
    <div
        className={css.command_list}
        key={randomID() + 'help'}
    >
        <p className={css.command_list_desc}>命令列表:</p>
        {
            // 排序
            commandMap
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((item) => {
                    return (
                        <div
                            className={css.command_item}
                            key={item.name}
                        >
                            <div className={css.command_command}>{item.name}</div>
                            <div className={css.command_desc}>{item.desc}</div>
                        </div>
                    );
                })
        }
    </div>
);

const commandDetail = (command: Command) => {
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
                style={{ overflowY: 'auto' }}
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
                                    <div className={css.command_sub}>{commandDetail(subCommand)}</div>
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
        <div
            key={`command help ${name} result ${randomID()}`}
            className={css.command_help}
        >
            <p className={css.command_list_desc}>命令: {desc}</p>
            <p className={css.command_list_desc}>用法: {commandUseFunc(command)}</p>
            {paramsCreator()}
            {subCommandCreator()}
            {optionCreator()}
        </div>
    );
};

export { commandList, commandDetail };
