// 2017-05-02
const _ = require('lodash');
const _f = require('util').format;
const mCP = require('child_process');
const mFs = require('fs-extra');
const mPath = require('path');
const mSCP = require('scp2');
const mSSH = require('simple-ssh');
const self = module.exports = {
	/**
	 * 2017-05-01 «C:/» => «/cygdrive/c/»
	 * @param {String} s
	 * @returns {String}
	 */
	cygdrive:(s) => {var a = s.split(':'); return _f('/cygdrive/%s%s', a[0].toLowerCase(), a[1]);},
	/**
	 * 2017-05-02 «C:/» => «/cygdrive/c/»
	 * @param {String} command
	 * @param {String} dir
	 * @param {Function=} cb
	 */
	cygwin:(command, dir, cb) => {(cb ? mCP.exec : mCP.execSync).call(mCP, _f('bash.exe -c "%s"', command), {
		'cwd': dir, 'env': {'PATH': [self.profile('cygwin'), process.env.PATH].join(';')}, 'maxBuffer': 99999999
	}, cb);},
	/**
	 * 2017-05-03
	 * @returns {Boolean}
	 */
	isFull: _.once(() => {return !!require('yargs').argv['full'];}),
	/**
	 * 2017-05-02
	 * @param {String=} s
	 * @returns {String}
	 */
	lPath:(s) => {return _.memoize(() => {return(
		self.trimS(self.profile('workingDir.local')) + '/'
	);})() + (s || '');},
	/**
	 * 2017-05-01
	 * @param {String} k E.g.: «db.local»
	 * @returns {String|Object}
	 */
	profile:(k) => {return _.get(_.once(() => {return JSON.parse(mFs.readFileSync(
		self.profileFileName(), 'utf8'
	));})(), k)},
	/**
	 * 2017-05-03
	 * «|| 'profile.json'» is for the remove server case:
	 * https://github.com/mage2pro/deployment/blob/0.1.1/local/remoteController.js#L20
	 * @returns {String}
	 */
	profileFileName: _.once(() => {return require('yargs').argv['profile'] || 'profile.json';}),
	/**
	 * 2017-05-03
	 * @param {String=} s
	 * @returns {String}
	 */
	programPath:(s) => {return _.memoize(() => {return(
		mPath.dirname(process.argv[1]).replace(/\\/g, '/') + '/'
	);})() + (s || '');},
	/**
	 * 2017-05-02
	 * @param {String} folder
	 * @param {Function} cb
	 */
	rfsFolderCreate: (folder, cb) => {self.ssh(`mkdir -p ${folder}`, cb);},
	/**
	 * 2017-05-02
	 * @param {String} folder
	 * @param {Function} cb
	 */
	rfsFolderDelete: (folder, cb) => {self.ssh(`rm -rf ${folder}`, cb);},
	/**
	 * 2017-05-07
	 * @returns {String}
	 */
	rMagentoDir:() => {return _.memoize(() => {return self.trimS(self.rMagentoPath());})();},
	/**
	 * 2017-05-03
	 * @param {String=} s
	 * @returns {String}
	 */
	rMagentoPath:(s) => {return _.memoize(() => {return(
		self.trimS(self.profile('magentoDir.remote')) + '/'
	);})() + (s || '');},
	/**
	 * 2017-05-02
	 * dfS.uid(6, 'deploy-')
	 * @param {String=} s
	 * @returns {String}
	 */
	rWorkingPath:(s) => {return _.memoize(() => {return(
		_f('%s/%s/', self.trimS(self.profile('workingDir.remote')), 'deploy-temp')
	);})() + (s || '');},
	/**
	 * 2017-05-02
	 * @param {String} command
	 * @param {?Function=} cb
	 * @param {String=} dir
	 */
	ssh: (command, cb, dir) => {(new mSSH(_.assign(self.sshParams(), dir ? {'baseDir': dir} : {}))).exec(
		command, {exit:(code, stdout, stderr) => {
			if (stdout && stdout.length) {
				console.log(stdout);
			}
			if (stderr && stderr.length) {
				console.log(stderr);
			}
			cb ? cb() : null;
		}}
	).start();},
	/**
	 * 2017-05-02
	 * @returns {Object}
	 */
	sshParams: _.once(() => {return self.credentials('host', 'key', 'user');}),
	/**
	 * 2017-05-02
	 * @param {String} source
	 * @param {String} target
	 * @param {Function} cb
	 * @param {String[]=} excludes
	 */
	tar: (source, target, cb, excludes) => {
		const excludesS = _.map(excludes, (s) => {return _f("--exclude='%s'", s);}).join(' ');
		self.cygwin(_f(`tar ${excludesS} -zcvf %s . >/dev/null`, self.cygdrive(target)), source, cb);
	},
	/**
	 * 2017-05-01 https://lodash.com/docs/4.17.4#trimEnd
	 * @param {String} s
	 * @returns {String}
	 */
	trimS:(s) => {return _.trimEnd(s, '/');},
	/**
	 * 2017-05-02
	 * Unfortunately, scp2::mkdir() leads me to an issue like this: https://github.com/spmjs/node-scp2/issues/58
	 * https://github.com/spmjs/node-scp2#methods
	 * https://github.com/spmjs/node-scp2/blob/0.5.0/lib/client.js#L115
	 * So, I use another way to create the folder on the remote server.
	 * @param {String} file
	 * @param {Function} cb
	 * @param {Object=} options
	 */
	upload:(file, cb, options) => {
		options  = options || {};
		const rDir = self.trimS(self.rWorkingPath(_.get(options, 'subfolder', '')));
		self.rfsFolderCreate(rDir, () => {
			mSCP.scp(file, self.credentials('host', 'privateKey', 'username', {path: rDir}), () => {
				mFs.unlink(file);
				console.log(_f('The «%s» is uploaded.', mPath.basename(file)));
				cb();
			});
		});
	},
	/**
	 * 2017-05-02
	 * @private
	 * @param {String} kHost
	 * @param {String} kKey
	 * @param {String} kUser
	 * @param {Object=} add
	 * @returns {Object}
	 */
	credentials:(kHost, kKey, kUser, add) => {const r = self.profile('remote'); return _.assign(
		_.zipObject([kHost, kUser], [r['host'], r['user']]),
		_.fromPairs([[kKey, mFs.readFileSync(r['key'])]])
		,add || {});
	},
	/**
	 * 2017-05-02
	 * @private
	 * @returns {String}
	 */
	lDir: _.once(() => {return self.trimS(self.profile('workingDir.local')) + '/';}),
};