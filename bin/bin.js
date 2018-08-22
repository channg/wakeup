#!/usr/bin/env node
const version = require('../package.json').version
const program = require('commander')
const cheerio = require('cheerio')
const fs = require('fs')
const fse = require('fs-extra')
const _static = require('../src/static')
const isIn = require('is-in-path')
const path = require('path')
const {rollWatch} = require('../src/utils')
program
  .version(version);

program
  .command('watch')
  .alias('w')
  .description('watch the program')
  .action(() => {
    ensureCachePath()
    ensureIndex().then(() => {
      _static.srcArr = editHtmlreturnSrc()
      rollWatch()()
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

function getScriptArray(html) {
  let _arr = []
  let $ = cheerio.load(html)
  $('script').each(function () {
    let _src = $(this).attr('src')
    if (fs.existsSync(_src)) {
      _arr.push(_src)
    }
  })
  return _arr
}


function editHtmlreturnSrc() {
  fse.copySync(_static.localIndex,path.resolve('./.wakeup',_static.localIndex))
  let currentPathSrc = []
  let html = fs.readFileSync(_static.localIndex, 'utf-8')
  let srcArr = getScriptArray(html)
  srcArr.forEach((src)=>{
    if(isIn(process.cwd(),src))
      currentPathSrc.push(src)
  })
  return currentPathSrc
}

