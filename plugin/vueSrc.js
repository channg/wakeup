const {createFilter} = require('rollup-pluginutils')
const {compileImgSrc, compileUrl} = require('../src/utils')
const cheerio = require('cheerio')
module.exports = function string(opts = {}) {
  if (!opts.include) {
    opts.include = '**/*.vue'
  }
  const filter = createFilter(opts.include, opts.exclude);
  
  return {
    name: 'wu-vue',
    transform(code, id) {
      if (filter(id)) {
        var $ = cheerio.load('<wu-vue>'+code+'</wu-vue>')
        compileImgSrc($)
        $ = compileUrl($)
        return {
          code: $('wu-vue').html(),
          map: { mappings: '' }
        }
      }
    }
  };
}