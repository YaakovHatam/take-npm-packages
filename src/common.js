const path = require('path');

function saveFilePath(packagesDir, p) {
   if (p.indexOf('@') > -1) {
      return path.join(packagesDir, p.split('/').find(a => a.indexOf('@') === 0) + '_' + path.basename(p))
   } else {
      return path.join(packagesDir, path.basename(p))
   }
}

module.exports = {
   saveFilePath
}