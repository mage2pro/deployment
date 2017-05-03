// 2017-05-02
const _ = require('lodash');
const dfU = require('../utils.js');
const mFs = require('fs-extra');
const mPath = require('path');
const baseName = 'program.tar.gz';
const lFullPath = dfU.lPath(baseName);
const rDirBN = 'program';
const rDir = dfU.rWorkingPath(rDirBN);
module.exports = {
	/** 2017-05-02 */
	execute:() => {dfU.ssh('node remote.js', null, rDir);},
	/**
	 * 2017-05-02
	 * @param {Function} cb
	 */
	upload:(cb) => {
		const lProfileTmpPath = dfU.programPath('profile.json');
		// 2017-05-03
		// Transfer the current profile to the remote server.
		// https://github.com/mage2pro/deployment/blob/0.1.1/utils.js#L43
		mFs.copySync(dfU.profileFileName(), lProfileTmpPath);
		const full = dfU.isFull();
		dfU.tar(dfU.trimS(dfU.programPath()), lFullPath, () => {
			mFs.unlink(lProfileTmpPath);
			const upload = () => {dfU.upload(lFullPath, () => {
				dfU.ssh(`tar -xvzf ${baseName} >/dev/null`, cb, rDir);
			}, {subfolder: rDirBN});};
			!full ? upload() : dfU.rfsFolderDelete(rDir, upload);
		}, ['.git'].concat(!full ? ['./node_modules'] : []));
	}
};