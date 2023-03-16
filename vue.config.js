// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: process.env.API_BASE_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        https: false
    },
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false
}