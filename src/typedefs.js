/**
 * @typedef PackageDetailsItem
 * @type {object}
 * @property {string} resolved - the URL.
 * @property {string} integrity - the package hash.
 */

/**
 * @typedef PackageLockFile   
 * @type {object}
 * @property {string} name - package name.
 * @property {string} version - package version.
 * @property {Object.<string, PackageLockDependencyItem>} packages - packages.
 */

/**
 * @typedef PackageLockDependencyItem 
 * @type {object}
 * @property {string} name - package name.
 * @property {string} version - package version.
 * @property {Object} resolved - the URL.
 * @property {string} integrity - the package hash.
 * @property {object} requires - depedendencies.
 */
