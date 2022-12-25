const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');

const packages = require(path.join(process.cwd(), './package-lock.json'));
const packagesDir = path.join(process.cwd(), 'npm-packages');
const flattedPackagesFile = path.join(process.cwd(), 'list-packages.json');
const subDepsPackagesFile = path.join(process.cwd(), 'subdeps.txt');

const packageLockOps = require('./src/package-lock-ops');
const listSubDeps = require('./src/sub-deps');
const installDeps = require('./src/install-deps');

const downloadPackages = require('./src/download-packages');
const saveFilePath = require('./src/common').saveFilePath;

function checkIntegrity(packagesList) {
   const files = fs.readdirSync(packagesDir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name);

   const totalFiles = files.length;
   let badfiles = 0;

   files.forEach(file => {
      const fileBuffer = fs.readFileSync(path.join(packagesDir, file));

      const hashSum = crypto.createHash('sha512');
      hashSum.update(fileBuffer);
      const hex = 'sha512-' + hashSum.digest('base64');

      const package = packagesList.find(p => saveFilePath('', p.resolved) === file);
      if (!package) return;

      const packageInetgrity = package.integrity;

      if (hex !== packageInetgrity) {
         badfiles++;
         fs.unlinkSync(path.join(packagesDir, file));
      }
   });
   console.log('package.lock contains', packagesList.length, 'pacakges')
   console.log('from total of', totalFiles, 'tgz packages, theres', badfiles, 'bad files');

}

async function listPackagesWithLinks(writeToFile = true) {
   const packagesList = packageLockOps.getAllLinks(packages);
   console.log('total of', packagesList.length, 'packages');
   return flattedPackagesFile;
}

async function listPackages(includeVersions) {
   const packagesList = includeVersions ?
      packageLockOps.getAllPackagesDetails(packages).map(p => `${p.name}@${p.version}`) :
      packageLockOps.getAllPackagesDetails(packages).map(p => p.name);

   console.log('total of', packagesList.length, 'packages');
   fs.writeFileSync(flattedPackagesFile, JSON.stringify(packagesList, null, 4));
   console.log('saved under', flattedPackagesFile);
   return flattedPackagesFile;
}

async function download() {
   const packagesList = require(flattedPackagesFile);

   if (!fs.existsSync(packagesDir)) {
      fs.mkdirSync(packagesDir);
   }

   const files = fs.readdirSync(packagesDir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name);

   const filteredPackagesList = packagesList
      .map(p => p.resolved)
      .filter(Boolean)
      .filter(p => !files.includes(saveFilePath('', p)));

   console.log('total of', filteredPackagesList.length, 'to download');
   return downloadPackages(filteredPackagesList, packagesDir);
}

async function integrityCheck() {
   const packagesList = require(flattedPackagesFile);

   const packagesListHasIntegrity = packagesList.filter(p => p.integrity && p.resolved);
   checkIntegrity(packagesListHasIntegrity);
   return '';

}

async function listSubDependencies() {
   const userInstalledPacakges = (Object.keys(packageLockOps.getPackageJsonPackages(packages)));

   function normalizeName(name) {
      return name.replace(/\//, '_').replace(/@/g, '').replace(/\*/g, '');
   }

   const subDepsList = listSubDeps(packages).map(sd => userInstalledPacakges
      .indexOf(sd.name) > -1 ? `${normalizeName(sd.name)}${sd.version}@npm:${sd.name}@${sd.version}` : `${sd.name}@${sd.version}`
   )

   if (subDepsList.length > 0) {
      fs.writeFileSync(subDepsPackagesFile, subDepsList.join(os.EOL));
      console.log('saved under', subDepsPackagesFile);
   } else {
      console.log('no sub deps found');
   }
   return;
}

module.exports = {
   listPackages,
   download,
   integrityCheck,
   listSubDependencies,
   listPackagesWithLinks
};