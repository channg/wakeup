#!/usr/bin/env node
const version = require('../package.json').version
const program = require('commander')
require('colors')
const path = require('path')

const fs = require('fs')
const fse = require('fs-extra')
const _static = require('../src/static')
const {compile, dolivereload} = require('../src/utils')
const {rollWatch, rollBuild} = require('../src/instruction')

program
  .version(version);

program
  .command('watch')
  .alias('w')
  .description('watch the program')
  .option("-i, --index [value]","Modify entry HTML")
  .option("-b, --base [value]","base path")
  .action((options) => {
    let dirname = "."
    if(options&&options.index&&options.index!==true){
      if(options.index.substr(-5)!=='.html')
        dirname = options.index+='.html'
      _static.localIndex = path.basename(options.index)
    }
    process.chdir(path.dirname(dirname))
    ensureCachePath()
    ensureIndex().then(() => {
      compile()
      rollWatch()
      dolivereload()
    }).catch((err)=>{
      if(err.errno===111){
        console.log(("error:not find the "+_static.localIndex).red)
      }else{
        console.log(err.message.red)
      }
    })
  })

program
  .command('build')
  .alias('b')
  .description('build the program')
  .option("-i, --index [value]","Modify entry HTML")
  .action((options) => {
    
    let dirname = "."
    if(options&&options.index&&options.index!==true){
      if(options.index.substr(-5)!=='.html')
        dirname = options.index+='.html'
        _static.localIndex = path.basename(options.index)
    }
    process.chdir(path.dirname(dirname))
    ensureCachePath()
    ensureIndex().then(() => {
      compile(true)
      rollBuild()
    }).catch((err)=>{
      if(err.errno===111){
        console.log(("error:not find the "+_static.localIndex).red)
      }else{
        console.log(err.message.red)
      }
    })
  })

program.parse(process.argv);

function ensureCachePath() {
  fse.removeSync(_static.cachePath)
  fse.removeSync(_static.buildPath)
}

function ensureIndex() {
  let exists = fs.existsSync(_static.localIndex)
  if (exists) {
    return Promise.resolve()
  } else {
    return Promise.reject({errno:111})
  }
}




