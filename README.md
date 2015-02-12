licensify
================================

Browserify plugin to prepend license header to bundle

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]


DESCRIPTION
---------------------------------------

`licensify` is a browserify plugin to prepend license header to bundle as follows.

```javascript
/**
 * Modules in this bundle
 * 
 * base64-js:
 *   license: MIT
 *   author: T. Jameson Little <t.jameson.little@gmail.com>
 *   maintainers: beatgammit <t.jameson.little@gmail.com>, feross <feross@feross.org>
 * 
 * buffer:
 *   license: MIT
 *   author: Feross Aboukhadijeh <feross@feross.org>
 *   maintainers: feross <feross@feross.org>
 *   contributors: Romain Beauxis <toots@rastageeks.org>, James Halliday <mail@substack.net>
 * 
 * core-util-is:
 *   license: MIT
 *   author: Isaac Z. Schlueter <i@izs.me>
 * 
 * events:
 *   author: Irakli Gozalishvili <rfobic@gmail.com>
 * 
 * ieee754:
 *   license: MIT
 *   author: Feross Aboukhadijeh <feross@feross.org>
 *   contributors: Romain Beauxis <toots@rastageeks.org>
 * 
 * inherits:
 *   license: ISC
 * 
 * is-array:
 *   license: MIT
 * 
 * isarray:
 *   license: MIT
 *   author: Julian Gruber <mail@juliangruber.com>
 *   maintainers: juliangruber <julian@juliangruber.com>
 * 
 * licensify:
 *   license: MIT
 *   author: Takuto Wada <takuto.wada@gmail.com>
 * 
 * process:
 *   author: Roman Shtylman <shtylman@gmail.com>
 *   maintainers: coolaj86 <coolaj86@gmail.com>, shtylman <shtylman@gmail.com>
 * 
 * readable-stream:
 *   license: MIT
 *   author: Isaac Z. Schlueter <i@izs.me>
 * 
 * stream-browserify:
 *   license: MIT
 *   author: James Halliday <mail@substack.net>
 * 
 * string_decoder:
 *   license: MIT
 * 
 * through2:
 *   license: MIT
 *   author: Rod Vagg <r@va.gg>
 * 
 * type-name:
 *   license: MIT
 *   author: Takuto Wada <takuto.wada@gmail.com>
 *   contributors: azu, Yosuke Furukawa
 * 
 * util:
 *   license: MIT
 *   author: Joyent
 * 
 * xtend:
 *   licenses: MIT
 *   author: Raynos <raynos2@gmail.com>
 *   contributors: Jake Verbaten, Matt Esch
 * 
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
...(your bundle continues ...)
```


HOW TO USE
---------------------------------------

by command-line

```
$ browserify main.js -p licensify > build/bundle.js 
```

or programmatically

```javascript
var browserify = require('browserify');
var licensify = require('licensify');

var b = browserify();
b.add('/path/to/your/file');
b.plugin(licensify);
b.bundle().pipe(somewhere)
```


INSTALL
---------------------------------------

```
$ npm install --save-dev licensify
```


AUTHOR
---------------------------------------
* [Takuto Wada](http://github.com/twada)


CONTRIBUTORS
---------------------------------------
* [Okuno Kentaro](http://github.com/armorik83)


LICENSE
---------------------------------------
Licensed under the [MIT](http://twada.mit-license.org/) license.


[npm-url]: https://npmjs.org/package/licensify
[npm-image]: https://badge.fury.io/js/licensify.svg

[travis-url]: http://travis-ci.org/twada/licensify
[travis-image]: https://secure.travis-ci.org/twada/licensify.svg?branch=master

[depstat-url]: https://gemnasium.com/twada/licensify
[depstat-image]: https://gemnasium.com/twada/licensify.svg

[license-url]: http://twada.mit-license.org/2014-2015
[license-image]: http://img.shields.io/badge/license-MIT-brightgreen.svg
