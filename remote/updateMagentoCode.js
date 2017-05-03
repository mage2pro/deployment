// 2017-05-03
const _ = require('lodash');
const dfU = require('../utils.js');
const dfUploadMagentoCode = require('../local/uploadMagentoCode.js');
const mCP = require('child_process');
const mFs = require('fs-extra');
const mIni = require('ini');
const mOS = require('os');
module.exports = (cb) => {
	const magentoDir = dfU.trimS(dfU.rMagentoPath());
	mFs.removeSync(magentoDir);
	mFs.mkdirSync(magentoDir);
	const rPathGz = dfU.rWorkingPath(dfUploadMagentoCode.c_BaseNameGZ);
	const execM = (command) => {mCP.execSync(command, {cwd: magentoDir})};
	execM(`tar -xvzf ${rPathGz} >/dev/null`);
	execM(`sudo chmod -v -R 755 . >/dev/null`);
	console.log(mOS.homedir());
	const c = mIni.parse(mFs.readFileSync(`${mOS.homedir()}/.my.cnf`, 'utf-8'))['mysql'];
	const map = {dbname: dfU.profile('db.remote'), host: c['host'], password: c['password'], username: c['user']};
	const envPath = dfU.rMagentoPath('app/etc/env.php');
	mFs.writeFileSync(envPath, _.reduce(map, (s, v, k) => {return s.replace(
		new RegExp(`'${k}' => '([^']+)'`, 'mu'), `'${k}' => '${v}'`
	);}, mFs.readFileSync(envPath, 'utf8')));
	mCP.execSync('sudo service php7.1-fpm restart >/dev/null');
	//execM("find var/* -type f -or -type d | grep -v 'session' | xargs rm -rf && rm -rf pub/static/* >/dev/null");
	//execM('rm -rf generated/code generated/metadata');
	console.log('The remote code is updated.');
};