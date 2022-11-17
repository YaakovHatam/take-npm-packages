const semver = require('semver')

const allDeps = new Set();
const subDeps = [
    'peerDependencies',
    // 'peerDependenciesMeta',
    'optionalDependencies',
    //'devDependencies'
];


function normalizeVersion(version) {
    if (version === '*') return 'latest';

    const { major, minor } = semver.minVersion(new semver.Range(version));

    return major === 0 ? '0.' + minor : '' + major;
}

function findSubDeps(packagesLock) {
    Object.values(packagesLock.packages).forEach((pkg) => subDeps.forEach((subDep) => {
        if (pkg[subDep]) {
            Object.entries(pkg[subDep])
                .filter(([name, version]) => {
                    const localPackages = Object.entries(packagesLock.packages).filter(([key, value]) => {
                        if (value.name) {
                            return value.name === name;
                        } else {
                            return key.endsWith('/' + name);
                        }
                    });

                    if (!localPackages.length) return true;

                    const currentActualVersions = localPackages.map(localPackage => localPackage[1].version);
                    const wantedVersion = version;

                    return currentActualVersions
                        .every(currentActualVersion => !semver.satisfies(currentActualVersion, wantedVersion));

                })
                .map(([dep, version]) => allDeps.add(`${dep}@${normalizeVersion(version)}`));
        }
    }));
    return allDeps;
}

module.exports = findSubDeps;
