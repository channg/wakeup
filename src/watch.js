const {watch} = require('rollup');
const json = require('rollup-plugin-json')
const postcss = require('rollup-plugin-postcss-fix')
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
const url = require("postcss-url")
const vue = require('rollup-plugin-vue').default

module.exports = function () {
  
  let saveConfig = summary()
  let srcArr = _static.srcArr
  //script
  if (srcArr && srcArr.length > 0) {
    srcArr.forEach((item, index) => {
      let inputOptions = {}
      let outputOptions = {}
      inputOptions.input = item.src
      inputOptions.treeshake = false
      inputOptions.plugins = [
        vue(),
        json(),
        postcss({
          plugins: [
            url({
              url: 'copy',
              assetsPath: 'img'
            }),
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
  //stylesheet
  let hrefArr = _static.hrefArr
  if (hrefArr && hrefArr.length > 0) {
    hrefArr.forEach((item) => {
      let fn = item.href.substr(-4) === '.css' ? item.href : item.href + '.css'
      let inputOptions = {}
      let outputOptions = {}
      inputOptions.input = item.href
      inputOptions.treeshake = false
      inputOptions.plugins = [
        postcss({
          sourceMap: true,
          extract: true,
          to:path.resolve('./.wakeup', fn),
          plugins:[
            url({
              url: 'copy',
              assetsPath: _static['res-path']
            }),
            preset(),
            autoprefixer({browsers: ['> 0.001%', 'not ie < 9']})
            ]
          })
      ]
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
      html(),
      serve({
        index:_static.localIndex,
        contentBase: _static.cachePath,
        favicon: path.resolve(__dirname, '../favicon.ico'),
        host: _static['host'],
        port: _static['port'],
        open: _static['open-browser']
      })
    ]
    outputOptions.file = path.resolve('./.wakeup', _static.localIndex)
    outputOptions.format = 'esm' // not use
    const watchOptions = {...inputOptions, output: [outputOptions]}
    const watcher = watch(watchOptions)
    watcher.on('event', event => {
      if (event.code === 'START') {
        log.START()
        log.SERVE()
      } else if (event.code === 'BUNDLE_START') {
        log.BUNDLE_START(event)
      } else if (event.code === 'BUNDLE_END') {
        log.BUNDLE_END(event)
      } else if (event.code === 'END') {
        log.END()
        let nowConfig = summary()
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


function summary() {
  return JSON.stringify(_static)
  //return JSON.stringify({srcArr:_static.srcArr,cssArr:_static.hrefArr})
}

