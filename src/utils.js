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
  srcArr.forEach((item)=>{
    if(isIn(process.cwd(),item.src))
      currentPathSrc.push(item)
  })
  return currentPathSrc
}

function getScriptArray(html) {
  let _arr = []
  let $ = cheerio.load(html)
  $('script').each(function () {
    let _src = $(this).attr('src')
    let _wk_name = $(this).attr('wu-name')
    if (fs.existsSync(_src)) {
      let name = path.basename(_src).split('.')[0]
      _arr.push({src:_src,name:_wk_name||name})
    }
  })
  return _arr
}

module.exports = {
  getHtmlSrc:getHtmlSrc
}