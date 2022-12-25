'use strict';

function installDeps() {
    return new Promise((resolve, reject) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Do you want to install sub dependencies? (Y/n) ', ans => {
            readline.close();

            const cleaned = ans.trim().toLowerCase();
            if (ans === 'n' || ans === 'no') {
                return resolve(false);
            } else {
                return resolve(true)
            }
        });
    });
}


module.exports = installDeps;