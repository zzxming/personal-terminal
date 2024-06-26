import { Avatar, Card } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { Mark, MarkData } from '@/interface';
import { CommandResultListOutput } from '@/components/commandListOutput';
import css from '../index.module.scss';

export const MarkList = ({ data }: MarkData) => {
    return (
        <CommandResultListOutput<Mark>
            data={data}
            render={(item) => (
                <li className={css.mark_list_item}>
                    <Card
                        className={css['mark_list_item-card']}
                        type="inner"
                        title={
                            <>
                                <Avatar
                                    className={css.mark_icon}
                                    icon={<GlobalOutlined />}
                                    src={item.icon}
                                />
                                <span className={css['mark_list_item-title']}>{item.title}</span>
                            </>
                        }
                    >
                        <span
                            className={css['mark_list_item-title']}
                            title={item.url}
                        >
                            {item.url}
                        </span>
                    </Card>
                </li>
            )}
        />
    );
};
