module.exports = {
  cachePath: './.wakeup',
  buildPath: './dist',
  localIndex: './index.html',// options in --index
  srcArr: [],
  index: 'html',
  hrefArr: [],
  // use like <wu-opt port="9999"></wu-opt>
  ['host']: 'localhost',
  ['port']: 10001,
  ['res-path']: 'img',
  ['open-browser']: false,
  ['live-reload']: true,
  ['live-reload-port']: 35729,
  ['ts-config']: './tsconfig.json',
  ['ts']: false
}