# is-array-buffer

[![Build Status](https://img.shields.io/travis/fengyuanchen/is-array-buffer.svg)](https://travis-ci.org/fengyuanchen/is-array-buffer) [![Coverage Status](https://img.shields.io/codecov/c/github/fengyuanchen/is-array-buffer.svg)](https://codecov.io/gh/fengyuanchen/is-array-buffer) [![Downloads](https://img.shields.io/npm/dm/is-array-buffer.svg)](https://www.npmjs.com/package/is-array-buffer) [![Version](https://img.shields.io/npm/v/is-array-buffer.svg)](https://www.npmjs.com/package/is-array-buffer)

> Check if the given value is an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

## Main

```text
dist/
├── is-array-buffer.js        (UMD)
├── is-array-buffer.min.js    (UMD, compressed)
├── is-array-buffer.common.js (CommonJS, default)
└── is-array-buffer.esm.js    (ES Module)
```

## Install

```sh
npm install is-array-buffer
```

## Usage

```js
import isArrayBuffer from 'is-array-buffer';

isArrayBuffer(new ArrayBuffer());
// > true

isArrayBuffer([]);
// > false
```

## License

[MIT](http://opensource.org/licenses/MIT) © [Chen Fengyuan](http://chenfengyuan.com)
