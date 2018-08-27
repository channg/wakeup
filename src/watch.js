const {rollup,watch} = require('rollup');
const json = require('rollup-plugin-json')
const postcss = require('rollup-plugin-postcss')
const preset = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')
const babel = require('rollup-plugin-babel')
const babelConfig = require('../config/babel.config')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const serve = require('rollup-plugin-serve-favicon')
const livereload = require('rollup-plugin-livereload')
const path = require('path')
const log = require('./log')
const _static = require('./static')


module.exports = function () {
  let srcArr = _static.srcArr
  if (srcArr && srcArr.length > 0) {
    let inputOptions = {}
    let outputOptions = {}
    srcArr.forEach((item, index)=> {
      inputOptions.input = item.src
      inputOptions.treeshake = false
      inputOptions.plugins = [
        json(),
        postcss({
          plugins: [
            preset(),
            autoprefixer({browsers: ['> 0.001%', 'not ie < 9']})
          ]
        }),
        babel(babelConfig),
        resolve(),
        commonjs({
          include: './**'
        })
      ]
      if (index === 0) {
        inputOptions.plugins.push(
          serve({
            contentBase: './.wakeup',
            favicon: path.resolve(__dirname, '../favicon.ico')
          }))
        inputOptions.plugins.push(
          livereload({
            watch: './.wakeup'
          })
        )
      }
      outputOptions.file = path.resolve('./.wakeup', item.src)
      outputOptions.format = 'umd'
      outputOptions.sourcemap = true
      outputOptions.name = item.name
      const watchOptions = {...inputOptions, output: [outputOptions]};
      const watcher = watch(watchOptions);

      watcher.on('event', event => {
        if (event.code === 'START') {
          log.START()
        } else if (event.code === 'BUNDLE_START') {
          log.BUNDLE_START(event)
        } else if (event.code === 'BUNDLE_END') {
          log.BUNDLE_END(event)
        } else if (event.code === 'END') {
          log.END()
        } else if (event.code === 'FATAL') {
          log.FATAL(event)
        } else if (event.code === 'ERROR') {
          log.ERROR(event)
        } else {
          console.log(event)
        }
      });
    })
  }
}


