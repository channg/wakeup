var fs = require('fs')
var path = require('path')
let some = fs.realpathSync(path.resolve(__dirname,'../rollup.config.js'));
console.log(some)