import serve from 'rollup-plugin-serve-favicon'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'
import vars from 'postcss-simple-vars'
import preset from 'postcss-preset-env'
import path from 'path'

import babelConfig from './config/babel.config'

const {getHtmlSrc} = require('./src/utils')

let _config = []

let srcArr = getHtmlSrc()

if (srcArr && srcArr.length > 0) {
  for (let i = 0; i < srcArr.length; i++) {
    if(i === 0 ){
      _config.push({
        input: srcArr[i].src,
        options: {
          noConflict: true,
          name: 'FooBar'
        },
        output: {
          file: path.resolve('./.wakeup',srcArr[i].src),
          format: 'umd',
          sourcemap: true,
          name:srcArr[i].name
        },
        plugins: [
          postcss({
            plugins: [
              vars(),
              preset(),
              autoprefixer({browsers: ['> 0.001%', 'not ie < 9'],}),
            ],
          }),
          babel(babelConfig),
          resolve(),
          commonjs({
            include: './**'
          }),
          serve({
            contentBase:'./.wakeup',
            favicon:path.resolve(__dirname,'./favicon.ico')
          }),
          livereload({
            watch: './.wakeup'
          })
        ]
      })
    }else{
      _config.push({
        input: srcArr[i].src,
        output: {
          file: path.resolve('./.wakeup',srcArr[i].src),
          format: 'umd',
          sourcemap: true,
          name:srcArr[i].name
        },
        plugins: [
          postcss({
            plugins: [
              vars(),
              preset(),
              autoprefixer({browsers: ['> 0.001%', 'not ie < 9'],}),
            ],
          }),
          babel(babelConfig),
          resolve(),
          commonjs({
            include: './**'
          })
        ]
      })
    }
  }
}


export default _config