// 2017-05-03
const dfU = require('../utils.js');
const dfUploadMagentoCode = require('../local/uploadMagentoCode.js');
const mCP = require('child_process');
const mFs = require('fs-extra');
module.exports = (cb) => {
	const magentoDir = dfU.rMagentoDir();
	mFs.removeSync(magentoDir);
	mFs.mkdirSync(magentoDir);
	const rPathGz = dfU.rPath(dfUploadMagentoCode.c_BaseNameGZ);
	mCP.execSync(`tar -xvzf ${rPathGz} >/dev/null`, {cwd: magentoDir});
	mCP.execSync(`sudo chmod -v -R 755 . >/dev/null`, {cwd: magentoDir});
};