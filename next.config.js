/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname,
    },
};
module.exports = nextConfig;
