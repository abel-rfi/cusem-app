module.exports = {
	ifEquals: function(a, b, opt) {
		if (a === b) {
			return opt.fn(this);
		}
		return opt.inverse(this);
	}
}
