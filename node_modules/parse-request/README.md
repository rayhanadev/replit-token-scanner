# parse-request

[![build status](https://img.shields.io/travis/cabinjs/parse-request.svg)](https://travis-ci.org/cabinjs/parse-request)
[![code coverage](https://img.shields.io/codecov/c/github/cabinjs/parse-request.svg)](https://codecov.io/gh/cabinjs/parse-request)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/cabinjs/parse-request.svg)](LICENSE)

> Parse requests in the Browser and Node (with added support for [multer][] and [passport][]). Made for [Cabin][].


## Table of Contents

* [Install](#install)
* [How does it work](#how-does-it-work)
  * [Credit Card Masking](#credit-card-masking)
  * [Sensitive Field Names Automatically Masked](#sensitive-field-names-automatically-masked)
  * [Sensitive Header Names Automatically Masked](#sensitive-header-names-automatically-masked)
* [Usage](#usage)
  * [VanillaJS](#vanillajs)
  * [Koa](#koa)
  * [Express](#express)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install parse-request
```

[yarn][]:

```sh
yarn add parse-request
```


## How does it work

> **This package is used internally by Cabin's middleware, and we highly recommend you to simply use [Cabin][] instead of this package in particular.**

This package exports a function that accepts an Object `options` argument:

* `options` (Object) - a configuration object
  * `req` (Object) - an Express/Connect request object (defaults to `false`) (you must either pass this option or `ctx` option, but not both)
  * `ctx` (Object) - a Koa context object (defaults to `false`) (you must either pass this option or `req` option, but not both)
  * `responseHeaders` (String or Object) - we highly recommend that you pass `res._headers` (see [Cabin][]'s middleware logic if you need an example of this)
  * `userFields` (Array) - defaults to `[ 'id', 'email', 'full_name', 'ip_address' ]`, list of fields to cherry-pick from the user object parsed out of `req.user`
  * `sanitizeFields` (Array) - defaults to the list of Strings provided under [Sensitive Field Names Automatically Masked](#sensitive-field-names-automatically-masked) below
  * `sanitizeHeaders` (Array) - defaults to the list of Strings provided under [Sensitive Header Names Automatically Masked](#sensitive-header-names-automatically-masked) below (case insensitive)
  * `maskCreditCards` (Boolean) - defaults to `true`, and specifies whether or not credit card numbers are masked
  * `maskBuffers` (Boolean) - defaults to `true`, and will rewrite `Buffer`'s, `ArrayBuffer`'s, and `SharedArrayBuffer`'s recursively as an object of `{ type: <String>, byteLength: <Number> }`.  Note that this will save you on disk log storage size as logs will not output verbose stringified buffers – e.g. imagine a 10MB file image upload sent across the request body as a Buffer!)
  * `maskStreams` (Boolean) - defauls to `true`, and will rewrite `Stream`'s to `{ type: 'Stream' }` (this is useful for those using multer v2.x (streams version), or those that have streams in `req.body`, `req.file`, or `req.files`)
  * `checkId` (Boolean) - defaults to `true`, and prevents Strings that closely resemble primary key ID's from being masked (e.g. properties named `_id`, `id`, `ID`, `product_id`, `product-id`, `productId`, `productID`, and `product[id]` won't get masked or show as a false-positive for a credit card check)
  * `checkCuid` (Boolean) - defaults to `true`, and prevents [cuid][] values from being masked
  * `checkObjectId` (Boolean) - defaults to `true`, and prevents [MongoDB BSON ObjectId][bson-objectid] from being masked
  * `checkUUID` (Boolean) - defaults to `true`, and prevents [uuid][] values from being masked
  * `rfdc` (Object) - defaults to `{ proto: false, circles: false }` (you should not need to customize this, but if necessary refer to [rfdc][] documentation)
  * `parseBody` (Boolean) - defaults to `true`, if you set to `false` we will not parse nor clone the request `body` property (this overrides all other parsing settings related)
  * `parseQuery` (Boolean) - defaults to `true`, if you set to `false` we will not parse nor clone the request `query` property (this overrides all other parsing settings related)
  * `parseFiles` (Boolean) - defaults to `true`, if you set to `false` we will not parse nor clone the request `file` nor `files` properties (this overrides all other parsing settings related)

It automatically detects whether the request is from the Browser, Koa, or Express, and returns a parsed object with populated properties.

Here's an example object parsed:

```js
{
  "id": "5d126d86160cea56950f80a9",
  "timestamp": "2019-06-25T18:52:54.000Z",
  "request": {
    "method": "POST",
    "query": {
      "foo": "bar",
      "beep": "boop"
    },
    "headers": {
      "host": "127.0.0.1:59746",
      "accept-encoding": "gzip, deflate",
      "user-agent": "node-superagent/3.8.3",
      "authorization": "Basic ********************",
      "accept": "application/json",
      "cookie": "foo=bar;beep=boop",
      "content-type": "multipart/form-data; boundary=--------------------------104476455118209968089794",
      "content-length": "1599",
      "connection": "close"
    },
    "cookies": {
      "foo": "bar",
      "beep": "boop"
    },
    "url": "/?foo=bar&beep=boop",
    "body": "{\"product_id\":\"5d0350ef2ca74d11ee6e4f00\",\"name\":\"nifty\",\"surname\":\"lettuce\",\"bank_account_number\":\"1234567890\",\"card\":{\"number\":\"****-****-****-****\"},\"stripe_token\":\"***************\",\"favorite_color\":\"green\"}",
    "timestamp": "2019-06-25T18:52:54.589Z",
    "id": "fbbce5d4-02d9-4a81-9a70-909631317e7d",
    "http_version": "1.1",
    "files": "{\"avatar\":[{\"fieldname\":\"avatar\",\"originalname\":\"avatar.png\",\"encoding\":\"7bit\",\"mimetype\":\"image/png\",\"buffer\":{\"type\":\"Buffer\",\"byteLength\":216},\"size\":216}],\"boop\":[{\"fieldname\":\"boop\",\"originalname\":\"boop-1.txt\",\"encoding\":\"7bit\",\"mimetype\":\"text/plain\",\"buffer\":{\"type\":\"Buffer\",\"byteLength\":7},\"size\":7},{\"fieldname\":\"boop\",\"originalname\":\"boop-2.txt\",\"encoding\":\"7bit\",\"mimetype\":\"text/plain\",\"buffer\":{\"type\":\"Buffer\",\"byteLength\":7},\"size\":7}]}"
  },
  "user": {
    "ip_address": "::ffff:127.0.0.1"
  },
  "response": {
    "headers": {
      "x-powered-by": "Express",
      "x-request-id": "fbbce5d4-02d9-4a81-9a70-909631317e7d",
      "content-security-policy": "default-src 'none'",
      "x-content-type-options": "nosniff",
      "content-type": "text/html; charset=utf-8",
      "content-length": "1213",
      "x-response-time": "48.658ms",
      "date": "Tue, 25 Jun 2019 18:52:54 GMT",
      "connection": "close"
    },
    "http_version": "1.1",
    "status_code": 200,
    "reason_phrase": "OK",
    "timestamp": "2019-06-25T18:52:54.000Z",
    "duration": 48.658
  },
  "duration": 1.350323,
  "app": {
    "name": "parse-request",
    "version": "1.0.11",
    "node": "v10.15.3",
    "hash": "f99bb8f28be5c6dc76bed76f6dd8984accc5c5fa",
    "environment": "test",
    "hostname": "jacks-MacBook-Pro.local",
    "pid": 22165
  }
}
```

A few extra details about the above parsed properties:

* `id` (String) - is a newly created BSON ObjectId used to uniquely identify this log
* `timestamp` (String) - is the [ISO-8601][] date time string parsed from the `id` (thanks to MongoDB BSON `ObjectID.getTimestamp` method)
* `duration` (Number) - is the number of milliseconds that `parseRequest` took to parse the request object (note that this uses `process.hrtime` which this package polyfills thanks to [browser-process-hrtime][])
* `user` (Object) - is parsed from the user object on `req.user` automatically (e.g. you are using [passport][]):
  * `ip_address` (String) - IP address parsed
  * `...` - additional fields are optionally parsed from `req.user`
* `request` (Object) - request object information parsed from `options.req`:
  * `id` (String) - is conditionally added if `req.id` is a String (we highly recommend that you use [express-request-id][] in your project, which will automatically add this property if `X-Request-Id` if it is set, otherwise it will generate it as a new UUID)
  * `file` (Object) - is conditionally added if you have a `req.file` property (e.g. if you're using [multer][])
  * `files` (Array) - is conditionally added if you have a `req.files` property (e.g. if you're using [multer][])
  * `http_version` (String) - is parsed from `req.httpVersion` or `req.httpVersionMajor` and `req.httpVersionMinor`
  * `timesamp` (String) - is the [ISO-8601][] date time string parsed from when the request was received (we highly recommend that you use [request-received][] for this to be parsed as accurately as possible, although we do support a few widely-used fallback approaches)
  * `headers` (Object) - the raw request headers (lowercased)
* `response` (Object) - response object information parsed from `options.responseHeaders` (we use [http-headers][] to parse this information):
  * `http_version` (String) - is parsed from the response HTTP headers major and minor HTTP version
  * `timestamp` (String) - is the [ISO-8601][] date time string parsed from the response's `Date` header
  * `duration` (Number) - is the number of milliseconds parsed from the `X-Response-Time` HTTP header (we highly recommend that you use [response-time][] and [request-received][])
  * `headers` (Object) - the raw response headers (lowercased)
  * `status_code` (Number) - the response's status code (see RFC spec on [Status Code and Reason Phrase][rfc-spec])
  * `reason_phrase` (String) - the response's reason phrase (see RFC spec on [Status Code and Reason Phrase][rfc-spec])

Please see [Credit Card Masking](#credit-card-masking) and [Sensitive Field Names Automatically Masked](#sensitive-field-names-automatically-masked) below for more information about how `request.body`, `request.file`, and `request.files` are parsed and conditionally masked for security.

### Credit Card Masking

We also have built-in credit-card number detection and masking using the [credit-card-type][] library.

This means that credit card numbers (or fields that are very similar to a credit card) will be automatically masked.  If you'd like to turn this off, pass `false` to `maskCreditCards`\*\*

### Sensitive Field Names Automatically Masked

See [sensitive-fields][] for the complete list.

### Sensitive Header Names Automatically Masked

The `Authorization` HTTP header has its `<credentials>` portion automatically masked.

This means that if you are using BasicAuth or JSON Web Tokens ("JWT"), then your tokens will be hidden.


## Usage

We highly recommend to simply use [Cabin][] as this package is built-in!

### VanillaJS

**The browser-ready bundle is only 17 KB (minified and gzipped)**.

The example below uses [xhook][] which is used to intercept HTTP requests made in the browser.

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,Number.isFinite,Object.getOwnPropertySymbols,Symbol.iterator,Symbol.prototype,Symbol.for,Object.assign,Array.from"></script>
<script src="https://unpkg.com/xhook"></script>
<script src="https://unpkg.com/parse-request"></script>
<script type="text/javascript">
  (function() {
    xhook.after(function(req, res) {
      var req = parseRequest({ req });
      console.log('req', req);
      // ...
    });
  })();
</script>
```

#### Required Browser Features

We recommend using <https://polyfill.io> (specifically with the bundle mentioned in [VanillaJS](#vanillajs) above):

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,Number.isFinite,Object.getOwnPropertySymbols,Symbol.iterator,Symbol.prototype,Symbol.for,Object.assign,Array.from"></script>
```

* Number.isFinite() is not supported in IE 10
* Object.getOwnPropertySymbols() is not supported in IE 10
* Symbol.iterator() is not supported in IE 10
* Symbol.prototype() is not supported in IE 10
* Symbol.for() is not supported in IE 10
* Object.assign() is not supported in IE 10
* Array.from() is not supported in IE 10

### Koa

```js
const parseRequest = require('parse-request');

// ...

app.get('/', (ctx, next) => {
  const req = parseRequest({ req: ctx });
  console.log('req', req);
  // ...
});
```

### Express

```js
const parseRequest = require('parse-request');

// ...

app.get('/', (req, res, next) => {
  const req = parseRequest({ req });
  console.log('req', req);
  // ...
});
```

#### If you override req.body and need to preserve original in logs

Sometimes developers overwrite `req.body` or `req.body` properties – therefore if you want to preserve the original request, you can add `req._originalBody = req.body` (or `ctx.request._originalBody = ctx.request.body` if you're using Koa) at the top of your route middleware (or as a global route middleware).

#### If you want to disable body parsing just for a specific route (e.g. prevent log output from showing the body)

If you're using Express:

```js
const disableBodyParsing = Symbol.for('parse-request.disableBodyParsing');

// ...

app.get('/', (req, res, next) => {
  req[disableBodyParsing] = true;
  next();
});
```

If you're using Koa:

```js
const disableBodyParsing = Symbol.for('parse-request.disableBodyParsing');

// ...

app.get('/', (ctx, next) => {
  ctx.req[disableBodyParsing] = true;
  next();
});
```

#### If you want to disable file parsing just for a specific route (e.g. prevent log output from showing the file(s))

If you're using Express:

```js
const disableFileParsing = Symbol.for('parse-request.disableFileParsing');

// ...

app.get('/', (req, res, next) => {
  req[disableFileParsing] = true;
  next();
});
```

If you're using Koa:

```js
const disableFileParsing = Symbol.for('parse-request.disableFileParsing');

// ...

app.get('/', (ctx, next) => {
  ctx.req[disableFileParsing] = true;
  next();
});
```


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[passport]: http://www.passportjs.org/

[cabin]: https://cabinjs.com

[xhook]: https://github.com/jpillora/xhook

[credit-card-type]: https://github.com/braintree/credit-card-type

[sensitive-fields]: https://github.com/cabinjs/sensitive-fields

[cuid]: https://github.com/ericelliott/cuid

[bson-objectid]: https://docs.mongodb.com/manual/reference/method/ObjectId/

[uuid]: https://github.com/kelektiv/node-uuid#uuid-

[multer]: https://github.com/expressjs/multer

[rfdc]: https://github.com/davidmarkclements/rfdc

[request-received]: https://github.com/cabinjs/request-received

[express-request-id]: https://github.com/floatdrop/express-request-id

[browser-process-hrtime]: https://github.com/kumavis/browser-process-hrtime/

[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601

[response-time]: https://github.com/expressjs/response-time

[http-headers]: https://github.com/watson/http-headers

[rfc-spec]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1.1
