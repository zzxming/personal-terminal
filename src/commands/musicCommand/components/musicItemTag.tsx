import Vip from '@/assets/svg/vip.svg';
import { CloudMusic } from '@/interface';
import Icon from '@ant-design/icons';
import css from '../index.module.scss';

interface MusicItemTagProps {
    info: CloudMusic;
}

export const MusicItemTag = ({ info }: MusicItemTagProps) => {
    return (
        <span className={css['music_tag']}>
            {info.fee === 1 ? (
                <Icon
                    className={css['music_tag_item']}
                    component={Vip}
                ></Icon>
            ) : null}
        </span>
    );
};
