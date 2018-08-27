const {rollup, watch} = require('rollup');
const json = require('rollup-plugin-json')
const postcss = require('rollup-plugin-postcss')
const preset = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')
const babel = require('rollup-plugin-babel')
const babelConfig = require('../config/babel.config')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const serve = require('rollup-plugin-serve-favicon')
const path = require('path')
const log = require('./log')
const _static = require('./static')
const html = require('../plugin/ru-html')

module.exports = function () {

  let saveConfig = JSON.stringify({srcArr:_static.srcArr,cssArr:_static.hrefArr})
  let srcArr = _static.srcArr
  //script
  if (srcArr && srcArr.length > 0) {
    srcArr.forEach((item, index) => {
      let inputOptions = {}
      let outputOptions = {}
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
      }
      outputOptions.file = path.resolve('./.wakeup', item.src)
      outputOptions.format = 'umd'
      outputOptions.sourcemap = true
      outputOptions.name = item.name
      const watchOptions = {...inputOptions, output: [outputOptions]}
      const watcher = watch(watchOptions)

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
      })
    })
  }
  let hrefArr = _static.hrefArr
  if (hrefArr && hrefArr.length > 0) {
    hrefArr.forEach((item) => {
      let inputOptions = {}
      let outputOptions = {}
      inputOptions.input = item.href
      inputOptions.treeshake = false
      inputOptions.plugins = [
        postcss({sourceMap: true, extract: true})
      ]
      let fn = item.href.substr(-4) === '.css' ? item.href : item.href + '.css'
      outputOptions.file = path.resolve('./.wakeup', fn)
      outputOptions.format = 'esm' // not use
      const watchOptions = {...inputOptions, output: [outputOptions]}
      const watcher = watch(watchOptions)
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
      })
    })
  }
  if (_static.localIndex.substr(-4) === 'html') {
    let inputOptions = {}
    let outputOptions = {}
    inputOptions.input = _static.localIndex
    inputOptions.treeshake = false
    inputOptions.plugins = [
      html()
    ]
    outputOptions.file = path.resolve('./.wakeup', _static.localIndex)
    outputOptions.format = 'esm' // not use
    const watchOptions = {...inputOptions, output: [outputOptions]}
    const watcher = watch(watchOptions)
    watcher.on('event', event => {
      if (event.code === 'START') {
        log.START()
      } else if (event.code === 'BUNDLE_START') {
        log.BUNDLE_START(event)
      } else if (event.code === 'BUNDLE_END') {
        log.BUNDLE_END(event)
      } else if (event.code === 'END') {
        log.END()
        let nowConfig = JSON.stringify({srcArr:_static.srcArr,cssArr:_static.hrefArr})
        if(saveConfig!==nowConfig){
          log.RESTART()
        }
      } else if (event.code === 'FATAL') {
        log.FATAL(event)
      } else if (event.code === 'ERROR') {
        log.ERROR(event)
      } else {
        console.log(event)
      }
    })
  }
}


