/**
 * 
 * @param {PackageDetailsItem[]} packagesList 
 * @param {PackageLockFile} packageLock 
 * @returns 
 */
module.exports = function getAllLinks(packageLock) {
   return Object.values(packageLock.packages).map(dep => ({ resolved: dep.resolved, integrity: dep.integrity }));
}
