const {createFilter} = require('rollup-pluginutils')
const {compile} = require('../src/utils')
module.exports = function string(opts = {}) {
  let build = opts.build
  if (!opts.include) {
    opts.include = '**/*.html'
  }
  const kv = {}
  const filter = createFilter(opts.include, opts.exclude);
  
  return {
    name: 'wu-html',
    transform(code, id) {
      if (filter(id)) {
        kv[id] = code
        const x = {
          code: `export default null`,
          map: {mappings: ''}
        };
        return x;
      }
    },
    onwrite() {
      compile(build)
    }
  };
}