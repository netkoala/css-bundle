"use strict";
const path = require('path');
const config = require('../config/Base')
const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(baseConfig, {
    mode: 'production',
    module: {
        rules:[
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            minimize: { minifyFontValues: false /*CSSNano Options */ }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            minimize: { minifyFontValues: false /*CSSNano Options */ }
                        }
                    },
                    'sass-loader' // compiles Sass to CSS
                ]
            }
        ]
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: { minifyFontValues: false /*CSSNano Options */ },
            }),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            })
        ],
        runtimeChunk: false,
        splitChunks: { 
            cacheGroups: {
                Common: {
                    chunks: 'all',
                    name: "Common",
                    test: /[\\/]node_modules[\\/]/
                },
                // PluginCss: {
                //     name: 'PluginCss',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     minChunks: 2,
                //     // reuseExistingChunk: true,
                //     enforce: true,
                // },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
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
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '..')
        }),
        new webpack.DefinePlugin({
            'process.env': require('../config/Prod.env')
        }),
        new CopyWebpackPlugin([
            {
                from: './src/assets/images',
                to: config.build.assetsSubDirectory + '/images',
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: './static/js',
                to: config.build.assetsSubDirectory + '/js'
            }
        ]),
        new HtmlWebpackPlugin({
            filename: 'Index.html',
            template: 'Index.html',
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: config.build.assetsSubDirectory + '/css/[name].css'
        })
    ]
});
