#! /usr/bin/env node
const path = require('path');
const downloader = require('../index');

const packages = require(path.join(process.cwd(), './package-lock.json'));
if (!packages) {
   console.error('No package-lock.json file found');
   return process.exit(1)
}

const op = Number(argv[2]);
downloader(op);