const spawn = require('cross-spawn');
const path = require('path')
module.exports = {
  rollWatch: rollWatch,
}





function getBin(binName) {
  return path.resolve(__dirname, `../node_modules/.bin/${binName}`);
}


function rollWatch() {
  spawn(getBin('rollup'), [
    '-c',
    path.resolve(__dirname, '../rollup.config.js'),
    '--watch'
  ], {
    stdio: [0, 1, 2],
  }).on('error', (error) => {
    console.log(error);
  });
}