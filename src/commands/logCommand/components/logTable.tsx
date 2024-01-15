import React, { useState } from 'react';
import { Button, DatePicker, Form, Popconfirm, Table, Typography } from 'antd';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';
import { LogData } from '@/interface/interface';
import dayjs, { Dayjs } from 'dayjs';
import css from '../index.module.scss';
import { LogExpandTable } from './logExpandTable';
import { LOCALSTORAGELOG } from '@/assets/js/const';

interface Item {
    key: string;
    date: Dayjs;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    title: string;
    dataIndex: string;
    record: Item;
    inputType: string;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    inputType,
    title,
    record,
    children,
    ...restProps
}) => {
    const inputNode = <DatePicker allowClear={false} />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `请输入${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const dayjsFormatStr = 'YYYY-MM-DD';
const getLogTableData = () => {
    const logData = localStorageGetItem(LOCALSTORAGELOG) as LogData;
    return Object.keys(logData)
        .sort((a, b) => new Date(a).valueOf() - new Date(b).valueOf())
        .map((date) => ({
            key: date,
            date: dayjs(date, dayjsFormatStr),
        }));
};
const LogTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(getLogTableData());
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: Item) => record.key === editingKey;

    const updateLocalstorage = (key: string | null, newKey: string | null) => {
        // 更新本地存储
        const oldLogData = localStorageGetItem(LOCALSTORAGELOG) as LogData;
        const result = { ...oldLogData };
        key && delete result[key];
        if (newKey) {
            const value = key ? oldLogData[key] : [];
            if (!key) {
                let insertKey = newKey;
                while (result[insertKey]) {
                    insertKey = dayjs(insertKey, dayjsFormatStr).add(1, 'day').format(dayjsFormatStr);
                }
                result[insertKey] = value;
            } else {
                result[newKey] = value;
            }
        }
        localStorageSetItem(LOCALSTORAGELOG, result);
    };

    const edit = (record: Item) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (record: Item) => {
        try {
            const row = (await form.validateFields()) as Item;
            const index = data.findIndex((item) => record.key === item.key);
            const item = data[index];
            // 更新本地存储
            updateLocalstorage(item.key, dayjs(row.date).format(dayjsFormatStr));
            // 更新组件数据
            setData(getLogTableData());
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const deleteRow = (record: Item) => {
        updateLocalstorage(record.key, null);
        setData(getLogTableData());
    };

    const addRow = () => {
        updateLocalstorage(null, dayjs().format(dayjsFormatStr));
        // 更新本地存储
        setData(getLogTableData());
    };

    const columns = [
        {
            title: '日期',
            dataIndex: 'date',
            editable: true,
            inputType: 'date',
            render: (_: any, record: Item) => (
                <Typography.Text>{dayjs(record.date).format(dayjsFormatStr)}</Typography.Text>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 120,
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            className={css['table_operate-text']}
                            onClick={() => save(record)}
                        >
                            保存
                        </Typography.Link>
                        <Popconfirm
                            title="确定取消吗?"
                            onConfirm={cancel}
                        >
                            <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link
                            className={css['table_operate-text']}
                            disabled={editingKey !== ''}
                            onClick={() => edit(record)}
                            style={{ marginRight: 8 }}
                        >
                            编辑
                        </Typography.Link>
                        <Typography.Link
                            className={css['table_operate-text']}
                            onClick={() => deleteRow(record)}
                        >
                            删除
                        </Typography.Link>
                    </span>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                title: col.title,
                dataIndex: col.dataIndex,
                inputType: col.inputType,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Form
                form={form}
                component={false}
            >
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    expandable={{
                        expandedRowRender: (record, index) => (
                            <LogExpandTable
                                datakey={record.key}
                                index={index}
                            />
                        ),
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    pagination={{
                        onChange: cancel,
                    }}
                    title={() => (
                        <Button
                            onClick={addRow}
                            type="primary"
                        >
                            新增
                        </Button>
                    )}
                />
            </Form>
        </div>
    );
};

export { LogTable };
