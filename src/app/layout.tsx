import type { Metadata } from 'next';
import './globals.scss';
import { StyledComponentsRegistry, AudioStoreRegistry, PlaylisttoreRegistry } from '@/lib';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export const metadata: Metadata = {
    title: 'terminal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html id="app">
            <body>
                <StyledComponentsRegistry>
                    <ConfigProvider locale={zhCN}>
                        <PlaylisttoreRegistry>
                            <AudioStoreRegistry>{children}</AudioStoreRegistry>
                        </PlaylisttoreRegistry>
                    </ConfigProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
