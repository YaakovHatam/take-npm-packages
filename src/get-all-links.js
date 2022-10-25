/**
 * 
 * @param {PackageDetailsItem[]} packagesList 
 * @param {PackageLockFile} packageLock 
 * @returns 
 */
module.exports = function getAllLinks(packageLock) {
   const packagesList = [];
   getAllLinksSyncRecursive(packagesList, Object.values(packageLock.dependencies))

   return [...new Map(packagesList.map(item => [item['resolved'], item])).values()];
}

/**
 * 
 * @param {PackageDetailsItem[]} packagesList 
 * @param {PackageLockDependencyItem[]} deps 
 * @returns 
 */
function getAllLinksSyncRecursive(packagesList, deps) {
   packagesList.push(...deps.map(dep => ({ resolved: dep.resolved, integrity: dep.integrity })));

   const subDeps = [].concat(...deps.map(dep => dep.dependencies ? Object.values(dep.dependencies) : []));

   if (subDeps && subDeps.length > 0) {
      getAllLinksSyncRecursive(packagesList, subDeps)
   }
}