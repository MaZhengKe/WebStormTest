const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        app: './src/js/index.js',
        print: './src/js/print.js',
        testThreejs: './src/js/TestThreeJS.js',
        skybox:'./src/js/Skybox.js',
        fisheye:'./src/js/fisheye.js'
    },

    devtool: 'inline-source-map',

    devServer: {
        static: './dist',
        openPage: 'index.html',
        port: 4000
    },

    plugins: [
        new CopyPlugin({
            patterns: [{
                from: './assets',
                to: "assets",
            }]
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index/index.html",
            title: 'Output Management',
            chunks: ['app', 'print']
        }),
        new HtmlWebpackPlugin({
            filename: "about.html",
            template: "./src/about/about.html",
            chunks: []
        }),
        new HtmlWebpackPlugin({
            filename: "three.html",
            template: "./src/threejs/threejs.html",
            chunks: ['testThreejs']
        }),
        new HtmlWebpackPlugin({
            filename: "skybox.html",
            template: "./src/threejs/threejs.html",
            chunks: ['skybox']
        }),
        new HtmlWebpackPlugin({
            filename: "fisheye.html",
            template: "./src/threejs/Skybox.html",
            chunks: ['fisheye']
        }),

    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
    ,
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(hdr|gltf)$/,
            include: /assets/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }],
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',

                options: {
                    name: '[name].[ext]',
                }
            }]
        }]
    }
}
;