// 2017-05-02
const _ = require('lodash');
const _f = require('util').format;
const dfU = require('../utils.js');
const mCP = require('child_process');
const mFs = require('fs-extra');
const mZlib = require('zlib');
const profile = dfU.profile;
const regEscape = require('escape-string-regexp');
const upload = dfU.upload;
/**
 * 2017-05-01
 * @param {Object} u
 * @returns {String}
 */
const buildUrl = (u) => {return _f('%s://%s', _.get(u, 'protocol', 'https'), _.filter([
	_.filter([_.get(u, 'domain', 'localhost.com'), _.get(u, 'port')]).join(':'), _.get(u, 'path')
]).join('/'))};
const self = module.exports = {
	c_BaseNameGZ: 'db.sql.gz'
	,execute: (cb) => {
		const lFullName = dfU.lPath('db.sql');
		mCP.exec(_f(`mysqldump %s > ${lFullName}`, profile('db.local')), () => {
			var dump = mFs.readFileSync(lFullName, 'utf8');
			const lFullNameGZ = dfU.lPath(self.c_BaseNameGZ);
			mFs.unlink(lFullName);
			_.each(profile('sites'), (s) => {
				const u = s['url'];
				dump = dump.replace(new RegExp(regEscape(buildUrl(u['local'])), 'g'), buildUrl(u['remote']));
			});
			mFs.writeFileSync(lFullNameGZ, mZlib.gzipSync(dump));
			upload(lFullNameGZ, cb);
		});
	}
};