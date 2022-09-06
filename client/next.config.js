module.exports = {
    compiler: {
        emotion: {
            autoLabel: 'never',
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    swcMinify: true,
    trailingSlash: true,
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === 'development',
    },
}