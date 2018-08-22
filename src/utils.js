const spawn = require('cross-spawn');
const path = require('path')
module.exports = {
    randomName:function(){
        return generateMixed(6)
    },
  rollWatch:rollWatch,
    getBin:getBin
}

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
  var res = "";
  for(var i = 0; i < n ; i ++) {
    var id = Math.ceil(Math.random()*35);
    res += chars[id];
  }
  return res;
}


function getBin(binName) {
  return path.resolve(__dirname, `../node_modules/.bin/${binName}`);
}


function rollWatch() {
  return () => {
    spawn(getBin('rollup'), [
      '-c '+path.resolve(__dirname,'../rollup.config.js')
    ], {
      stdio: [0,1,2],
    }).on('error', (error) => {
      console.log(error);
    });
  };
}