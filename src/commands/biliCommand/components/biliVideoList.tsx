import { getBiliSearchTypeResult } from '@/assets/api';
import { BiliTypeVideo } from '@/interface';
import { List } from 'antd';
import { useEffect, useState } from 'react';
import css from '../index.module.scss';
import { useErrorBoundary } from 'react-error-boundary';
import { BiliVideoItem } from './biliVideoItem';

interface BiliVideoListProps {
    keywords: string;
    type: string;
    playVideo: (bv: string) => void;
}

const BiliVideoList = ({ keywords, type, playVideo }: BiliVideoListProps) => {
    const { showBoundary } = useErrorBoundary();
    const [data, setData] = useState<BiliTypeVideo[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalData, setTotalData] = useState(0);

    const getVideoList = async (page: number = 1, pageSize: number = 40) => {
        setLoading(true);
        const [err, res] = await getBiliSearchTypeResult({
            keywords,
            search_type: type,
            page,
            pageSize,
        });
        setLoading(false);
        if (err) {
            throw showBoundary(new Error(err.response?.data.message || err.message));
        }
        setData(res.data.data.result);
        setTotalData(res.data.data.numResults);
    };
    useEffect(() => {
        getVideoList();
    }, []);

    return (
        <div className={css.list}>
            <List
                grid={{
                    gutter: 16,
                    xs: 2,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 5,
                    xxl: 6,
                }}
                loading={loading}
                pagination={{
                    pageSize: 40,
                    total: totalData,
                    showSizeChanger: false,
                    onChange: getVideoList,
                }}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <BiliVideoItem
                            info={item}
                            playVideo={playVideo}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export { BiliVideoList };
