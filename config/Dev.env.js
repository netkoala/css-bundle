'use strict'

const merge = require('webpack-merge')
const baseEnv = require('./Base.env')

module.exports = merge(baseEnv, {
    NODE_ENV: '"development"'
});
