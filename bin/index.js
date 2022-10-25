#! /usr/bin/env node
const path = require('path');
const downloader = require('../index');

var yargs = require('yargs/yargs')(process.argv.slice(2))
   .usage('Usage: npx @yaakovhatam/take-npm-packages [options]')
   .example('npx @yaakovhatam/take-npm-packages', 'list all packages from package-lock.json')
   .example('npx @yaakovhatam/take-npm-packages -d', 'download all packages from package-lock.json')
   .example('npx @yaakovhatam/take-npm-packages -d -i', 'download all packages from package-lock.json and check integrity')
   .alias('d', 'download')
   .alias('i', 'integrity');

yargs.showVersion(m => console.log(`Running version ${m}`));

const packages = require(path.join(process.cwd(), './package-lock.json'));
if (!packages) {
   console.error('No package-lock.json file found');
   return process.exit(1)
}

downloader(yargs.argv).then(() => process.exit(0)).catch(err => console.error(err));