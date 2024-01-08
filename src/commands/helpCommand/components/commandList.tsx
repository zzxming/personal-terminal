import { commandMap } from '@/commands/registerCommand';
import css from '../index.module.scss';

export const CommandList = () => (
    <div className={css.command_list}>
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
