// 2017-05-02
const _ = require('lodash');
const dfU = require('../utils.js');
const mFs = require('fs-extra');
const mPath = require('path');
const baseName = 'program.tar.gz';
const lFullPath = dfU.lPath(baseName);
const rDirBN = 'program';
const rDir = dfU.rPath(rDirBN);
module.exports = {
	/** 2017-05-02 */
	execute:() => {dfU.ssh('node remote.js', null, rDir);},
	/**
	 * 2017-05-02
	 * @param {Boolean} full
	 * @param {Function} cb
	 */
	upload:(full, cb) => {
		const lProgramPath = mPath.dirname(process.argv[1]).replace(/\\/g, '/');
		const lProfileTmpPath =  `${lProgramPath}/profile.json`;
		// 2017-05-03 Transfer the current profile to the remote server.
		mFs.copySync(dfU.profileFileName(), lProfileTmpPath);
		dfU.tar(lProgramPath, lFullPath, () => {
			mFs.unlink(lProfileTmpPath);
			const upload = () => {dfU.upload(lFullPath, () => {
				dfU.ssh(`tar -xvzf ${baseName} >/dev/null`, cb, rDir);
			}, {subfolder: rDirBN});};
			!full ? upload() : dfU.rfsFolderDelete(rDir, upload);
		}, ['.git'].concat(!full ? ['./node_modules'] : []));
	}
};