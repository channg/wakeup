#!/usr/bin/env node
const version = require('../package.json').version
const program = require('commander')

const fs = require('fs')
const fse = require('fs-extra')
const _static = require('../src/static')


const {rollWatch} = require('../src/instruction')
program
  .version(version);

program
  .command('watch')
  .alias('w')
  .description('watch the program')
  .action(() => {
    ensureCachePath()
    ensureIndex().then(() => {
      rollWatch()
    })
  });


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
    return Promise.reject()
  }
}




