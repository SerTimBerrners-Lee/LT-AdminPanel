const path = require('path');
const HtmlWeebpackPlugin = require('html-webpack-plugin')


module.exports = {
    mode: 'development',
    entry: './views/main.js',
    output: {
        path: path.resolve(__dirname, './public/src'),
        filename: 'main.js'
    },
    devServer: {
        host: 'localhost', 
        port: 3000,
        stats: 'errors-only',
        open: true
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: ['pug-loader']
            }
        ]
    },
    plugins: [
        new HtmlWeebpackPlugin({
            template: './views/index.pug',
        })
    ]
}