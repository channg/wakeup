#!/usr/bin/env node
const version = require('../package.json').version
const program = require('commander')
const cheerio = require('cheerio')
const fs = require('fs')
const fse = require('fs-extra')
const utils = require('../src/utils')

program
  .version(version);

program
  .command('watch')
  .alias('w')
  .description('watch the program')
  .action(() => {
    fse.removeSync('./.wakeup/')
    fse.ensureDirSync('./.wakeup')
    // ensure index.html
    let exists = fs.existsSync('./index.html')
    if(exists){
        let html = fs.readFileSync('./index.html','utf-8')
        console.log(html)
    }
    
  });


program.parse(process.argv);