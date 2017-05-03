// 2017-05-02
const dfU = require('./utils.js');
const magentoDir = dfU.rMagentoDir();
const workingDir = dfU.rPath();
console.log(magentoDir);
console.log(workingDir);
require('./remote/updateMagentoCode.js')(() => {});
//require('./remote/updateMagentoDB.js')(() => {});
/*
const deleteFolder = (f, notify) => {mCP.exec(_f('rm -rf %s', f), () => {
	notify ? console.log(_f('The folder «%s» is deleted.', f)) : '';
});};*/
/*
deleteFolder(magentoDir);
mFs.mkdirSync(magentoDir);
*/
/*
mCP.exec(_f('tar -xvzf ../$archiveNameForFiles >/dev/null', f), () => {
	notify ? console.log(_f('The folder «%s» is deleted.', f)) : '';
});*/
//deleteFolder(workingDir, true);