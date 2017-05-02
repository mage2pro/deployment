// 2017-05-02
const _ = require('lodash');
const _f = require('util').format;
const dfU = require('../utils.js');
const lDump = dfU.lPath('db.sql');
const lDumpGZ = lDump + '.gz';
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
module.exports = (cb) => {mCP.exec(_f('mysqldump %s > %s', profile('db.local'), lDump), () => {
	var dump = mFs.readFileSync(lDump, 'utf8');
	mFs.unlink(lDump);
	_.each(profile('sites'), (s) => {
		const u = s['url'];
		dump = dump.replace(new RegExp(regEscape(buildUrl(u['local'])), 'g'), buildUrl(u['remote']));
	});
	mFs.writeFileSync(lDumpGZ, mZlib.gzipSync(dump));
	upload(lDumpGZ, cb);
});};