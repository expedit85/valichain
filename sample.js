var Valichain = require("./index.js");
var _ = require("lodash");

var V = Valichain.validate;

var rules = {
	command : new Valichain().default('play')
		._$isNotNil().msg("Must not be null nor undefined")
		.s$trim()
		.v$isIn(['play', 'pause']).msg("Must be one of play or pause")
};
var data = {
	// command : ''
};


var v = V(rules, data);
if (v.valid) data = _.mapValues(v.values, function(v) { return v.value; });
else data = null;

console.log(data);
