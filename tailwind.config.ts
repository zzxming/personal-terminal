import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                success: '#52c41a',
                warn: '#faad14',
                danger: '#ff4d4f',
            },
            gridTemplateColumns: {
                command_list: '100px minmax(0, 1fr)',
            },
        },
    },
    plugins: [],
};
export default config;
