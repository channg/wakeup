const path = require('path')
const fse = require('fs-extra')
const isIn = require('is-in-path')
const fs = require('fs')
const cheerio = require('cheerio')
const _static = require('./static')
function compile() {

  let html = fs.readFileSync(_static.localIndex, 'utf-8')
  getScriptArray(html)
}

function getScriptArray(html) {
  let _arr = []
  let $ = cheerio.load(html)
  $('script').each(function () {
    let _src = $(this).attr('src')
    if(isIn(process.cwd(),_src)) {
      let _wk_name = $(this).attr('wu-name')
      if (fs.existsSync(_src)) {
        let name = path.basename(_src).split('.')[0]
        _arr.push({src:_src,name:_wk_name||name})
      }
      if(_wk_name){
        $(this).removeAttr('wu-name')
      }
    }
  })
  fse.outputFileSync(path.resolve('./.wakeup',_static.localIndex),$.html())
  _static.srcArr = _arr
  
}

function timetrans(date){
  var date = new Date(date);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
  return '['+Y+M+D+h+m+s+']';
}

module.exports = {
  timetrans:timetrans,
  compile:compile
}
