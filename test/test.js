'use strict';

delete require.cache[require.resolve('../')];
var licensify = require('../');
var path = require('path');
var browserify = require('browserify');
var through = require('through2');
var es = require('event-stream');
var convert = require('convert-source-map');
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var assert = require('power-assert').customize({
    output: {
        lineDiffThreshold: 1
    }
});

var saveFirstChunk = function () {
    var first = true;
    return through.obj(function (buf, enc, next) {
        if (first) {
            this.firstChunk = buf.toString('utf8');
            first = false;
        }
        this.push(buf);
        next();
    });
};

function newlinesIn (src) {
    if (!src) return 0;
    var newlines = src.match(/\n/g);
    return newlines ? newlines.length : 0;
}

var expandedPrelude = [
    '(function outer (modules, cache, entry) {',
    '    var previousRequire = typeof require == "function" && require;',
    '    function newRequire(name, jumped){',
    '        if(!cache[name]) {',
    '            if(!modules[name]) {',
    '                var currentRequire = typeof require == "function" && require;',
    '                if (!jumped && currentRequire) return currentRequire(name, true);',
    '                if (previousRequire) return previousRequire(name, true);',
    '                var err = new Error("Cannot find module " + name);',
    '                err.code = "MODULE_NOT_FOUND";',
    '                throw err;',
    '            }',
    '            var m = cache[name] = {exports:{}};',
    '            modules[name][0].call(m.exports, function(x){',
    '                var id = modules[name][1][x];',
    '                return newRequire(id ? id : x);',
    '            },m,m.exports,outer,modules,cache,entry);',
    '        }',
    '        return cache[name].exports;',
    '    }',
    '    for(var i=0;i<entry.length;i++) newRequire(entry[i]);',
    '    return newRequire;',
    '})',
].join('\n');

function consumeMap (opts, callback) {
    var b = browserify([], opts);
    b.add(path.normalize(path.join(__dirname, '..', 'index.js')));
    b.bundle().pipe(es.wait(function(err, data) {
        assert(!err);
        var map = convert.fromSource(data.toString('utf8'), true).toObject();
        var consumer = new SourceMapConsumer(map);
        callback(consumer);
    }));
}

var targetPosition = { source: 'index.js', line: 1, column: 0 };


describe('licensify', function () {
    var defaultPositionWithDebug;
    before(function (done) {
        consumeMap({ debug: true }, function (consumer) {
            defaultPositionWithDebug = consumer.generatedPositionFor(targetPosition);
            done();
        });
    });
    var defaultPositionWithDebugAndCustomPrelure;
    before(function (done) {
        consumeMap({ debug: true, prelude: expandedPrelude }, function (consumer) {
            defaultPositionWithDebugAndCustomPrelure = consumer.generatedPositionFor(targetPosition);
            assert(defaultPositionWithDebugAndCustomPrelure.line !== defaultPositionWithDebug.line);
            done();
        });
    });

    var expectedModules = [
        'licensify',
        'base64-js',
        'buffer',
        'core-util-is',
        'events',
        'ieee754',
        'inherits',
        'isarray',
        'process',
        'process-nextick-args',
        'readable-stream',
        'string_decoder',
        'through2',
        'type-name',
        'util',
        'util-deprecate',
        'xtend'
    ];
    var expectedUrls = [
        'homepage: https://github.com/twada/licensify',
        'homepage: https://github.com/beatgammit/base64-js#readme',
        'homepage: https://github.com/feross/buffer',
        'homepage: https://github.com/isaacs/core-util-is#readme',
        'homepage: https://github.com/Gozala/events#readme',
        'homepage: https://github.com/feross/ieee754#readme',
        'homepage: https://github.com/juliangruber/isarray',
        'homepage: https://github.com/shtylman/node-process#readme',
        'homepage: https://github.com/calvinmetcalf/process-nextick-args',
        'homepage: https://github.com/nodejs/readable-stream#readme',
        'homepage: https://github.com/rvagg/string_decoder',
        'homepage: https://github.com/rvagg/through2#readme',
        'homepage: https://github.com/twada/type-name',
        'homepage: https://github.com/defunctzombie/node-util',
        'homepage: https://github.com/TooTallNate/util-deprecate',
        'homepage: https://github.com/Raynos/xtend'
    ];
    var expectedLicenseUrls = [
        'http://opensource.org/licenses/MIT',
        'http://opensource.org/licenses/ISC',
        'http://opensource.org/licenses/BSD-3-Clause'
    ];

    function licensifyTest (opts) {
        describe('options: ' + JSON.stringify(opts), function () {
            var header;
            before(function (done) {
                var save = saveFirstChunk();
                var b = browserify([], opts);
                b.add(path.normalize(path.join(__dirname, '..', 'index.js')));
                b.plugin(licensify);
                b.bundle().pipe(save).pipe(es.wait(function(err, data) {
                    assert(!err);
                    header = save.firstChunk;
                    if (opts.debug) {
                        var map = convert.fromSource(data.toString('utf8'), true).toObject();
                        var consumer = new SourceMapConsumer(map);
                        var pos = consumer.generatedPositionFor(targetPosition);
                        if (opts.prelude) {
                            assert(pos.line === (defaultPositionWithDebugAndCustomPrelure.line + newlinesIn(header)));
                        } else {
                            assert(pos.line === (defaultPositionWithDebug.line + newlinesIn(header)));
                        }
                    }
                    done();
                }));
            });
            it('ensure header includes @license tag', function (){
                var re = new RegExp(' \* @license$', 'gm');
                assert(re.test(header));
            });
            expectedModules.forEach(function (moduleName) {
                var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
                it('ensure header includes [' + moduleName + ']', function () {
                    assert(re.test(header));
                });
            });
            expectedUrls.forEach(function (url) {
                var re = new RegExp(' \* ' + url + '$', 'gm');
                it('ensure header includes [' + url + ']', function () {
                    assert(re.test(header));
                });
            });
            expectedLicenseUrls.forEach(function (licenseUrl) {
                var re = new RegExp(licenseUrl, 'gm');
                it('ensure header includes [' + licenseUrl + ']', function () {
                    assert(re.test(header));
                });
            });
        });
    }

    licensifyTest({debug: true});
    licensifyTest({debug: false});
    licensifyTest({debug: true, prelude: expandedPrelude });
});


describe('scan `browser` field in package.json by default', function () {
    var header;

    before(function (done) {
        var save = saveFirstChunk();
        var b = browserify();
        b.add(path.normalize(path.join(__dirname, 'test-scan-browser-fields', 'index.js')));
        b.plugin(licensify);
        b.bundle().pipe(save).pipe(es.wait(function(err, data) {
            assert(!err);
            header = save.firstChunk;
            done();
        }));
    });

    var expectedModules = [
        'licensify-test-scan-browser-fields',
        'jquery',
        'angular'
    ];
    expectedModules.forEach(function (moduleName) {
        var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
        it('ensure header includes [' + moduleName + ']', function () {
            assert(re.test(header));
        });
    });
});


describe('`scanBrowser` option is just ignored since 2.0.0', function () {
    [true, false].forEach(function (flag) {
        describe('when ' + flag, function () {
            var header;

            before(function (done) {
                var save = saveFirstChunk();
                var b = browserify();
                b.add(path.normalize(path.join(__dirname, 'test-scan-browser-fields', 'index.js')));
                b.plugin(licensify, {scanBrowser: flag});
                b.bundle().pipe(save).pipe(es.wait(function(err, data) {
                    assert(!err);
                    header = save.firstChunk;
                    done();
                }));
            });

            var expectedModules = [
                'licensify-test-scan-browser-fields',
                'jquery',
                'angular'
            ];
            expectedModules.forEach(function (moduleName) {
                var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
                it('ensure header includes [' + moduleName + ']', function () {
                    assert(re.test(header));
                });
            });
        });
    });
});
