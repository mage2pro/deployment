// 2017-05-03
const _ = require('lodash');
const _f = require('util').format;
const dfRU = require('./utils.js');
const dfU = require('../utils.js');
const dfUploadMagentoDB = require('../local/uploadMagentoDB.js');
const mCP = require('child_process');
const mFs = require('fs-extra');
const db = dfU.profile('db.remote');
const _switch = (on, options) => {mCP.execSync(_f(
	`mysql -e "UPDATE core_config_data SET value = '%s' WHERE path IN (%s)" ${db}`,
	on ? '1' : '0', _._.map(options, (v) => {return `'${v}'`;}).join(', ')
));};
module.exports = (cb) => {
	mCP.execSync(`mysql -e "DROP DATABASE IF EXISTS ${db}; CREATE DATABASE ${db};"`);
	mCP.execSync(`zcat db.sql.gz | mysql ${db}`, {cwd: dfU.rWorkingPath()});
	_switch(true, ['dev/css/merge_css_files', 'dev/js/merge_files']);
	dfRU.deleteCache();
	console.log(`The remote DB «${db}» is updated.`);
	mFs.unlink(dfU.rWorkingPath(dfUploadMagentoDB.c_BaseNameGZ));
};