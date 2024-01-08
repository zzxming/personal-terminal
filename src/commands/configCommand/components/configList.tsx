import { LOCALSTORAGECONFIG } from '@/assets/js/const';
import { CommandResultListOutput } from '@/components/commandListOutput';
import { ConfigData } from '@/interface/interface';
import { localStorageGetItem } from '@/utils/localStorage';
import css from '../index.module.css';

const ConfigList = () => {
    let config = localStorageGetItem(LOCALSTORAGECONFIG) as ConfigData;
    let configList = (Object.keys(config) as (keyof ConfigData)[]).map((key) => {
        return {
            key,
            value: config[key],
        };
    });
    return (
        <CommandResultListOutput<(typeof configList)[0]>
            data={configList}
            render={(item, index) => {
                let { key, value } = item;
                let valueDom: typeof value | React.ReactElement;
                // style是以对象存储的
                if (typeof value === 'object') {
                    let data = Object.keys(value).map((key) => ({
                        key,
                        value: (value as { [key: string]: string })[key],
                    }));
                    valueDom = (
                        <CommandResultListOutput<(typeof data)[0]>
                            data={data}
                            render={(item) => (
                                <li>
                                    <span>
                                        {item.key} - {item.value}
                                    </span>
                                </li>
                            )}
                        />
                    );
                } else {
                    valueDom = value;
                }
                return (
                    <li className={css.config_list_item}>
                        <span className={`${css.config_list_item_value} ${css.key}`}>{key}</span>-
                        <span className={`${css.config_list_item_value} ${css.value}`}>{valueDom}</span>
                    </li>
                );
            }}
        />
    );
};

export { ConfigList };
