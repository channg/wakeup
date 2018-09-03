#!/usr/bin/env node
const version = require('../package.json').version
const program = require('commander')
require('colors')

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
  .action((options) => {
    if(options&&options.index&&options.index!==true){
      if(options.index.substr(-5)!=='.html')
        options.index+='.html'
      _static.localIndex = options.index
    }
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
    if(options&&options.index&&options.index!==true){
      if(options.index.substr(-5)!=='.html')
        options.index+='.html'
      _static.localIndex = options.index
    }
    ensureIndex().then(() => {
      compile()
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
  fse.ensureDirSync(_static.cachePath)
}

function ensureIndex() {
  let exists = fs.existsSync(_static.localIndex)
  if (exists) {
    return Promise.resolve()
  } else {
    return Promise.reject({errno:111})
  }
}




