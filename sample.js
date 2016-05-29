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


data = Valichain.extract(Valichain.validate(rules, data));

console.log(data);
