import React, { useState } from 'react';
import { Badge, Button, TimePicker, Form, Input, Popconfirm, Switch, Table, Typography, message } from 'antd';
import { localStorageGetItem, localStorageSetItem } from '@/utils/localStorage';
import { LogData } from '@/interface/interface';
import dayjs, { Dayjs } from 'dayjs';
import css from '../index.module.scss';
import { LOCALSTORAGELOG } from '@/assets/js/const';

interface Item {
    key: string;
    date: Dayjs;
    content: string;
    status: boolean;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    title: string;
    dataIndex: string;
    record: Item;
    inputType: 'text' | 'date' | 'switch';
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
    const inputNode = {
        date: <TimePicker allowClear={false} />,
        text: <Input />,
        switch: (
            <Switch
                checkedChildren="完成"
                unCheckedChildren="待做"
            />
        ),
    };
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
                    {inputNode[inputType]}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

interface LogExpandTableProps {
    datakey: string;
    index: number;
}

const dayjsFormatStr = 'HH:mm:ss';
const getLogTableData = (datakey: string) => {
    const logData = localStorageGetItem(LOCALSTORAGELOG) as LogData;
    return logData[datakey]
        .sort((a, b) => new Date(`${datakey} ${a.date}`).valueOf() - new Date(`${datakey} ${b.date}`).valueOf())
        .map((detail) => ({
            key: detail.key,
            date: dayjs(`${datakey} ${detail.date}`, 'YYYY-MM-DD HH:mm:ss'),
            content: detail.content,
            status: detail.status,
        }));
};
const LogExpandTable = ({ datakey, index }: LogExpandTableProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [data, setData] = useState(getLogTableData(datakey));
    const [editingKey, setEditingKey] = useState('');

    const updateLocalstorage = (item: Item | null, index: number = data.length) => {
        if (!item) {
            const result = { ...(localStorageGetItem(LOCALSTORAGELOG) as LogData) };
            const value = result[datakey];
            value.splice(index, 1);
            localStorageSetItem(LOCALSTORAGELOG, result);
            return;
        }

        let itemDate = item.date;
        while (data.find((item) => item.date.isSame(itemDate))) {
            itemDate.add(1, 'second');
        }
        if (itemDate.format('YYYY-MM-DD') !== datakey) {
            messageApi.open({
                type: 'error',
                content: '今天没有剩余时间了',
            });
            return;
        }
        const resultDate = itemDate.format(dayjsFormatStr);
        const newVal = { ...item, date: resultDate, key: resultDate };
        // 更新本地存储
        const result = { ...(localStorageGetItem(LOCALSTORAGELOG) as LogData) };
        const value = result[datakey];
        value.splice(index, 1, newVal);
        localStorageSetItem(LOCALSTORAGELOG, result);
    };

    const isEditing = (record: Item) => record.key === editingKey;

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
            const newVal = {
                ...item,
                ...row,
            };
            // 更新本地存储
            updateLocalstorage(newVal, index);
            // 更新组件数据
            setData(getLogTableData(datakey));
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const deleteRow = (record: Item) => {
        const index = data.findIndex((item) => record.key === item.key);
        updateLocalstorage(null, index);
        setData(getLogTableData(datakey));
    };

    const addRow = () => {
        const newDate = (data[data.length - 1]?.date || dayjs(datakey).subtract(1, 'second')).add(1, 'second');
        updateLocalstorage({
            key: newDate.format(dayjsFormatStr),
            date: newDate,
            content: '日志内容',
            status: false,
        });
        // 更新本地存储
        setData(getLogTableData(datakey));
    };

    const columns = [
        {
            title: '日期',
            dataIndex: 'date',
            editable: true,
            inputType: 'date',
            render: (_: any, record: Item) => (
                <Typography.Text>{dayjs(record.date).format('HH:mm:ss')}</Typography.Text>
            ),
        },
        {
            title: '内容',
            dataIndex: 'content',
            editable: true,
            inputType: 'text',
        },
        {
            title: '状态',
            dataIndex: 'status',
            editable: true,
            inputType: 'switch',
            render: (_: any, record: Item) => (
                <Badge
                    status={record.status ? 'success' : 'warning'}
                    text={record.status ? '完成' : '待做'}
                />
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
            {contextHolder}
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

export { LogExpandTable };
