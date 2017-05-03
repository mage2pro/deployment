// 2017-05-03
const _ = require('lodash');
const dfU = require('../utils.js');
const mFs = require('fs-extra');
const pubPath = dfU.rMagentoPath('pub/');
const index = `${pubPath}index.php`;
const indexDisabled = `${pubPath}index-disabled.php`;
const self = module.exports = {
	/** 2017-05-03 */
	maintenanceOff:() => {
		if (mFs.existsSync(indexDisabled)) {
			mFs.unlink(index);
			mFs.renameSync(indexDisabled, index);
		}
	},
	/** 2017-05-03 */
	maintenanceOn:() => {
		if (mFs.existsSync(index)) {
			mFs.renameSync(index, indexDisabled);
			mFs.copySync(dfU.programPath('tmpl/index.php'), index);
		}
	}
};