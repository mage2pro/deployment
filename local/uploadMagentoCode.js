// 2017-05-02
const _ = require('lodash');
const dfU = require('../utils.js');
const mFs = require('fs-extra');
const cCodeGZ = dfU.lPath('code.tar.gz');
const self = module.exports = {
	c_BaseNameGZ: 'code.tar.gz'
	,execute:(cb) => {
		const lFullNameGZ = dfU.lPath(self.c_BaseNameGZ);
		dfU.tar(dfU.profile('magentoDir.local'), lFullNameGZ, () => {
			dfU.upload(lFullNameGZ, cb);
		}, ['.git', '_my', './generated/[^.]*', './pub/static/[^.]*', './var/[^.]*']);
	}
};