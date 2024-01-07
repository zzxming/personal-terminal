import { createRef, useEffect, useState } from "react"
import { LoadingOutlined } from '@ant-design/icons'

interface BiliVideoIframeProps {
    bv: string
}
const BiliVideoIframe: React.FC<BiliVideoIframeProps> = (props) => {

    const iframe = createRef<HTMLIFrameElement>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (iframe.current) {
            iframe.current.onload = () => {
                setLoading(false)
            }
        }
    }, [])

    return (
        <div style={{display: 'inline-block', position: 'relative'}}>
            {
                loading ? <LoadingOutlined style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-%50%)',
                        
                }} /> : ''
            }
            <iframe 
                ref={iframe}
                width="700" 
                height="500" 
                style={{position:'relative', backgroundColor: 'rgba(0, 0, 0, .3)'}}
                src={`https://player.bilibili.com/player.html?bvid=${props.bv}&page=1&as_wide=1&high_quality=1&danmaku=1`}
                scrolling="no" frameBorder="no" allowFullScreen={true}
            >
                
            </iframe>
            {/* <iframe 
                src="//player.bilibili.com/player.html?aid=472638029&high_quality=1&as_wide=1&bvid=BV17T411c7wz&page=1&danmaku=0" 
                scrolling="no" 
                frameBorder="no" 
                width="60%"
                height="400"
                allowFullScreen={true}
                sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
            >
            </iframe> */}
        </div>
    )
}

export {
    BiliVideoIframe
}


