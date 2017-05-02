// 2017-05-02
const _ = require('lodash');
const dfU = require('../utils.js');
const mFs = require('fs');
const cCodeGZ = dfU.lPath('code.tar.gz');
module.exports = (cb) => {dfU.tar(dfU.profile('magentoDir.local'), cCodeGZ, () => {
	dfU.upload(cCodeGZ, cb);
}, ['.git', '_my', './pub/static/[^.]*', './var/[^.]*']);};