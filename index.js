const packages = require('./package-lock.json');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const { argv } = require('process');

const packagesDir = './npm-packages';

function getAllLinks(packagesList, deps) {
    packagesList.push(...deps.map(dep => ({ resolved: dep.resolved, integrity: dep.integrity })));

    const subDeps = [].concat(...deps.map(dep => dep.dependencies ? Object.values(dep.dependencies) : []));

    if (subDeps && subDeps.length > 0) {
        getAllLinks(packagesList, subDeps)
    }
}

function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, function (response) {

            if (response.statusCode == 302) {
                console.log(response.statusCode + ': ' + url);
                return downloadFile(response.headers.location, filePath);
            }
            if (response.statusCode == 404) {
                return reject(response.statusCode + ': ' + url);
            }

            const file = fs.createWriteStream(filePath);
            response.pipe(file);

            file.on('finish', () => file.close());
            file.on('error', () => fs.unlink(filePath));
        }).end();

        request.on('finish', () => resolve('downloaded'));
        request.on('error', err => reject(err.message));
    })
}

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


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


// https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.14.54.tgz
function saveFilePath(packagesDir, p) {
    if (p.indexOf('@') > -1) {
        return path.join(packagesDir, p.split('/').find(a => a.indexOf('@') === 0) + '_' + path.basename(p))
    } else {
        return path.join(packagesDir, path.basename(p))
    }


}

function operate(op) {
    switch (op) {
        case 1: {
            const packagesList = [];
            getAllLinks(packagesList, Object.values(packages.dependencies));
            fs.writeFileSync('./flatten-packages.json', JSON.stringify(packagesList));
            console.log('total of', packagesList.length, 'packages');
        }
            break;
        case 2: {
            if (!fs.existsSync(packagesDir)) {
                fs.mkdirSync(packagesDir);
            }

            const files = fs.readdirSync(packagesDir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name);

            const packagesList = require('./flatten-packages.json')
                .map(p => p.resolved)
                .filter(Boolean)
                .filter(p => !files.includes(saveFilePath('', p)));

            console.log('total of', packagesList.length, 'to download');
            Promise.all(shuffle(packagesList).map(p => downloadFile(p, saveFilePath(packagesDir, p))))
                .then(res => console.log(res)).catch(res => console.log(res));
        }
            break;
        case 3: {
            const packagesList = require('./flatten-packages.json').filter(p => p.integrity && p.resolved);
            checkIntegrity(packagesList);
        }
            break;
    }
}

module.exports = operate;