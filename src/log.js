const clear = require('cli-clear')
const {version} = require('../package.json')
const {timetrans} = require('./utils')
require('colors')
var ll = console.log

module.exports = {
  START: ()=> {
    clear()
    ll(('wakeup v' + version).bold)
  },
  BUNDLE_START: (data)=> {
    ll(timetrans(Date.now()).grey.bold+(' start build -> ').green.bold+data.input+"".gray)
  },
  BUNDLE_END: (data)=> {
    ll(timetrans(Date.now()).grey.bold+(' end build -> ').green.bold+data.input+"".gray)
  },
  END: ()=> {
  },
  FATAL: (data)=> {
    clear()
    ll('This is an error that the organization program continues to run.'.red.bold)
    ll(data.error.message.red)
    ll(data.error.codeFrame)
  },
  ERROR: (data)=> {
    ll(data.error.message.red)
    ll(data.error.codeFrame)
  },
  RESTART:()=>{
    ll('Configuration changes, require restart'.yellow.bold)
  }
}


