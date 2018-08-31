const {watch,rollup} = require('rollup')
const json = require('rollup-plugin-json')
const postcss = require('rollup-plugin-postcss-fix')
const preset = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')
const babel = require('rollup-plugin-babel')
const babelConfig = require('../config/babel.config')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
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
/**
 * save _static object
 */

module.exports = gbuild

async function gbuild(restart) {
  let srcArr = _static.srcArr
  //script
  if (srcArr && srcArr.length > 0) {
    srcArr.forEach(async (item) => {
      let inputOptions = {}
      let outputOptions = {}
      inputOptions.input = item.src
      inputOptions.treeshake = true
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
      const bundle = await rollup(inputOptions);
      log.BUILD({input: item.output});
      await bundle.write(outputOptions);
    })
  }
  //stylesheet
  let hrefArr = _static.hrefArr
  if (hrefArr && hrefArr.length > 0) {
    hrefArr.forEach(async (item) => {
      let fn = item.href.substr(-4) === '.css' ? item.href : item.href + '.css'
      let inputOptions = {}
      let outputOptions = {}
      inputOptions.input = item.href
      inputOptions.treeshake = true
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
      outputOptions.file = path.resolve(_static.cachePath, fn)
      outputOptions.format = 'esm' // not use
      const bundle = await rollup(inputOptions);
      log.BUILD({input: item.href});
      await bundle.write(outputOptions);
    })
  }
  if (_static.localIndex.substr(-4) === 'html' && !restart) {
    let inputOptions = {}
    let outputOptions = {}
    inputOptions.input = _static.localIndex
    inputOptions.treeshake = true
    inputOptions.plugins = [
      html()
    ]
    outputOptions.file = path.resolve(_static.cachePath, _static.localIndex)
    outputOptions.format = 'esm' // not use
    const bundle = await rollup(inputOptions);
    log.BUILD({input: _static.localIndex});
    await bundle.write(outputOptions);
  }
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

