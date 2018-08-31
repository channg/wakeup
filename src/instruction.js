const watch = require('./watch.js')
const build = require('./build.js')


module.exports = {
  rollWatch: rollWatch,
  rollBuild:rollBuild
}



function rollWatch() {
  watch()
}

function rollBuild() {
  build()
}