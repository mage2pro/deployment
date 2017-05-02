var self = module.exports = {
	/**
	 * 2016-08-05
	 * http://stackoverflow.com/a/894877
	 * @param {*} v
	 * @param {*} d
	 * @returns {*}
	 */
	arg: (v, d) => {return self.d(v) ? v : d;}
	/**
	 * 2016-04-20
	 * @param {*} v
	 * @returns {Boolean}
	 */
	,d: function(v) {return 'undefined' !== typeof v;}
};