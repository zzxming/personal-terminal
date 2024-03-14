import Icon from '@ant-design/icons';
import css from '../index.module.scss';
import Music from '@/assets/svg/music.svg';
import Play from '@/assets/svg/play.svg';
import Pause from '@/assets/svg/pause.svg';
import ArrowLeft from '@/assets/svg/arrow-left.svg';
import ArrowRight from '@/assets/svg/arrow-right.svg';
import { useState } from 'react';
import { List } from 'antd';
import { useAudio } from '@/hooks';

export const MusicPlaylist = () => {
    const [isActive, setIsActive] = useState(false);
    const data =
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi nostrum recusandae blanditiis aspernatur ad architecto aliquid, inventore, deserunt atque sit magni asperiores aliquam ipsum nam hic earum labore dolorum mollitia!'.split(
            ' '
        );
    const activeItem = 1;

    const { audio, isPause, play, pause, setAudio } = useAudio();

    return (
        <div className={css['playlist']}>
            <Icon
                className={css['playlist_icon']}
                onClick={() => setIsActive((val) => !val)}
                component={Music}
            ></Icon>
            <div className={[css['playlist_popover'], isActive ? css['active'] : css['hide']].join(' ')}>
                <div className={css['playlist_music']}>
                    <div className={css['playlist_music_info']}>
                        <h3 className={css['playlist_music-title']}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis culpa aspernatur nobis tenetur
                            odit minima. Neque ratione sunt recusandae provident aperiam quod repellendus voluptas fuga
                            accusantium, excepturi aut ducimus sapiente.
                        </h3>
                        <p className={css['playlist_music-detail']}>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel id facilis nesciunt quod eos
                            porro tempora nemo eius laborum error officia ducimus architecto nisi, sit iste iure
                            inventore eaque? Maxime.
                        </p>
                    </div>
                </div>
                <div className={css['playlist_music_control']}>
                    <Icon
                        className={css['playlist_icon']}
                        component={ArrowLeft}
                    ></Icon>
                    <Icon
                        className={css['playlist_icon']}
                        onClick={() => (isPause ? play() : pause())}
                        component={isPause ? Play : Pause}
                    ></Icon>
                    <Icon
                        className={css['playlist_icon']}
                        component={ArrowRight}
                    ></Icon>
                </div>
                <List
                    className={css['playlist_list']}
                    dataSource={data}
                    renderItem={(item, i) => (
                        <div className={[css['playlist_list_item'], activeItem === i ? css['active'] : ''].join(' ')}>
                            <span className={css['playlist_list_item-count']}>{i + 1}</span>
                            <div className={css['playlist_list_item_detail']}>
                                <p className={css['playlist_list_item-title']}>{item}</p>
                                <p className={css['playlist_list_item-author']}>{item}</p>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
