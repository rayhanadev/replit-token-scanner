/*!
 * isArrayBuffer v1.0.1
 * https://github.com/fengyuanchen/is-array-buffer
 *
 * Copyright (c) 2015-2018 Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2018-04-01T07:19:08.136Z
 */

'use strict';

var hasArrayBuffer = typeof ArrayBuffer === 'function';
var toString = Object.prototype.toString;

/**
 * Check if the given value is an ArrayBuffer.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is an ArrayBuffer, else `false`.
 * @example
 * isArrayBuffer(new ArrayBuffer())
 * // => true
 * isArrayBuffer([])
 * // => false
 */

function isArrayBuffer(value) {
  return hasArrayBuffer && (value instanceof ArrayBuffer || toString.call(value) === '[object ArrayBuffer]');
}

module.exports = isArrayBuffer;
