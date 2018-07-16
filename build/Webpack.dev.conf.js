"use strict";
const utils = require('./utils')
const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge');
const config = require('../config/Base')
const baseConfig = require('./webpack.base.conf.js');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseConfig, {
    mode: 'development',
    module: {
        rules:[
            {
                test: /\.css$/,
                loader: [
                    {
                        loader: "style-loader"
                    },
                    { 
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            }
        ]
    },
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join('/', 'Index.html') },
            ],
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host, // can be overwritten by process.env.HOST
        port: PORT || config.dev.port, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        open: false,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll
        }
    },
    optimization: { 
        splitChunks: {
            cacheGroups: {
                Common: {
                    chunks: 'all',
                    name: "Common",
                    test: /[\\/]node_modules[\\/]/
                },
                Custom: {
                    chunks: 'all',
                    name: "Custom",
                    test: /[\\/]assets[\\/]js[\\/]\.js$/
                }
            }
        },
        runtimeChunk: {
            name: "manifest"
        },
        
        // webpack4 NamedModulesPlugin->optimization.namedModules(development 默認開啟)
        namedModules: true,
         // webpack4 NoEmitOnErrorsPlugin -> optimization.noEmitOnErrors
        noEmitOnErrors: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/Dev.env')
        }),
        //啟用熱加載 HMR
        new webpack.HotModuleReplacementPlugin(),
        
        new HtmlWebpackPlugin({
            filename: 'Index.html',
            template: 'Index.html',
            inject: true
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: './src/assets/images',
                to: config.dev.assetsSubDirectory + '/images'
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: './static/js',
                to: config.dev.assetsSubDirectory + '/js'
            }
        ])
    ]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})
