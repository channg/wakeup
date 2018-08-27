const path = require('path')
const fse = require('fs-extra')
const isIn = require('is-in-path')
const fs = require('fs')
const cheerio = require('cheerio')
const _static = require('./static')
const livereload = require('livereload');

function compile(opt) {
  let html = fs.readFileSync(_static.localIndex, 'utf-8')
  let $ = cheerio.load(html)
  
  compileScript($)
  compileLink($)
  if(opt&&opt.livereload){
    addLivereloadScript($)
  }
  outPutFile($)
}

function compileScript($) {
  let _arr = []
  $('script').each(function () {
    let _src = $(this).attr('src')
    if (_src&&isIn(process.cwd(), _src)) {
      let _wk_name = $(this).attr('wu-name')
      if (fs.existsSync(_src)) {
        let name = path.basename(_src).split('.')[0]
        _arr.push({src: _src, name: _wk_name || name})
      }
      if (_wk_name) {
        $(this).removeAttr('wu-name')
      }
    }
  })
  _static.srcArr = _arr
}

function outPutFile($) {
  fse.outputFileSync(path.resolve('./.wakeup', _static.localIndex), $.html())
}


function compileLink($) {
  const _hrefArr = []
  $('link').each(function () {
    let _href = $(this).attr('href')
    if (_href&&isIn(process.cwd(), _href)&&fs.existsSync(_href)) {
      _hrefArr.push({href:_href})
      $(this).attr('href',_href.substr(-4)==='.css'?_href:_href+'.css')
    }
  })
  _static.hrefArr = _hrefArr
}

function timetrans(date) {
  var date = new Date(date);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return '[' + Y + M + D + h + m + s + ']';
}

function dolivereload() {
  var server = livereload.createServer();
  server.watch("./.wakeup");
  console.log('livereload')
}

function addLivereloadScript($) {
  if(!$('script').attr('wu-livereload')){
    const str = `<script wu-livereload="true">document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +':35729/livereload.js?snipver=1"></' + 'script>')</script>`
    $('body').append(str)
  }
}


module.exports = {
  dolivereload:dolivereload,
  timetrans: timetrans,
  compile: compile
}
