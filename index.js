var v = require('validator');
var lo = require('lodash');
var log = false ? console.log : function(){};



/**
 * @description A validator.
 * If input is given, creates a synchronous simple validator, which works once.
 * If input is not given, creates a deferred validator, which works multiple 
 * times by calling its {@link Valichain#validate} method.
 * @constructor
 * @param [input] - the input value to be validated
 */
function Valichain(input) {

	if (lo.isUndefined(input)) this.deferred = [];

// console.log('this', this);
	this.resettable = true;
	this.init(input);
	delete this.resettable;
// console.log('this', this);
}



////////////////////////////////////////////////////
// Helper hidden global functions
////////////////////////////////////////////////////


function buildValidatorFunction(f, fnInfo, negate) {	// this does not matter here
	negate = lo.isNil(negate) ? false : negate == true;

	var res = function deferredValidator() {	// this is the Valichain instance
		log('At deferredValidator():', fnInfo);
		var args = arguments;

		var fn = function actualValidator() { // this is the Valichain instance
			log('At actualValidator():', fnInfo, ' / input', this.value);
			if (!this.validating()) return this;	// stop validating

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

	var res = function deferredSanitizer() {	// this is the Valichain instance
		log('At deferredSanitizer():', fnInfo);
		var args = arguments;

		var fn = function actualSanitizer() {	// this is the Valichain instance
			log('At actualSanitizer():', fnInfo, ' / input', this.value);
			if (!this.validating()) return this;	// stop validating
			
			this.value = (fnInfo.context === null) ?
			             f.apply(this.value, args) :	// works for String's functions
			             f.bind(fnInfo.context, this.value).apply(fnInfo.context, args);
			this.chain.push(fnInfo.newName);
			this.valid = true;
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


function negateFunctionName(name) {
	if (name.indexOf('is') == 0) name = "isNot" + name.substring(2);
	else name = "not" + capitalizeFirstLetter(name);
	return name;
}



////////////////////////////////////////////////////
// Valichain static methods
////////////////////////////////////////////////////


/**
 * Registers a function to be used by any new instance.
 * The registered function will be accessed as <prefix>$<fn.name>
 *
 * @param {*} context - object which will be the this reference when fn is called.
 *    If null, the this object will the current value.
 * @param {string} scope - a string which scope the function name.
 * @param {string} prefix - function name prefix.
 * @param {function} fn - the function wihch will be called. Should have a fn.name property.
 * @param {string}  type - "validator" or "sanitizer".
 */
Valichain.register = function(context, scope, prefix, fn, type) {

	var fnInfo = buildFunctionInfo(context, scope, prefix, fn.name);

	if (fnInfo.newName in Valichain.prototype)
		throw new Error(`Function '${name}' already exists in Valichain prototype!`);

	if (type === 'validator') {
		Valichain.prototype[fnInfo.newName] = buildValidatorFunction(fn, fnInfo, false);

		fnInfo = buildNegatedFunctionInfo(context, scope, prefix, fn.name);
		Valichain.prototype[fnInfo.newName] = buildValidatorFunction(fn, fnInfo, true);
	}
	else {
		Valichain.prototype[fnInfo.newName] = buildSanitizerFunction(fn, fnInfo);
	}
                
	log('declare: ', fnInfo.newName, '->', fn.name, fnInfo);
};


Valichain.listFunctions = function() {
	lo(Valichain.prototype)
		.filter(function(e, k) {
			return lo.isFunction(e);
		})
		.each(function(f) {
			var i = f.info;
			if (i)
				console.log(`${f.name.replace('deferred','')}: ${i.newName}   ==> ${i.scope}${i.originalName}`);
		})
};



/**
 Validate a data map against a rules map.
 Both have to match the keys and have no nested rules.

 @param {object} rules - The rules map.
 @param {object} data - The data set to be validated.
 @returns {map} map containing a valid (boolean) field and a values (map) field.
 */
Valichain.validate = function ValichainValidator(rules, data) {

	// if (!_.is)

	var outerVal = {
		values : {},
		valid : null,
	};

	lo(rules).each(function(v, k) {
		if (v.constructor.name != "Valichain")
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


/**
 * Extracts and returns the final values of an validated rules map,
 * or null if the given input was not valid.
 *
 * @param {object} v - object returned by {@link Valichain.validate}.
 * @return {map} null if v is invalid, or a map with param names as keys and final values as values.
 */
Valichain.extract = function(v) {
	return lo.isObject(v) && v.valid
		? _.mapValues(v.values, function(v) { return v.value; })
		: null;
};



////////////////////////////////////////////////////
// Valichain instance methods
////////////////////////////////////////////////////


/**
 * Validates some input against this validator instance.
 * The result may be checked using valid, value, fail and what fields.
 *
 * @param input - The input value to be validated.
 * @return {Valichain} this - the same validator instance.
 */
Valichain.prototype.validate = function(input) {
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

	// console.log(this);
	return this;
};


Valichain.prototype.reset = function() {
	if (!this.deferred && !this.resettable)
		throw new Error("Synchronous validator cannot be reset. Create a deferred one.");

	// console.log('reset/this', this);
	this.valid = null;
	this.chain = [];

	delete this.fail;
	delete this.what;
	delete this.input;
	delete this.value;
	delete this._validating;
	// console.log('reset/this', this);

	return this;
};

Valichain.prototype.init = function(input) {
	// console.log('init/this', this);
	this.reset();
	// console.log('init/this', this);

	if (!lo.isUndefined(input)) {
		this.input = input;
		this.value = input;
	}
	// console.log('init/this', this);
};


/**
 * Defines the message for the last validation function.
 * It is put on what field if validation fails for such a validation function.
 *
 * @param {string} message - the message.
 * @return {Valichain} this - the same validator instance for chaining.
 */
Valichain.prototype.msg = function(message) {
	if (!lo.isNil(this.deferred) && lo.isUndefined(this.input)) {
		if (lo.isNil(this.messages)) this.messages = [];
		this.messages[this.deferred.length - 1] = message;
	}
	else {
		this.what = message;
	}

	return this;
};



Valichain.prototype.validating = function validating() {
	// console.log('is validating: ', this.valid, this.chain);
	return (this.valid !== false && this._validating !== false);
};



/**
 * Defines the default value for a optional input value.
 * It is applied when the checkFn evaluates to true for the input value.
 *
 * @param {*} value - the default value.
 * @param {function} [checkFn={@link Valichain.$.isNilOrEmptyString}] - the static function which 
 *    evaluates to true if the input value is considered absent.
 * @return {Valichain} this - the same validator instance for chaining.
 */
Valichain.prototype.default = function(value, checkFn) {
	log('Valichain.prototype.default:this', this);

	if (!this.validating()) return this;	// stop validating
	if (this.valid !== null)
		throw new Error("Valichain.default() cannot be called after validation has started!");

	// var args = arguments;

	checkFn = lo.isUndefined(checkFn) ? Valichain.$.isNilOrEmptyString : checkFn;

	var fn = function defaultSanitizer() {	// this is the Valichain instance
		log('At defaultSanitizer():', ' / input', this.value);

		if (!this.validating()) return this;	// stop validating
		if (this.valid !== null)
			throw new Error("Valichain.default() cannot be called after validation has started!");

		if (checkFn(this.value)) {
			this.value = value;
			this.valid = true;
			this._validating = false;
		}
		this.chain.push('default');
	};

	if (lo.isUndefined(this.input)) this.deferred.push(fn);
	else fn.call(this);

	return this;
};


/**
 * Defines a custom validation function for this instance of Valichain.
 * If you want a validation function which works for several instances,
 * consider register one using {@link Valichain.register}.
 *
 * @param {function} fn - the function which receives an value of any type.
 *    The return value must be a boolean for validation functions,
 *    or any for sanitization functions.
 * @param {string} type - "validator" or "sanitizer".
 * @param {string} [name] - the function name. If not given, fn.name is used.
 *    If fn.name also is undefined uses an auto-generated name.
 * @return {Valichain} this - the same validator instance for chaining.
 */
Valichain.prototype.custom = function(fn, type, name) {

	var fnInfo = buildFunctionInfo(global, "custom.", "", name || fn.name || "custom" + lo.random(1000,9999));

	if (fnInfo.newName in Valichain.prototype)
		throw new Error(`Function '${name}' already exists in Valichain prototype!`);

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



/**
 * Valichain utility functions
 * @namespace Valichain.$
 * @summary Valichain utility functions
 */
Valichain.$ = {
	/**
	 * Returns true if argument is null, undefined or empty string.
	 *
	 * @param {*} v - the value to be tested
	 * @return {boolean} true if nil or "", false otherwise.
	 * 
	 * @memberof Valichain.$
	 * @static
	 */
	isNilOrEmptyString : function(v) {
		return lo.isNil(v) || (lo.isString(v) && lo.isEmpty(v));
	},

	/**
	 * Returns true if argument is null or empty string.
	 *
	 * @param {*} v - the value to be tested
	 * @return {boolean} true if null or "", false otherwise.
	 * 
	 * @memberof Valichain.$
	 * @static
	 */
	isNullOrEmptyString : function(v) {
		return lo.isNull(v) || (lo.isString(v) && lo.isEmpty(v));
	},

	/**
	 * Returns true if argument is not nil primitive. A not nil primitive is
	 * a boolean, number or string, but neither null, undefined nor object.
	 *
	 * @param {*} v - the value to be tested
	 * @return {boolean} true if boolean, number or string, false otherwise.
	 * 
	 * @memberof Valichain.$
	 * @static
	 */
	isNotNilPrimitive : function(v) {
		return !lo.isNil(v)
		       && (lo.isString(v) || lo.isNumber(v) || lo.isBoolean)
		       && !lo.isObject(v);
	},
};




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
		Valichain.register(null, "String.prototype.", "s", f, 'sanitizer');
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
		Valichain.register(null, "String.prototype.", "s", f, 'validator');
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
		Valichain.register(lo, "_.", "_", f, 'validator');
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
		Valichain.register(lo, "_.", "_", f, 'sanitizer');
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
		Valichain.register(v, "chriso/validator.", "v", f, 'validator');
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
		Valichain.register(v, "chriso/validator.", "v", f, 'sanitizer');
	});
})();


//// Wraps Valichain utility functions as validators functions
(function() {
	var exclude = [];
	var include = [];
	lo(Valichain.$)
	.filter(function(f, i) {
		return lo.isFunction(f)
		    && (!v.isIn(f.name, exclude)
		        && f.name.startsWith('is')
		        || v.isIn(f.name, include));
	})
	.each(function(f, i) {
		Valichain.register(Valichain, "Valichain.$.", "u", f, 'validator');
	});
})();

////////////////////////////////////////////////////



module.exports = Valichain;
