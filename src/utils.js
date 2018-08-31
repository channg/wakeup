const path = require('path')
const fse = require('fs-extra')
const isIn = require('is-in-path')
const fs = require('fs')
const cheerio = require('cheerio')
const _static = require('./static')
const livereload = require('livereload');

function compile() {
  let html = fs.readFileSync(_static.localIndex, 'utf-8')
  let $ = cheerio.load(html)
  compileOpt($)
  compileScript($)
  compileLink($)
  if (_static['live-reload']) {
    addLivereloadScript($)
  }
  compileImgSrc($)
  $ = compileUrl($)
  outPutFile($)
}

function compileScript($) {
  let _arr = []
  $('script').each(function () {
    let _src = $(this).attr('src')
    if (_src && isIn(process.cwd(), _src)) {
      let _wk_name = $(this).attr('wu-name')
      let _wk_format = $(this).attr('wu-format')
      if (fs.existsSync(_src)) {
        let output = _src
        if (_src && _src.substr(-3) !== '.js') {
          output += '.js'
          $(this).attr('src', output)
        }
        let name = path.basename(_src).split('.')[0]
        _arr.push({src: _src, name: _wk_name || name, output: output,format:_wk_format||'umd'})
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
    if (_href && isIn(process.cwd(), _href) && fs.existsSync(_href)) {
      _hrefArr.push({href: _href})
      $(this).attr('href', _href.substr(-4) === '.css' ? _href : _href + '.css')
    }
  })
  _static.hrefArr = _hrefArr
}

function timetrans(date) {
  var date = new Date(date);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return '[' + Y + M + D + h + m + s + ']';
}

function dolivereload() {
  var server = livereload.createServer({
    port: _static['live-reload-port']
  });
  server.watch(_static.cachePath);
  console.log('livereload')
}

function addLivereloadScript($) {
  if (!$('script').attr('wu-livereload')) {
    const str = `<script wu-livereload="true">document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +':${_static['live-reload-port']}/livereload.js?snipver=1"></' + 'script>')</script>`
    $('body').append(str)
  }
}

function compileUrl($) {
  return cheerio.load($.html().replace(/(url\()(.*)(\))/g, function (match, p1, p2, p3) {
    let url = p2.replace(/&apos;|&quot;|'|"/g, "")
    if (url && isIn(process.cwd(), url)) {
      let then = path.join(_static['res-path'], url).replace(/\\/g, '/')
      fse.copySync(url, path.resolve(_static.cachePath, then))
      return p1 + then + p3
    } else {
      return match
    }
  }))
}

function compileImgSrc($) {
  $('img').each(function () {
    var imgSrc = $(this).attr('src')
    if (imgSrc && isIn(process.cwd(), imgSrc)) {
      let then = (path.join(_static['res-path'], imgSrc)).replace(/\\/g, '/')
      $(this).attr('src', then)
      fse.copySync(imgSrc, path.resolve(_static.cachePath, then))
    }
  })
}

function compileOpt($) {
  $('wu-opt').each(function () {
    $(this).each(function () {
      let optObj = this.attribs
      for (let opt in optObj) {
        _static[opt] = optObj[opt]
      }
    })
  })
  $('wu-opt').remove()
}


module.exports = {
  dolivereload: dolivereload,
  timetrans: timetrans,
  compile: compile,
  compileImgSrc:compileImgSrc,
  compileUrl:compileUrl
}
