import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'
import vars from 'postcss-simple-vars'
import preset from 'postcss-preset-env'
import multiEntry from "rollup-plugin-multi-entry"
import path from 'path'
const {getHtmlSrc} = require('./src/utils')

let _config = []

let srcArr = getHtmlSrc()

if (srcArr && srcArr.length > 0) {
  for (let i = 0; i < srcArr.length; i++) {
    if(i === 0 ){
      _config.push({
        input: srcArr[i],
        output: {
          file: path.resolve('./.wakeup',srcArr[i]),
          format: 'umd',
          name: 'some'
        },
        plugins: [
          multiEntry(),
          postcss({
            plugins: [
              vars(),
              preset(),
              autoprefixer({browsers: ['> 0.001%', 'not ie < 9'],}),
            ],
          }),
          resolve(),
          commonjs({
            include: './**'
          }),
          babel({
            exclude: 'node_modules/**'
          }),
          serve({
            contentBase:'./.wakeup'
          }),
          livereload({
            watch: './.wakeup'
          })
        ]
      })
    }else{
      _config.push({
        input: srcArr[i],
        output: {
          file: path.resolve('./.wakeup',srcArr[i]),
          format: 'umd',
          name: 'some'
        },
        plugins: [
          multiEntry(),
          postcss({
            plugins: [
              vars(),
              preset(),
              autoprefixer({browsers: ['> 0.001%', 'not ie < 9'],}),
            ],
          }),
          resolve(),
          commonjs({
            include: './**'
          }),
          babel({
            exclude: 'node_modules/**'
          })
        ]
      })
    }
  }
}


export default _config