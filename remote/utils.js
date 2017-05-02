// 2017-05-03
const _ = require('lodash');
const dfU = require('./utils.js');
const mArg = require('yargs');
var self = module.exports = {
	/**
	 * 2017-05-03
	 * @param {String=} localPath
	 * @returns {String}
	 */
	magentoPath: (localPath) => {
		const base = _.memoize(() => {return dfU.trimS(mArg.argv['magentoDir']) + '/';});
		return base() + + (localPath || '');
	}
};