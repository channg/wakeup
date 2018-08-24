const path = require('path')
const fse = require('fs-extra')
const isIn = require('is-in-path')
const fs = require('fs')
const cheerio = require('cheerio')
const _static = require('./static')
function getHtmlSrc() {
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

module.exports = {
  getHtmlSrc:getHtmlSrc
}