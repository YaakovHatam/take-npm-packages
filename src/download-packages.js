const https = require('https');
const fs = require('fs');

const saveFilePath = require('./common').saveFilePath;

function downloadFile(url, filePath) {
   return new Promise((resolve, reject) => {

      const file = fs.createWriteStream(filePath);

      const request = https.get(url, function (response) {
         if (response.statusCode == 302) {
            console.log(response.statusCode + ': ' + url);
            fs.unlinkSync(filePath);
            return downloadFile(response.headers.location, filePath);
         }
         if (response.statusCode == 404) {
            fs.unlinkSync(filePath);
            return reject(response.statusCode + ': ' + url);
         }
         response.pipe(file);
      }).end();

      file.on('finish', () => {
         file.close();
         resolve('downloaded: ' + url);
      });

      file.on('error', () => {
         fs.unlinkSync(filePath);
         reject('file error')
      });

      request.on('error', err => {
         reject(err.message)
      });
   })
}

function shuffle(array) {
   return array;
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

module.exports = function downloadPackages(packages, packagesDir) {
   return Promise.all(shuffle(packages).map(p => downloadFile(p, saveFilePath(packagesDir, p))));
}
