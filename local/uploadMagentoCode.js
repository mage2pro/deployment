// 2017-05-02
const _ = require('lodash');
const dfU = require('../utils.js');
const self = module.exports = {c_BaseNameGZ: 'code.tar.gz', execute:(cb) => {
	if (!dfU.isFull()) {cb();}
	else {
		const lFullNameGZ = dfU.lPath(self.c_BaseNameGZ);
		dfU.tar(dfU.profile('magentoDir.local'), lFullNameGZ, () => {
			dfU.upload(lFullNameGZ, cb);
		}, ['.git', '_my', './generated/[^.]*', './pub/static/[^.]*', './var/[^.]*']);
	}
}};