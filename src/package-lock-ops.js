/// <reference path="typedefs.js" />

/**
 * 
 * @param {PackageDetailsItem[]} packagesList 
 * @param {PackageLockFile} packageLock 
 * @returns 
 */
function getAllLinks(packageLock) {
   return Object.entries(packageLock.packages).filter(([key, val]) => val.integrity).map(([key, val]) => ({
      resolved: val.resolved,
      integrity: val.integrity,
      name: key,
   }));
}

/**
 * 
 * @param {PackageDetailsItem[]} packagesList 
 * @param {PackageLockFile} packageLock 
 * @returns 
 */
function getAllPackagesDetails(packageLock) {
   return Object.entries(packageLock.packages).filter(([key, val]) => val.integrity).map(([key, val]) => ({
      name: key,
      version: val.version,
   }));
}

/**
 * 
 * @param {PackageLockFile} packageLock 
 * @returns 
 */
function getPackageJsonPackages(packageLock) {
   return packageLock.packages[""].dependencies;

}

module.exports = {
   getAllLinks,
   getAllPackagesDetails,
   getPackageJsonPackages
}