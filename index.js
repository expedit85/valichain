var v = require('validator');
var lo = require('lodash');
var log = false ? console.log : function(){};

function Validata(input) {

	if (lo.isUndefined(input)) this.deferred = [];

// console.log('this', this);
	this.resettable = true;
	this.init(input);
	delete this.resettable;
// console.log('this', this);
}


function buildValidatorFunction(f, fnInfo, negate) {	// this does not matter here
	negate = lo.isNil(negate) ? false : negate == true;

	var res = function deferredValidator() {	// this is the Validata instance
		log('At deferredValidator():', fnInfo);
		var args = arguments;

		var fn = function actualValidator() { // this is the Validata instance
			log('At actualValidator():', fnInfo, ' / input', this.value);
			if (this.valid === false) return this;	// stop validating

			var result = (fnInfo.context === null) ?
			             f.apply(this.value, args) :	  // works for String's functions
			             f.bind(fnInfo.context, this.value).apply(fnInfo.context, args);
			if (negate) result = !result;

			if (!result) {
				this.fail = fnInfo.newName;
				this.valid = false;
				if (!lo.isNil(this.messages)) this.what = this.messages[this.chain.length];
			}
			else {
				this.chain.push(fnInfo.newName);
				this.valid = true;
			}
		};
		fn.info = fnInfo;	// helps debugging

		if (lo.isUndefined(this.input)) this.deferred.push(fn);
		else fn.call(this);

		return this;
	};
	res.info = fnInfo;

	return res;
}


function buildSanitizerFunction(f, fnInfo) {	// this does not matter here

	var res = function deferredSanitizer() {	// this is the Validata instance
		log('At deferredSanitizer():', fnInfo);
		var args = arguments;

		var fn = function actualSanitizer() {	// this is the Validata instance
			log('At actualSanitizer():', fnInfo, ' / input', this.value);
			if (this.valid === false) return this;	// stop validating
			
			this.value = (fnInfo.context === null) ?
			             f.apply(this.value, args) :	// works for String's functions
			             f.bind(fnInfo.context, this.value).apply(fnInfo.context, args);
			this.chain.push(fnInfo.newName);
		};
		fn.info = fnInfo;	// helps debugging

		if (lo.isUndefined(this.input)) this.deferred.push(fn);
		else fn.call(this);

		return this;
	};
	res.info = fnInfo;

	return res;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function buildFunctionInfo(context, scope, prefix, name) {
	return {
		context : context,
		scope : scope,
		originalName : name,
		newName : (prefix === null || prefix === "") ?
		          name :
		          prefix + '$' + name,
	};
}


function buildNegatedFunctionInfo(context, scope, prefix, name) {
	return {
		context : context,
		scope : scope + "!",
		originalName : name,
		newName : prefix + '$' + negateFunctionName(name),
	};
}

Validata.declareFunction = function(context, scope, prefix, fn, type) {

	var fnInfo = buildFunctionInfo(context, scope, prefix, fn.name);

	if (fnInfo.newName in Validata.prototype)
		throw new Error(`Function '${name}' already exists in Validata prototype!`);

	if (type === 'validator') {
		Validata.prototype[fnInfo.newName] = buildValidatorFunction(fn, fnInfo, false);

		fnInfo = buildNegatedFunctionInfo(context, scope, prefix, fn.name);
		Validata.prototype[fnInfo.newName] = buildValidatorFunction(fn, fnInfo, true);
	}
	else {
		Validata.prototype[fnInfo.newName] = buildSanitizerFunction(fn, fnInfo);
	}
                
	log('declare: ', fnInfo.newName, '->', fn.name, fnInfo);
};


Validata.listFunctions = function() {
	lo(Validata.prototype)
		.filter(function(e, k) {
			return lo.isFunction(e);
		})
		.each(function(f) {
			var i = f.info;
			if (i)
				console.log(`${f.name.replace('deferred','')}: ${i.newName}   ==> ${i.scope}${i.originalName}`);
		})
};


function negateFunctionName(name) {
	if (name.indexOf('is') == 0) name = "isNot" + name.substring(2);
	else name = "not" + capitalizeFirstLetter(name);
	return name;
}



////////////////////////////////////////////////////
// Thirdp-party functions wrapping
////////////////////////////////////////////////////


//// Wraps some String functions as sanitizers functions
(function() {
	var tmp;
	lo([
		String.prototype.trim,
		String.prototype.toLowerCase,
		String.prototype.toUpperCase,
	])
	.each(function(f, i) {
		Validata.declareFunction(null, "String.prototype.", "s", f, 'sanitizer');
	});
})();


//// Wraps some String functions as validators functions
(function() {
	var tmp;
	lo([
		String.prototype.startsWith,
		String.prototype.endsWith,
	])
	.each(function(f, i) {
		Validata.declareFunction(null, "String.prototype.", "s", f, 'validator');
	});
})();


//// Wraps some lodash functions as validators functions
(function() {
	var exclude = [];
	var include = [];
	lo(lo)
	.filter(function(f, i) {
		return lo.isFunction(f)
		    && (!v.isIn(f.name, exclude)
		        && f.name.startsWith('is')
		        || v.isIn(f.name, include));
	})
	.each(function(f, i) {
		Validata.declareFunction(lo, "_.", "_", f, 'validator');
	});
})();


//// Wraps some lodash functions as sanitizers functions
(function() {
	var exclude = [];
	var include = [];
	lo(lo)
	.filter(function(f, i) {
		return lo.isFunction(f)
		    && (!v.isIn(f.name, exclude)
		        && f.name.startsWith('to')
		        || v.isIn(f.name, include));
	})
	.each(function(f, i) {
		Validata.declareFunction(lo, "_.", "_", f, 'sanitizer');
	});
})();


//// Wraps some chriso/validator.s functions as validators functions
(function() {
	var exclude = [];
	var include = ['matches', 'contains', 'equals'];
	lo(v)
	.filter(function(f, i) {
		return lo.isFunction(f)
		    && (!v.isIn(f.name, exclude)
		        && f.name.startsWith('is')
		        || v.isIn(f.name, include));
	})
	.each(function(f, i) {
		Validata.declareFunction(v, "chriso/validator.", "v", f, 'validator');
	});
})();

//// Wraps some chriso/validator.s functions as sanitizers functions
(function() {
	var exclude = [];
	var include = [
			'blacklist', 'whitelist',
			'escape', 'unescape',
			'trim', 'ltrim', 'rtrim',
			'normalizeEmail',
			'stripLow'
		];
	lo(v)
	.filter(function(f, i) {
		return lo.isFunction(f)
		    && (!v.isIn(f.name, exclude)
		        && f.name.startsWith('to')
		        || v.isIn(f.name, include));
	})
	.each(function(f, i) {
		Validata.declareFunction(v, "chriso/validator.", "v", f, 'sanitizer');
	});
})();

////////////////////////////////////////////////////


Validata.prototype.validate = function(input) {
	// console.log(`validate("${input}")`);
	// console.log('validate/this', this);
	this.init(input);
	// console.log('validate/this', this);

	var self = this;
	lo(this.deferred).each(function(f) {
		var i = f.info;
		if (i)
			log(`${f.name + ":" + i.newName}.call(self, ${self.value}::${typeof self.value})`);
		f.call(self, self.value);
	});

	return this;
};

Validata.prototype.reset = function() {
	if (!this.deferred && !this.resettable)
		throw new Error("Synchronous validator cannot be reset. Create a deferred one.");

	// console.log('reset/this', this);
	this.valid = null;
	this.chain = [];

	delete this.fail;
	delete this.what;
	delete this.input;
	delete this.value;
	// console.log('reset/this', this);

	return this;
};

Validata.prototype.init = function(input) {
	// console.log('init/this', this);
	this.reset();
	// console.log('init/this', this);

	if (!lo.isUndefined(input)) {
		this.input = input;
		this.value = input;
	}
	// console.log('init/this', this);
};


Validata.prototype.msg = function(message) {
	if (!lo.isNil(this.deferred) && lo.isUndefined(this.input)) {
		if (lo.isNil(this.messages)) this.messages = [];
		this.messages[this.deferred.length - 1] = message;
	}
	else {
		this.what = message;
	}

	return this;
};



Validata.prototype.default = function(value, checkFn) {
	log('Validata.prototype.default:this', this);

	if (this.valid === false) return this;	// stop validating
	if (this.valid !== null)
		throw new Error("Validata.default() cannot be called after validation has started!");

	// var args = arguments;

	checkFn = lo.isUndefined(checkFn) ? Validata.$.isNilOrEmptyString : checkFn;

	var fn = function defaultSanitizer() {	// this is the Validata instance
		log('At defaultSanitizer():', ' / input', this.value);

		if (this.valid === false) return this;	// stop validating
		if (this.valid !== null)
			throw new Error("Validata.default() cannot be called after validation has started!");

		if (checkFn(this.value))
			this.value = value;
		this.chain.push('default');
	};

	if (lo.isUndefined(this.input)) this.deferred.push(fn);
	else fn.call(this);

	return this;
};


Validata.prototype.custom = function(fn, type, name) {

	var fnInfo = buildFunctionInfo(global, "custom.", "", name || fn.name || "custom" + lo.random(1000,9999));

	if (fnInfo.newName in Validata.prototype)
		throw new Error(`Function '${name}' already exists in Validata prototype!`);

	if (type === 'validator') {
		buildValidatorFunction(fn, fnInfo, false).call(this);
	}
	else {
		buildSanitizerFunction(fn, fnInfo).call(this);
	}

                
	log('custom: ', fnInfo.newName, '->', fn.name, fnInfo.context.constructor.name, fnInfo.originalName);

	// if (lo.isUndefined(this.input)) this.deferred.push(fn);
	// else fn.call(this, this.value);

	// console.log(fn);
	// console.log(this.deferred);

	return this;
};


// TODO
// default(value)



/**
DONE validata(input)         -- synchronous simple validation
DONE validata(params, rules) -- synchronous rule set validation against params
DONE validata()              -- deferred validation, requires to call validate() later

TODO validata(rules)         -- deferred rule set validation
TODO validata(rules, data) -- synchronous rule set validation against params

 */

Validata.validate = function ValidataValidator(rules, data) {

	var rules = arguments[0];
	var data = arguments[1];

	var outerVal = {
		values : {},
		valid : null,
	};

	lo(rules).each(function(v, k) {
		if (v.constructor !== Validata)
			throw new Error("invalid rule for " + k);

		// console.log('At validata(params, rules)', k, params[k], v);
		if (!v.validate(data[k]).valid) {
			outerVal.valid = false;
		}

		outerVal.values[k] = {
				input : data[k],
				value : v.value,
				chain : v.chain,
				fail : v.fail,
				what : v.what,
				valid : v.valid
			};
	});

	if (outerVal.valid === null) {
		outerVal.valid = true;
	}
	return outerVal;
}


// Utility functions
Validata.$ = {
	isNilOrEmptyString : function(v) {
		return lo.isNil(v) || (lo.isString(v) && lo.isEmpty(v));
	},
	isNullOrEmptyString : function(v) {
		return lo.isNull(v) || (lo.isString(v) && lo.isEmpty(v));
	}
};




module.exports = Validata;