'use strict'
const execSync = require('child_process').execSync;
const path = require('path');
const sourceDir = "./artifacts/src";
const currentDir = process.cwd();
const packagePath = path.join(currentDir, './artifacts/package.zip');

execSync("tsc");
execSync(`rm -f ${packagePath}`, {cwd: sourceDir});
execSync(`cp -f ${currentDir}/package.json ./`, {cwd: sourceDir});
execSync(`cp -f ${currentDir}/package-lock.json ./`, {cwd: sourceDir});    
execSync(`npm install --production`, {cwd: sourceDir});
execSync(`zip -r ${packagePath} . .[^.*]*`, {cwd: sourceDir});
