// 2017-05-02
const _ = require('lodash');
const _f = require('util').format;
const dfU = require('./utils.js');
const mArg = require('yargs');
const mCP = require('child_process');
const mFs = require('fs');
const magentoDir = dfU.trimS(mArg.argv['magentoDir']) + '/';
const workingDir = dfU.trimS(mArg.argv['workingDir']) + '/';
console.log(magentoDir);
console.log(workingDir);
const deleteFolder = (f, notify) => {mCP.exec(_f('rm -rf %s', f), () => {
	notify ? console.log(_f('The folder «%s» is deleted.', f)) : '';
});};
deleteFolder(magentoDir);
mFs.mkdirSync(magentoDir);
/*
mCP.exec(_f('tar -xvzf ../$archiveNameForFiles >/dev/null', f), () => {
	notify ? console.log(_f('The folder «%s» is deleted.', f)) : '';
});*/
//deleteFolder(workingDir, true);