licensify
================================

Browserify plugin to prepend license header to your bundle

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]


DESCRIPTION
---------------------------------------

`licensify` is a browserify plugin to prepend license header to your bundle as follows.

```javascript
/**
 * Modules in this bundle
 * @license
 * 
 * licensify:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Takuto Wada <takuto.wada@gmail.com>
 *   contributors: Okuno Kentaro, Ayumu Sato, Denis Sokolov
 *   homepage: https://github.com/twada/licensify
 *   version: 2.2.0
 * 
 * convert-source-map:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Thorsten Lorenz <thlorenz@gmx.de>
 *   maintainers: thlorenz <thlorenz@gmx.de>
 *   homepage: https://github.com/thlorenz/convert-source-map
 *   version: 1.1.3
 * 
 * core-util-is:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Isaac Z. Schlueter <i@izs.me>
 *   maintainers: isaacs <i@izs.me>
 *   homepage: https://github.com/isaacs/core-util-is#readme
 *   version: 1.0.2
 * 
 * inherits:
 *   license: ISC (http://opensource.org/licenses/ISC)
 *   maintainers: isaacs <i@izs.me>
 *   homepage: https://github.com/isaacs/inherits#readme
 *   version: 2.0.1
 * 
 * isarray:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Julian Gruber <mail@juliangruber.com>
 *   maintainers: juliangruber <julian@juliangruber.com>
 *   homepage: https://github.com/juliangruber/isarray
 *   version: 0.0.1
 * 
 * offset-sourcemap-lines:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Takuto Wada <takuto.wada@gmail.com>
 *   maintainers: twada <takuto.wada@gmail.com>
 *   homepage: https://github.com/twada/offset-sourcemap-lines
 *   version: 0.1.0
 * 
 * osi-licenses:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Meryn Stol <merynstol@gmail.com>
 *   maintainers: meryn <merynstol@gmail.com>
 *   homepage: https://github.com/meryn/osi-licenses
 *   version: 0.1.1
 * 
 * oss-license-name-to-url:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Zeke Sikelianos <zeke@sikelianos.com>
 *   maintainers: zeke <zeke@sikelianos.com>, isaacs <isaacs@npmjs.com>
 *   homepage: https://github.com/npm/oss-license-name-to-url
 *   version: 1.2.1
 * 
 * process-nextick-args:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   maintainers: cwmma <calvin.metcalf@gmail.com>
 *   homepage: https://github.com/calvinmetcalf/process-nextick-args
 *   version: 1.0.6
 * 
 * readable-stream:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   maintainers: isaacs <isaacs@npmjs.com>, tootallnate <nathan@tootallnate.net>, rvagg <rod@vagg.org>, cwmma <calvin.metcalf@gmail.com>
 *   homepage: https://github.com/nodejs/readable-stream#readme
 *   version: 2.0.5
 * 
 * source-map:
 *   license: BSD-3-Clause (http://opensource.org/licenses/BSD-3-Clause)
 *   author: Nick Fitzgerald <nfitzgerald@mozilla.com>
 *   maintainers: mozilla-devtools <mozilla-developer-tools@googlegroups.com>, mozilla <dherman@mozilla.com>, nickfitzgerald <fitzgen@gmail.com>
 *   contributors: Simon Lydell <simon.lydell@gmail.com>, Tobias Koppers <tobias.koppers@googlemail.com>, Stephen Crane <scrane@mozilla.com>, Ryan Seddon <seddon.ryan@gmail.com>, Miles Elam <miles.elam@deem.com>, Mihai Bazon <mihai.bazon@gmail.com>, Michael Ficarra <github.public.email@michael.ficarra.me>, Todd Wolfson <todd@twolfson.com>, Alexander Solovyov <alexander@solovyov.net>, Felix Gnass <fgnass@gmail.com>, Conrad Irwin <conrad.irwin@gmail.com>, usrbincc <usrbincc@yahoo.com>, David Glasser <glasser@davidglasser.net>, Chase Douglas <chase@newrelic.com>, Evan Wallace <evan.exe@gmail.com>, Heather Arthur <fayearthur@gmail.com>, Hugh Kennedy <hughskennedy@gmail.com>, David Glasser <glasser@davidglasser.net>, Duncan Beevers <duncan@dweebd.com>, Jmeas Smith <jellyes2@gmail.com>, Michael Z Goddard <mzgoddard@gmail.com>, azu <azu@users.noreply.github.com>, John Gozde <john@gozde.ca>, Adam Kirkton <akirkton@truefitinnovation.com>, Chris Montgomery <christopher.montgomery@dowjones.com>, J. Ryan Stinnett <jryans@gmail.com>, Jack Herrington <jherrington@walmartlabs.com>, Chris Truter <jeffpalentine@gmail.com>, Daniel Espeset <daniel@danielespeset.com>, Jamie Wong <jamie.lf.wong@gmail.com>, Eddy Bruël <ejpbruel@mozilla.com>, Hawken Rives <hawkrives@gmail.com>, Gilad Peleg <giladp007@gmail.com>, djchie <djchie.dev@gmail.com>, Gary Ye <garysye@gmail.com>, Nicolas Lalevée <nicolas.lalevee@hibnet.org>
 *   homepage: https://github.com/mozilla/source-map
 *   version: 0.5.3
 * 
 * string_decoder:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   maintainers: substack <mail@substack.net>, rvagg <rod@vagg.org>
 *   homepage: https://github.com/rvagg/string_decoder
 *   version: 0.10.31
 * 
 * through2:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Rod Vagg <r@va.gg>
 *   maintainers: rvagg <rod@vagg.org>, bryce <bryce@ravenwall.com>
 *   homepage: https://github.com/rvagg/through2#readme
 *   version: 2.0.0
 * 
 * type-name:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Takuto Wada <takuto.wada@gmail.com>
 *   maintainers: twada <takuto.wada@gmail.com>
 *   contributors: azu, Yosuke Furukawa
 *   homepage: https://github.com/twada/type-name
 *   version: 2.0.0
 * 
 * util-deprecate:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Nathan Rajlich <nathan@tootallnate.net>
 *   maintainers: tootallnate <nathan@tootallnate.net>
 *   homepage: https://github.com/TooTallNate/util-deprecate
 *   version: 1.0.2
 * 
 * xtend:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Raynos <raynos2@gmail.com>
 *   maintainers: raynos <raynos2@gmail.com>
 *   contributors: Jake Verbaten, Matt Esch
 *   homepage: https://github.com/Raynos/xtend
 *   version: 4.0.1
 * 
 * This header is generated by licensify (https://github.com/twada/licensify)
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
var fs = require('fs');
var dest = fs.createWriteStream('/path/to/bundle.js');

var b = browserify();
b.add('/path/to/your/file');
b.plugin(licensify);
b.bundle().pipe(dest)
```

### browser field

Since 2.0.0, licensify scans and traverses [`browser` field](https://github.com/substack/browserify-handbook#browser-field) if exists.


INSTALL
---------------------------------------

```
$ npm install --save-dev licensify
```


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


CONTRIBUTORS
---------------------------------------
* [Okuno Kentaro](https://github.com/armorik83)
* [Ayumu Sato](https://github.com/ahomu)
* [Denis Sokolov](https://github.com/denis-sokolov)


LICENSE
---------------------------------------
Licensed under the [MIT](http://twada.mit-license.org/2014-2016) license.


[npm-url]: https://www.npmjs.com/package/licensify
[npm-image]: https://badge.fury.io/js/licensify.svg

[travis-url]: https://travis-ci.org/twada/licensify
[travis-image]: https://secure.travis-ci.org/twada/licensify.svg?branch=master

[depstat-url]: https://gemnasium.com/twada/licensify
[depstat-image]: https://gemnasium.com/twada/licensify.svg

[license-url]: http://twada.mit-license.org/2014-2016
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
