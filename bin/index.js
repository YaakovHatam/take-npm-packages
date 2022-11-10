#! /usr/bin/env node
const path = require('path');
const ops = require('../index');

var yargs = require('yargs/yargs')(process.argv.slice(2))
   .usage('Usage: npx @yaakovhatam/take-npm-packages [options]')
   .example('npx @yaakovhatam/take-npm-packages', 'list all packages from package-lock.json')
   .example('npx @yaakovhatam/take-npm-packages -s', 'download sub dependencies (like peer deps) package-lock.json')
   .example('npx @yaakovhatam/take-npm-packages -d', 'download all packages from package-lock.json')
   .example('npx @yaakovhatam/take-npm-packages -d -i', 'download all packages from package-lock.json and check integrity')
   .alias('d', 'download')
   .alias('s', 'subdeps')
   .alias('i', 'integrity');

yargs.showVersion(m => console.log(`Running version ${m}`));

const packages = require(path.join(process.cwd(), './package-lock.json'));
if (!packages) {
   console.error('No package-lock.json file found');
   return process.exit(1)
}

if (yargs.argv.subdeps) {
   ops.listSubDependencies(packages)
      .then(() => process.exit(0)).catch(err => console.error(err));

} else {
   ops.listPackages()
      .then(() => yargs.argv.download ? ops.download() : null)
      .then(res => console.log(res))
      .then(() => yargs.argv.integrity ? ops.integrityCheck() : null)
      .then(() => process.exit(0)).catch(err => console.error(err));
}