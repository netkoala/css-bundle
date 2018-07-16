'use strict'
const path = require('path')
const webpack = require('webpack')
const config = require('../config/Base')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var miniCssSetting = {
    css: [
        'vue-style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader'
    ]
}

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    //基礎目錄，絕對路徑，用於從配置中解析入口起點(entry point)和 loader
    context: path.resolve(__dirname, '../'),
    entry: {//入口點
        Common: [ 'vue' ,'vue-router', 'jquery'],
        Custom: [
            path.resolve(__dirname, '../src/assets/js/helper.js'), 
            path.resolve(__dirname, '../src/assets/js/plugins.js')
        ],
        // PluginCss: [
        //     path.resolve(__dirname, '../src/assets/js/jquery-fancybox/jquery-fancybox-min.css'),
        //     path.resolve(__dirname, '../src/assets/js/jquery-qtip/jquery-qtip-min.css'),
        // ],
        Index: ["babel-polyfill", path.resolve(__dirname, '../src/Index.js') ] //指定要編譯的檔案位置
    },
    output: {
        path: config.build.assetsRoot, // 儲存圖片與JS檔案的目錄
        // filename: 'Content/js/[name].bundle.js',// [name] 會依據上面 entry 的屬性名稱變動,指定編譯後結果檔案位置
        filename: config.build.assetsSubDirectory + '/js/[name].bundle.js',
        // Lazy Loading 
        chunkFilename: config.build.assetsSubDirectory + '/js/[name].chunk.js',
        // webpack 使用 require() 時參考的路徑，例如圖片的路徑
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue'], //require() 時不需要加入副檔名
        alias: {
            'vue': 'vue/dist/vue.js',//指定 vue 對應使用的真實 js 檔案
            'pages': resolve('src/components'),
            'assets': resolve('src/assets')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: process.env.NODE_ENV === 'production' ? miniCssSetting : {}
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    useRelativePath: false,
                    outputPath: (process.env.NODE_ENV === 'production'
                        ? config.build.assetsSubDirectory
                        : config.dev.assetsSubDirectory) + '/images',
                    emitFile: false,
                    name: '[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        //程式中遇到特定字元且沒被定義時會自動載入特定模組
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        })
    ]
}
