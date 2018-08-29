const {createFilter} = require('rollup-pluginutils')
const {compile} = require('../src/utils')
module.exports = function string(opts = {}) {
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
          code: ``,
          map: {mappings: ''}
        };
        return x;
      }
    },
    onwrite() {
      compile()
    }
  };
}