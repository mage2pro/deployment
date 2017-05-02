// 2017-05-03
const dfU = require('../utils.js');
const dfUploadMagentoDB = require('../local/uploadMagentoDB.js');
const mCP = require('child_process');
const mFs = require('fs-extra');
module.exports = (cb) => {
	const db = dfU.profile('db.remote');
	mCP.exec(`mysql -e "DROP DATABASE IF EXISTS ${db}; CREATE DATABASE ${db};"`, () => {
		mCP.exec(`zcat db.sql.gz | mysql ${db}`, {
			cwd: dfU.rPath()
		}, () => {
			console.log(`The remote DB «${db}» is updated.`);
			mFs.unlink(dfU.rPath(dfUploadMagentoDB.c_BaseNameGZ));
		});
	});
};