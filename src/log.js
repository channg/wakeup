const clear = require('cli-clear')
const {version} = require('../package.json')
const {timetrans} = require('./utils')
const _static = require('./static')
require('colors')
var ll = console.log

module.exports = {
  START: ()=> {
    clear()
    ll(('wakeup v' + version).bold)
  },
  BUNDLE_START: (data)=> {
    ll(timetrans(Date.now()).gray.bold+(' start build -> ').green.bold+data.input+"")
  },
  BUNDLE_END: (data)=> {
    ll(timetrans(Date.now()).gray.bold+(' end build -> ').green.bold+data.input+"")
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
    ll('port||host||open-browser||live-reload||live-reload-port changes, require restart'.yellow.bold)
  },
  SERVE:()=>{
    let s = ' http://'+_static['host']+':'+_static['port']
    ll(timetrans(Date.now()).gray.bold+s)
  }
}


