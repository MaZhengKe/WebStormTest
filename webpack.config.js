const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index/index.js',
        print: './src/index/print.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        openPage: 'index.html',
        port: 4000
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index/index.html",
            title: 'Output Management'
        }),
        new HtmlWebpackPlugin({
            filename: "about.html",
            template: "./src/about/about.html",
            chunks: []
        }),

    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader']
        }]
    }
};