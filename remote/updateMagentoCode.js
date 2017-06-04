// 2017-05-03
const _ = require('lodash');
const dfU = require('../utils.js');
const dfUploadMagentoCode = require('../local/uploadMagentoCode.js');
const mCP = require('child_process');
const mFs = require('fs-extra');
const mIni = require('ini');
const mOS = require('os');
module.exports = (cb) => {
	const magentoDir = dfU.rMagentoDir();
	mFs.removeSync(magentoDir);
	console.log(`The folder «${magentoDir}» is removed.`);
	mFs.mkdirSync(magentoDir);
	console.log(`The folder «${magentoDir}» is created.`);
	const rPathGz = dfU.rWorkingPath(dfUploadMagentoCode.c_BaseNameGZ);
	const execM = (command) => {mCP.execSync(command, {cwd: magentoDir});};
	execM(`tar -xvzf ${rPathGz} >/dev/null`);
	console.log(`The code archive «${rPathGz}» is extracted.`);
	execM(`sudo chmod -v -R 755 . >/dev/null`);
	console.log(mOS.homedir());
	const c = mIni.parse(mFs.readFileSync(`/etc/mysql/my.cnf`, 'utf-8'))['mysql'];
	const map = {dbname: dfU.profile('db.remote'), host: c['host'], password: c['password'], username: c['user']};
	const envPath = dfU.rMagentoPath('app/etc/env.php');
	mFs.writeFileSync(envPath, _.reduce(map, (s, v, k) => {return s.replace(
		new RegExp(`'${k}' => '([^']+)'`, 'mu'), `'${k}' => '${v}'`
	);}, mFs.readFileSync(envPath, 'utf8')));
	mCP.execSync('sudo service php7.1-fpm restart >/dev/null');
	console.log('The remote code is updated.');
};