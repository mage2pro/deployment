// 2017-05-03
const dfRU = require('../remote/utils.js');
const dfU = require('../utils.js');
const dfUploadMagentoDB = require('../local/uploadMagentoDB.js');
const mCP = require('child_process');
const mFs = require('fs-extra');
module.exports = (cb) => {
	const db = dfU.profile('db.remote');
	mCP.execSync(`mysql -e "DROP DATABASE IF EXISTS ${db}; CREATE DATABASE ${db};"`);
	mCP.execSync(`zcat db.sql.gz | mysql ${db}`, {cwd: dfU.rWorkingPath()});
	console.log(`The remote DB «${db}» is updated.`);
	mFs.unlink(dfU.rWorkingPath(dfUploadMagentoDB.c_BaseNameGZ));
};