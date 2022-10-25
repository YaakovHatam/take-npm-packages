# take-npm-packages

## What is this?
This tool is a simple script that takes a list of npm packages and installs them in a directory of your choice.

## Commands

`npx @yaakovhatam/take-npm-packages --version` - Get the version of the tool

`npx @yaakovhatam/take-npm-packages [options]`
- `options: download (alias: d)` - downloads the packages to the current directory
- `options: integrity (alias: i)` - checks the integrity of the packages downloaded in the current directory

## Usage examples

`npx @yaakovhatam/take-npm-packages` - list all packages from package-lock.json

`npx @yaakovhatam/take-npm-packages -d` - download all packages from package-lock.json

`npx @yaakovhatam/take-npm-packages -d -i` - download all packages from package-lock.json and check integrity
