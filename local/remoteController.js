// 2017-05-02
const _ = require('lodash');
const dfU = require('../utils.js');
const mPath = require('path');
const baseName = 'program.tar.gz';
const lFullPath = dfU.lPath(baseName);
const rDirBN = 'program';
const rDir = dfU.rPath(rDirBN);
module.exports = {
	/** 2017-05-02 */
	execute:() => {
		const params = _.map({}, (v, k) => {return `--${k}=${v}`;}).join(' ');
		dfU.ssh(`node remote.js ${params}`, null, rDir);
	},
	/**
	 * 2017-05-02
	 * @param {Boolean} full
	 * @param {Function} cb
	 */
	upload:(full, cb) => {dfU.tar(mPath.dirname(process.argv[1]).replace(/\\/g, '/'), lFullPath, () => {
		const upload = () => {dfU.upload(lFullPath, () => {
			dfU.ssh(`tar -xvzf ${baseName} >/dev/null`, cb, rDir);
		}, rDirBN);};
		!full ? upload() : dfU.rfsFolderDelete(rDir, upload);
	}, ['.git'].concat(!full ? ['./node_modules'] : []));}
};