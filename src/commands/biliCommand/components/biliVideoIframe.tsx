import { createRef, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import css from '../index.module.scss';

interface biliVideoIframeProps {
    bv: string;
}
const BiliVideoIframe = ({ bv }: biliVideoIframeProps) => {
    console.log(bv);
    const iframe = createRef<HTMLIFrameElement>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (iframe.current) {
            iframe.current.onload = () => {
                setLoading(false);
            };
        }
    }, []);

    return (
        <div className={css.video_iframe}>
            {loading ? (
                <LoadingOutlined
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-%50%)',
                    }}
                />
            ) : (
                ''
            )}
            <iframe
                ref={iframe}
                width="700"
                height="500"
                style={{ position: 'relative', backgroundColor: 'rgba(0, 0, 0, .3)' }}
                src={`https://player.bilibili.com/player.html?bvid=${bv}&page=1&as_wide=1&high_quality=1&danmaku=1`}
                scrolling="no"
                frameBorder="no"
                allowFullScreen={true}
            ></iframe>
        </div>
    );
};

export { BiliVideoIframe };
