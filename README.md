# Valichain

Validator chain which wraps several functions of String, lodash and chriso/validator


## Installation

`npm install valichain`


## Usage

~~~javascript
    var Valichain = require("valichain");
    var _ = require("lodash");

    // Reusable rules
    var rules = {
        command : new Valichain().default('play')
            ._$isNotNil().msg("Must not be null nor undefined")
            .s$trim()
            .v$isIn(['play', 'pause']).msg("Must be one of play or pause")
    };
    var data = {
        // command : ''
    };

    var V = Valichain.validate;
    var v = V(rules, data);
    if (v.valid) data = _.mapValues(v.values, function(v) { return v.value; });
    else data = null;

    console.log(data);
~~~


## Documentation

Several methods of String, lodash and chriso/validator are wrapped and used with a prefix followed by a '$'. The first argument of the wrapped function is automatically replaced by the current value being validated, so do not pass it.

- String's functions:
    - x.trim() => `new V().s$trim().validate(x)`

- lodash's functions:
    - _.isNumber(x) => `new V()._$isNumber().validate(x)`

- chriso/validator's functions:
    - validator.isEmail(x) => `new V().v$isEmail().validate(x)`


### List of wrapped functions

<pre>
Sanitizer: s$trim   ==> String.prototype.trim
Sanitizer: s$toLowerCase   ==> String.prototype.toLowerCase
Sanitizer: s$toUpperCase   ==> String.prototype.toUpperCase
Validator: s$startsWith   ==> String.prototype.startsWith
Validator: s$notStartsWith   ==> String.prototype.!startsWith
Validator: s$endsWith   ==> String.prototype.endsWith
Validator: s$notEndsWith   ==> String.prototype.!endsWith
Validator: _$isArguments   ==> _.isArguments
Validator: _$isNotArguments   ==> _.!isArguments
Validator: _$isArray   ==> _.isArray
Validator: _$isNotArray   ==> _.!isArray
Validator: _$isArrayBuffer   ==> _.isArrayBuffer
Validator: _$isNotArrayBuffer   ==> _.!isArrayBuffer
Validator: _$isArrayLike   ==> _.isArrayLike
Validator: _$isNotArrayLike   ==> _.!isArrayLike
Validator: _$isArrayLikeObject   ==> _.isArrayLikeObject
Validator: _$isNotArrayLikeObject   ==> _.!isArrayLikeObject
Validator: _$isBoolean   ==> _.isBoolean
Validator: _$isNotBoolean   ==> _.!isBoolean
Validator: _$isDate   ==> _.isDate
Validator: _$isNotDate   ==> _.!isDate
Validator: _$isElement   ==> _.isElement
Validator: _$isNotElement   ==> _.!isElement
Validator: _$isEmpty   ==> _.isEmpty
Validator: _$isNotEmpty   ==> _.!isEmpty
Validator: _$isEqual   ==> _.isEqual
Validator: _$isNotEqual   ==> _.!isEqual
Validator: _$isEqualWith   ==> _.isEqualWith
Validator: _$isNotEqualWith   ==> _.!isEqualWith
Validator: _$isError   ==> _.isError
Validator: _$isNotError   ==> _.!isError
Validator: _$isFinite   ==> _.isFinite
Validator: _$isNotFinite   ==> _.!isFinite
Validator: _$isFunction   ==> _.isFunction
Validator: _$isNotFunction   ==> _.!isFunction
Validator: _$isInteger   ==> _.isInteger
Validator: _$isNotInteger   ==> _.!isInteger
Validator: _$isLength   ==> _.isLength
Validator: _$isNotLength   ==> _.!isLength
Validator: _$isMap   ==> _.isMap
Validator: _$isNotMap   ==> _.!isMap
Validator: _$isMatch   ==> _.isMatch
Validator: _$isNotMatch   ==> _.!isMatch
Validator: _$isMatchWith   ==> _.isMatchWith
Validator: _$isNotMatchWith   ==> _.!isMatchWith
Validator: _$isNaN   ==> _.isNaN
Validator: _$isNotNaN   ==> _.!isNaN
Validator: _$isNative   ==> _.isNative
Validator: _$isNotNative   ==> _.!isNative
Validator: _$isNil   ==> _.isNil
Validator: _$isNotNil   ==> _.!isNil
Validator: _$isNull   ==> _.isNull
Validator: _$isNotNull   ==> _.!isNull
Validator: _$isNumber   ==> _.isNumber
Validator: _$isNotNumber   ==> _.!isNumber
Validator: _$isObject   ==> _.isObject
Validator: _$isNotObject   ==> _.!isObject
Validator: _$isObjectLike   ==> _.isObjectLike
Validator: _$isNotObjectLike   ==> _.!isObjectLike
Validator: _$isPlainObject   ==> _.isPlainObject
Validator: _$isNotPlainObject   ==> _.!isPlainObject
Validator: _$isRegExp   ==> _.isRegExp
Validator: _$isNotRegExp   ==> _.!isRegExp
Validator: _$isSafeInteger   ==> _.isSafeInteger
Validator: _$isNotSafeInteger   ==> _.!isSafeInteger
Validator: _$isSet   ==> _.isSet
Validator: _$isNotSet   ==> _.!isSet
Validator: _$isString   ==> _.isString
Validator: _$isNotString   ==> _.!isString
Validator: _$isSymbol   ==> _.isSymbol
Validator: _$isNotSymbol   ==> _.!isSymbol
Validator: _$isTypedArray   ==> _.isTypedArray
Validator: _$isNotTypedArray   ==> _.!isTypedArray
Validator: _$isUndefined   ==> _.isUndefined
Validator: _$isNotUndefined   ==> _.!isUndefined
Validator: _$isWeakMap   ==> _.isWeakMap
Validator: _$isNotWeakMap   ==> _.!isWeakMap
Validator: _$isWeakSet   ==> _.isWeakSet
Validator: _$isNotWeakSet   ==> _.!isWeakSet
Sanitizer: _$toArray   ==> _.toArray
Sanitizer: _$toPath   ==> _.toPath
Sanitizer: _$toPlainObject   ==> _.toPlainObject
Sanitizer: _$toFinite   ==> _.toFinite
Sanitizer: _$toInteger   ==> _.toInteger
Sanitizer: _$toLength   ==> _.toLength
Sanitizer: _$toLower   ==> _.toLower
Sanitizer: _$toNumber   ==> _.toNumber
Sanitizer: _$toSafeInteger   ==> _.toSafeInteger
Sanitizer: _$toString   ==> _.toString
Sanitizer: _$toUpper   ==> _.toUpper
Validator: v$equals   ==> chriso/validator.equals
Validator: v$notEquals   ==> chriso/validator.!equals
Validator: v$contains   ==> chriso/validator.contains
Validator: v$notContains   ==> chriso/validator.!contains
Validator: v$matches   ==> chriso/validator.matches
Validator: v$notMatches   ==> chriso/validator.!matches
Validator: v$isEmail   ==> chriso/validator.isEmail
Validator: v$isNotEmail   ==> chriso/validator.!isEmail
Validator: v$isURL   ==> chriso/validator.isURL
Validator: v$isNotURL   ==> chriso/validator.!isURL
Validator: v$isMACAddress   ==> chriso/validator.isMACAddress
Validator: v$isNotMACAddress   ==> chriso/validator.!isMACAddress
Validator: v$isIP   ==> chriso/validator.isIP
Validator: v$isNotIP   ==> chriso/validator.!isIP
Validator: v$isFDQN   ==> chriso/validator.isFDQN
Validator: v$isNotFDQN   ==> chriso/validator.!isFDQN
Validator: v$isBoolean   ==> chriso/validator.isBoolean
Validator: v$isNotBoolean   ==> chriso/validator.!isBoolean
Validator: v$isAlpha   ==> chriso/validator.isAlpha
Validator: v$isNotAlpha   ==> chriso/validator.!isAlpha
Validator: v$isAlphanumeric   ==> chriso/validator.isAlphanumeric
Validator: v$isNotAlphanumeric   ==> chriso/validator.!isAlphanumeric
Validator: v$isNumeric   ==> chriso/validator.isNumeric
Validator: v$isNotNumeric   ==> chriso/validator.!isNumeric
Validator: v$isLowercase   ==> chriso/validator.isLowercase
Validator: v$isNotLowercase   ==> chriso/validator.!isLowercase
Validator: v$isUppercase   ==> chriso/validator.isUppercase
Validator: v$isNotUppercase   ==> chriso/validator.!isUppercase
Validator: v$isAscii   ==> chriso/validator.isAscii
Validator: v$isNotAscii   ==> chriso/validator.!isAscii
Validator: v$isFullWidth   ==> chriso/validator.isFullWidth
Validator: v$isNotFullWidth   ==> chriso/validator.!isFullWidth
Validator: v$isHalfWidth   ==> chriso/validator.isHalfWidth
Validator: v$isNotHalfWidth   ==> chriso/validator.!isHalfWidth
Validator: v$isVariableWidth   ==> chriso/validator.isVariableWidth
Validator: v$isNotVariableWidth   ==> chriso/validator.!isVariableWidth
Validator: v$isMultibyte   ==> chriso/validator.isMultibyte
Validator: v$isNotMultibyte   ==> chriso/validator.!isMultibyte
Validator: v$isSurrogatePair   ==> chriso/validator.isSurrogatePair
Validator: v$isNotSurrogatePair   ==> chriso/validator.!isSurrogatePair
Validator: v$isInt   ==> chriso/validator.isInt
Validator: v$isNotInt   ==> chriso/validator.!isInt
Validator: v$isFloat   ==> chriso/validator.isFloat
Validator: v$isNotFloat   ==> chriso/validator.!isFloat
Validator: v$isDecimal   ==> chriso/validator.isDecimal
Validator: v$isNotDecimal   ==> chriso/validator.!isDecimal
Validator: v$isHexadecimal   ==> chriso/validator.isHexadecimal
Validator: v$isNotHexadecimal   ==> chriso/validator.!isHexadecimal
Validator: v$isDivisibleBy   ==> chriso/validator.isDivisibleBy
Validator: v$isNotDivisibleBy   ==> chriso/validator.!isDivisibleBy
Validator: v$isHexColor   ==> chriso/validator.isHexColor
Validator: v$isNotHexColor   ==> chriso/validator.!isHexColor
Validator: v$isJSON   ==> chriso/validator.isJSON
Validator: v$isNotJSON   ==> chriso/validator.!isJSON
Validator: v$isNull   ==> chriso/validator.isNull
Validator: v$isNotNull   ==> chriso/validator.!isNull
Validator: v$isLength   ==> chriso/validator.isLength
Validator: v$isNotLength   ==> chriso/validator.!isLength
Validator: v$isByteLength   ==> chriso/validator.isByteLength
Validator: v$isNotByteLength   ==> chriso/validator.!isByteLength
Validator: v$isUUID   ==> chriso/validator.isUUID
Validator: v$isNotUUID   ==> chriso/validator.!isUUID
Validator: v$isMongoId   ==> chriso/validator.isMongoId
Validator: v$isNotMongoId   ==> chriso/validator.!isMongoId
Validator: v$isDate   ==> chriso/validator.isDate
Validator: v$isNotDate   ==> chriso/validator.!isDate
Validator: v$isAfter   ==> chriso/validator.isAfter
Validator: v$isNotAfter   ==> chriso/validator.!isAfter
Validator: v$isBefore   ==> chriso/validator.isBefore
Validator: v$isNotBefore   ==> chriso/validator.!isBefore
Validator: v$isIn   ==> chriso/validator.isIn
Validator: v$isNotIn   ==> chriso/validator.!isIn
Validator: v$isCreditCard   ==> chriso/validator.isCreditCard
Validator: v$isNotCreditCard   ==> chriso/validator.!isCreditCard
Validator: v$isISIN   ==> chriso/validator.isISIN
Validator: v$isNotISIN   ==> chriso/validator.!isISIN
Validator: v$isISBN   ==> chriso/validator.isISBN
Validator: v$isNotISBN   ==> chriso/validator.!isISBN
Validator: v$isMobilePhone   ==> chriso/validator.isMobilePhone
Validator: v$isNotMobilePhone   ==> chriso/validator.!isMobilePhone
Validator: v$isCurrency   ==> chriso/validator.isCurrency
Validator: v$isNotCurrency   ==> chriso/validator.!isCurrency
Validator: v$isBase64   ==> chriso/validator.isBase64
Validator: v$isNotBase64   ==> chriso/validator.!isBase64
Validator: v$isDataURI   ==> chriso/validator.isDataURI
Validator: v$isNotDataURI   ==> chriso/validator.!isDataURI
Validator: v$isWhitelisted   ==> chriso/validator.isWhitelisted
Validator: v$isNotWhitelisted   ==> chriso/validator.!isWhitelisted
Sanitizer: v$toDate   ==> chriso/validator.toDate
Sanitizer: v$toFloat   ==> chriso/validator.toFloat
Sanitizer: v$toInt   ==> chriso/validator.toInt
Sanitizer: v$toBoolean   ==> chriso/validator.toBoolean
Sanitizer: v$ltrim   ==> chriso/validator.ltrim
Sanitizer: v$rtrim   ==> chriso/validator.rtrim
Sanitizer: v$trim   ==> chriso/validator.trim
Sanitizer: v$escape   ==> chriso/validator.escape
Sanitizer: v$unescape   ==> chriso/validator.unescape
Sanitizer: v$stripLow   ==> chriso/validator.stripLow
Sanitizer: v$whitelist   ==> chriso/validator.whitelist
Sanitizer: v$blacklist   ==> chriso/validator.blacklist
Sanitizer: v$normalizeEmail   ==> chriso/validator.normalizeEmail
Sanitizer: v$toString   ==> chriso/validator.toString
</pre>


## License

MIT: [LICENSE](LICENSE).


