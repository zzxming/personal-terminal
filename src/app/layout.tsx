import type { Metadata } from 'next';
import './globals.scss';
import StyledComponentsRegistry from '@/lib/AntdRegistry';

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
                    <ConfigProvider locale={zhCN}>{children} </ConfigProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
