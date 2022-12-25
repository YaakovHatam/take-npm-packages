#! /usr/bin/env node
const path = require('path');
const ops = require('../index');

var yargs = require('yargs/yargs')(process.argv.slice(2))
   .usage('Usage: npx @yaakovhatam/take-npm-packages <command> [options]')
   .command('download', 'download all packages from package-lock.json')
   .command('subdeps', 'download sub dependencies (like peer deps) package-lock.json')
   .command('list', 'list all packages from package-lock.json')
   .example(
      ['npx take-npm-packages list', 'list all packages from package-lock.json, saved to file "list-packages.json"'],
      ['npx take-npm-packages list -v', 'list all packages from package-lock.json include their versions, saved to file "list-packages.json"'],
      ['npx take-npm-packages subdeps', 'download sub dependencies (like peer deps) package-lock.json'],
      ['npx take-npm-packages download', 'download all packages from package-lock.json'],
      ['npx take-npm-packages download -i', 'download all packages from package-lock.json and check integrity']
   )
   .alias('d', 'download')
   .alias('l', 'list')
   .alias('s', 'subdeps')
   .alias('i', 'integrity')
   .alias('v', 'include-versions')
   .showHelpOnFail(true)
   .help(
      'help',
      'Show usage instructions.'
   ).command({
      command: '*',
      handler() {
         yargs.showHelp()
      }
   });

yargs.showVersion(m => console.log(`Running version ${m}`));

const packages = require(path.join(process.cwd(), './package-lock.json'));
console.log('found package-lock file: ', packages.name);

if (!packages) {
   console.error('No package-lock.json file found');
   return process.exit(1)
}

if (yargs.argv._.length) {
   (function (yargs) {
      switch (yargs.argv._[0]) {
         case 'subdeps':
            return ops.listSubDependencies()
         case 'list':
            return ops.listPackages(yargs.argv.v)
         case 'download':
            return ops.listPackagesWithLinks().then(ops.download).then(() => yargs.argv.integrity ? ops.integrityCheck() : null)

      }
   })(yargs).then(() => process.exit(0)).catch(err => console.error(err));

}
