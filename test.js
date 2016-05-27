var Validata = require("./index.js");
var _ = require("lodash");


// ============================ BEGIN TEST

var regex = /[a-z]+@[a-z]+\.[a-z]+/g;
var param = 54.54;
var email = "    BLA@EMAIL.COM    ";




function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function assertValid(validator) {
	assert(validator.valid, JSON.stringify(validator, null, "  "));
}

function assertNotValid(validator) {
	assert(!validator.valid, JSON.stringify(validator, null, "  "));
}


try {


assertValid(new Validata(param)._$isNotNull()._$toString().v$isDecimal());
assertValid(new Validata("bla@email.com").v$isLowercase().v$isEmail().v$matches(regex));

assertNotValid(new Validata("bla@email.com.br").v$isLowercase().v$isEmail().v$matches(regex));
assertNotValid(new Validata().v$isLowercase().v$isEmail().v$matches(regex).validate(email));



assertNotValid(new Validata("     asfasfsf")
			.s$trim()
			.v$isLowercase().msg("Must be lowercase")
			.v$isEmail().msg("Must be a valid email address"));

assertNotValid(new Validata("        asfasfsZf")
			.s$trim()
			.v$isLowercase().msg("Must be lowercase"));

var va1 = new Validata()
			.v$trim()
			.v$isLowercase().msg("Must be lowercase");

// console.log(va1);

assertNotValid(va1.validate("   adaSfsf"));

va1.reset();
assertValid(va1.validate("   adasfsf"));


// console.log(Validata.prototype);




/////////////////////////////////////////////////////////////////////////////////////////
// TEST multiple calls over the same validation rules
/////////////////////////////////////////////////////////////////////////////////////////


// console.log("==========RULES==================");
var rules = {
	name : new Validata()
			.v$isLength( { min : 3, max: 20} )
			.msg("Must have between 3 and 20 characters")
			.custom(function substring1(v) {
				// console.log(v);
				return v.substring(1,4);	// sanitizers returns a new value
				// return true;
			}, 'sanitizer')
			.custom(function testred(v) {
				// console.log(v);
				return v == "red";	// validators return a boolean
				// return true;
			}, 'validator')
			.msg("Must start with '?red'")
			.v$matches(/^[a-z\. ]+$/).msg('Regex matches')	// --> without 'g' flag!!!
			,
	email : new Validata()
			._$isNotNull().msg("Email is required")
			.s$trim()
			.s$toLowerCase()
			.v$isLowercase().msg("Must be lowercase")
			.v$isEmail().msg("Must be a valid email address"),
	// offset : new Validata()
	// 		.default(0)
	// 		._IsNumber().msg("Must be a number")
	// birthday : validata().isAfter(new Date(new Date().getYear() - 100, 01, 01))
};
// console.log("============================");

var data = {
	name : "Fred Johnson Jr.",
	email : email,
	// birthday : '2000-05-20'
};


var V = Validata.validate;

// console.log(rules);

var x = V(rules, data);
// console.log(JSON.stringify(x));
// console.log(rules.name.deferred);
assertValid(x);


assertValid(V(rules, data));
// console.log("============================");
assertValid(V(rules, data));

data.email = 3444;
assertNotValid(V(rules, data));

data.email = "expedit*gmail.com";
assertNotValid(V(rules, data));

data.email = null;
var x = V(rules, data);
// console.log(x);
assertNotValid(x);




/////////////////////////////////////////////////////////////////////////////////////////
// TEST default values
/////////////////////////////////////////////////////////////////////////////////////////

assertValid(new Validata('  play ').default('play').s$trim().v$isIn(['play', 'pause']));
assertValid(new Validata(null).default('play').s$trim().v$isIn(['play', 'pause']));
assertValid(new Validata("").default('play').s$trim().v$isIn(['play', 'pause']));


var V = Validata.validate;
var rules = {
	command : new Validata().default('play')
		._$isNotNil().msg("Must not be null nor undefined")
		.s$trim()
		.v$isIn(['play', 'pause']).msg("Must be one of play or pause")
};
var data = {
	// command : ''
};

function validate(data) {
	// console.log("============================");
	var v = V(rules, data);
	if (v.valid) data = _.mapValues(v.values, function(v) { return v.value; });
	else data = null;


	// console.log(v);
	// console.log(v.values.command.chain);
	// console.log(data);

	return v;
}


assertValid(validate({}))
assertValid(validate({command : undefined}))
assertValid(validate({command : null}))
assertValid(validate({command : ""}))
assertNotValid(validate({command : 0}))
assertNotValid(validate({command : 455}))
assertNotValid(validate({command : "1"}))
assertValid(validate({command : "play"}))
assertNotValid(validate({command : "stopp"}))


console.log("===== DONE: no errors =======================");


// Validata.listFunctions();


setTimeout(console.log, 1000);



}
catch(err) {
	console.log(err.message);
	console.log(err.stack);
}

