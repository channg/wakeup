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
const typescript = require('rollup-plugin-typescript2')
const fs = require('fs')
const importcwd = require('import-cwd')
const vueSrc = require('../plugin/vueSrc')


let scriptWatcher, stylesheetWatcher, htmlWatcher

let restartLog = false
/**
 * save _static object
 */
let saveStatic

module.exports = gwatch

function gwatch(restart) {
  if (saveStatic) {
    contRestart(saveStatic, _static)
  } else {
    saveStatic = Object.assign({}, _static)
  }
  let saveConfig = summary()
  let srcArr = _static.srcArr
  //script
  if (srcArr && srcArr.length > 0) {
    srcArr.forEach((item) => {
      let inputOptions = {}
      let outputOptions = {}
      inputOptions.input = item.src
      inputOptions.treeshake = false
      inputOptions.plugins = [
        vueSrc(),
        _static['ts'] ? typescript(typescriptOptions({
          tsconfigDefaults: {
            compilerOptions: {
              sourceMap: true
            }
          },
          cacheRoot: path.resolve(_static.cachePath, './.rts2_cache'),
          typescript: importcwd('typescript')
        })) : {},
        json(),
        vue(),
        postcss({
          sourceMap: true,
          to: path.resolve(_static.cachePath, item.output),
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
      outputOptions.file = path.resolve(_static.cachePath, item.output)
      outputOptions.format = item.format
      outputOptions.sourcemap = true
      outputOptions.name = item.name
      const watchOptions = {...inputOptions, output: [outputOptions]}
      scriptWatcher = watch(watchOptions)
      
      scriptWatcher.on('event', event => {
        if (event.code === 'START') {
          log.START()
          if (restartLog) {
            log.RESTART()
          }
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
          to: path.resolve('./.wakeup', fn),
          plugins: [
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
      stylesheetWatcher = watch(watchOptions)
      stylesheetWatcher.on('event', event => {
        if (event.code === 'START') {
          log.START()
          if (restartLog) {
            log.RESTART()
          }
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
  if (_static.localIndex.substr(-4) === 'html' && !restart) {
    let inputOptions = {}
    let outputOptions = {}
    inputOptions.input = _static.localIndex
    inputOptions.treeshake = false
    inputOptions.plugins = [
      html(),
      serve({
        index: _static.localIndex,
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
    htmlWatcher = watch(watchOptions)
    htmlWatcher.on('event', event => {
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
        if (saveConfig !== nowConfig) {
          reWatch()
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

/**
 * use process.cwd() tsconfig
 */
function typescriptOptions(options) {
  let currentTsConfig = path.resolve(process.cwd(), _static['ts-config'])
  if (fs.existsSync(currentTsConfig)) {
    options.tsconfig = currentTsConfig
  }
  return options
}

function reWatch() {
  scriptWatcher && scriptWatcher.close()
  stylesheetWatcher && stylesheetWatcher.close()
  gwatch(true)
}

function contRestart(n, w) {
  if (n['port'] !== w['port'] || n['live-reload'] !== w['live-reload'] || n['live-reload-port'] !== w['live-reload-port'] || n['live-reload-port'] !== w['live-reload-port'] || n['open-browser'] !== w['open-browser']) {
    restartLog = true
  }
}