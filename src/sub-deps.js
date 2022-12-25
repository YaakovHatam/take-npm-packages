/// <reference path="typedefs.js" />

const semver = require('semver')

const subDepsWantedItems = [
    'peerDependencies',
    // 'peerDependenciesMeta',
    // 'optionalDependencies',
    //'devDependencies'
];

function normalizeVersion(version) {
    if (version === '*') return 'latest';

    const { major, minor } = semver.minVersion(new semver.Range(version));

    return major === 0 ? '0.' + minor : '' + major;
}

/**
 * 
 * @param {PackageLockFile} packageLock 
 * @returns 
 */
function findSubDeps(packageLock) {
    const localPackages = Object.entries(packageLock.packages);

    return Array.from(new Set([].concat(...localPackages.map(([name, pkg]) => {
        const subDeps = Object.assign(...subDepsWantedItems.map(sd => pkg[sd] || {}));

        return Object.entries(subDeps)
            .filter(([subdepName, subdepVersion]) => {
                const alreadyInstalledPacakge = localPackages.filter(pkg => pkg[0] === subdepName || pkg[0].endsWith('/' + subdepName));
                if (alreadyInstalledPacakge.length === 0) return true;


                const currentActualVersions = alreadyInstalledPacakge.map(pkg => pkg[1].version);
                const wantedVersion = subdepVersion;

                return currentActualVersions
                    .every(currentActualVersion => !semver.satisfies(currentActualVersion, wantedVersion));
            })
            .map(([subdepName, subdepVersion]) => {
                return JSON.stringify({
                    name: subdepName,
                    version: normalizeVersion(subdepVersion)
                });
            });
    })))).map(sd => JSON.parse(sd));
}

module.exports = findSubDeps;
