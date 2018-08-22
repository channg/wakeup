import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'
import vars from 'postcss-simple-vars'
import preset from 'postcss-preset-env'
import path from 'path'
export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'umd',
    name:'some'
  },
  plugins: [
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
    serve(),
    livereload()
  ]
}
