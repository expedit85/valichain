<a name="Valichain"></a>

## Valichain
**Kind**: global class  

* [Valichain](#Valichain)
    * [new Valichain([input])](#new_Valichain_new)
    * _instance_
        * [.validate(input)](#Valichain+validate) ⇒ <code>[Valichain](#Valichain)</code>
        * [.msg(message)](#Valichain+msg) ⇒ <code>[Valichain](#Valichain)</code>
        * [.default(value, [checkFn])](#Valichain+default) ⇒ <code>[Valichain](#Valichain)</code>
        * [.custom(fn, type, [name])](#Valichain+custom) ⇒ <code>[Valichain](#Valichain)</code>
    * _static_
        * [.$](#Valichain.$) : <code>object</code>
            * [.isNilOrEmptyString(v)](#Valichain.$.isNilOrEmptyString) ⇒ <code>boolean</code>
            * [.isNullOrEmptyString(v)](#Valichain.$.isNullOrEmptyString) ⇒ <code>boolean</code>
            * [.isNotNilPrimitive(v)](#Valichain.$.isNotNilPrimitive) ⇒ <code>boolean</code>
        * [.register(context, scope, prefix, fn, type)](#Valichain.register)
        * [.validate(rules, data)](#Valichain.validate) ⇒ <code>map</code>
        * [.extract(v)](#Valichain.extract) ⇒ <code>map</code>

<a name="new_Valichain_new"></a>

### new Valichain([input])
A validator.
If input is given, creates a synchronous simple validator, which works once.
If input is not given, creates a deferred validator, which works multiple 
times by calling its [validate](#Valichain+validate) method.


| Param | Description |
| --- | --- |
| [input] | the input value to be validated |

<a name="Valichain+validate"></a>

### valichain.validate(input) ⇒ <code>[Valichain](#Valichain)</code>
Validates some input against this validator instance.
The result may be checked using valid, value, fail and what fields.

**Kind**: instance method of <code>[Valichain](#Valichain)</code>  
**Returns**: <code>[Valichain](#Valichain)</code> - this - the same validator instance.  

| Param | Description |
| --- | --- |
| input | The input value to be validated. |

<a name="Valichain+msg"></a>

### valichain.msg(message) ⇒ <code>[Valichain](#Valichain)</code>
Defines the message for the last validation function.
It is put on what field if validation fails for such a validation function.

**Kind**: instance method of <code>[Valichain](#Valichain)</code>  
**Returns**: <code>[Valichain](#Valichain)</code> - this - the same validator instance for chaining.  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | the message. |

<a name="Valichain+default"></a>

### valichain.default(value, [checkFn]) ⇒ <code>[Valichain](#Valichain)</code>
Defines the default value for a optional input value.
It is applied when the checkFn evaluates to true for the input value.

**Kind**: instance method of <code>[Valichain](#Valichain)</code>  
**Returns**: <code>[Valichain](#Valichain)</code> - this - the same validator instance for chaining.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | the default value. |
| [checkFn] | <code>function</code> | <code>{@link Valichain.$.isNilOrEmptyString}</code> | the static function which     evaluates to true if the input value is considered absent. |

<a name="Valichain+custom"></a>

### valichain.custom(fn, type, [name]) ⇒ <code>[Valichain](#Valichain)</code>
Defines a custom validation function for this instance of Valichain.
If you want a validation function which works for several instances,
consider register one using [register](#Valichain.register).

**Kind**: instance method of <code>[Valichain](#Valichain)</code>  
**Returns**: <code>[Valichain](#Valichain)</code> - this - the same validator instance for chaining.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function which receives an value of any type.    The return value must be a boolean for validation functions,    or any for sanitization functions. |
| type | <code>string</code> | "validator" or "sanitizer". |
| [name] | <code>string</code> | the function name. If not given, fn.name is used.    If fn.name also is undefined uses an auto-generated name. |

<a name="Valichain.$"></a>

### Valichain.$ : <code>object</code>
Valichain utility functions

**Kind**: static namespace of <code>[Valichain](#Valichain)</code>  
**Summary**: Valichain utility functions  

* [.$](#Valichain.$) : <code>object</code>
    * [.isNilOrEmptyString(v)](#Valichain.$.isNilOrEmptyString) ⇒ <code>boolean</code>
    * [.isNullOrEmptyString(v)](#Valichain.$.isNullOrEmptyString) ⇒ <code>boolean</code>
    * [.isNotNilPrimitive(v)](#Valichain.$.isNotNilPrimitive) ⇒ <code>boolean</code>

<a name="Valichain.$.isNilOrEmptyString"></a>

#### $.isNilOrEmptyString(v) ⇒ <code>boolean</code>
Returns true if argument is null, undefined or empty string.

**Kind**: static method of <code>[$](#Valichain.$)</code>  
**Returns**: <code>boolean</code> - true if nil or "", false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | the value to be tested |

<a name="Valichain.$.isNullOrEmptyString"></a>

#### $.isNullOrEmptyString(v) ⇒ <code>boolean</code>
Returns true if argument is null or empty string.

**Kind**: static method of <code>[$](#Valichain.$)</code>  
**Returns**: <code>boolean</code> - true if null or "", false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | the value to be tested |

<a name="Valichain.$.isNotNilPrimitive"></a>

#### $.isNotNilPrimitive(v) ⇒ <code>boolean</code>
Returns true if argument is not nil primitive. A not nil primitive is
a boolean, number or string, but neither null, undefined nor object.

**Kind**: static method of <code>[$](#Valichain.$)</code>  
**Returns**: <code>boolean</code> - true if boolean, number or string, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | the value to be tested |

<a name="Valichain.register"></a>

### Valichain.register(context, scope, prefix, fn, type)
Registers a function to be used by any new instance.
The registered function will be accessed as <prefix>$<fn.name>

**Kind**: static method of <code>[Valichain](#Valichain)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>\*</code> | object which will be the this reference when fn is called.    If null, the this object will the current value. |
| scope | <code>string</code> | a string which scope the function name. |
| prefix | <code>string</code> | function name prefix. |
| fn | <code>function</code> | the function wihch will be called. Should have a fn.name property. |
| type | <code>string</code> | "validator" or "sanitizer". |

<a name="Valichain.validate"></a>

### Valichain.validate(rules, data) ⇒ <code>map</code>
Validate a data map against a rules map.
 Both have to match the keys and have no nested rules.

**Kind**: static method of <code>[Valichain](#Valichain)</code>  
**Returns**: <code>map</code> - map containing a valid (boolean) field and a values (map) field.  

| Param | Type | Description |
| --- | --- | --- |
| rules | <code>object</code> | The rules map. |
| data | <code>object</code> | The data set to be validated. |

<a name="Valichain.extract"></a>

### Valichain.extract(v) ⇒ <code>map</code>
Extracts and returns the final values of an validated rules map,
or null if the given input was not valid.

**Kind**: static method of <code>[Valichain](#Valichain)</code>  
**Returns**: <code>map</code> - null if v is invalid, or a map with param names as keys and final values as values.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>object</code> | object returned by [validate](#Valichain.validate). |

