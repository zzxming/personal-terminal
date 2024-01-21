import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

export const withInitLoading = <P extends Object>(
    WrapComponent: React.ComponentType<P>,
    loadFunc: (...args: any[]) => Promise<any>
) => {
    return function (props: P) {
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            loadFunc().finally(() => {
                setIsLoading(false);
            });
        }, []);

        return (
            <>
                {isLoading ? (
                    <Spin
                        indicator={
                            <LoadingOutlined
                                style={{ fontSize: 24 }}
                                spin
                            />
                        }
                    />
                ) : (
                    <WrapComponent {...props} />
                )}
            </>
        );
    };
};
