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

describe('licensify', function () {
    var positionWithoutLicensify;
    before(function (done) {
        var b = browserify([], { debug: true });
        b.add(path.normalize(path.join(__dirname, '..', 'index.js')));
        b.bundle().pipe(es.wait(function(err, data) {
            assert(!err);
            var code = data.toString('utf8');
            var map = convert.fromSource(code, true).toObject();
            var consumer = new SourceMapConsumer(map);
            // save starting position with debug and without licensify
            positionWithoutLicensify = consumer.generatedPositionFor({ source: 'index.js', line: 1, column: 0 });
            done();
        }));
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

    function licensifyTest (opts) {
        describe('debug: ' + opts.debug, function () {
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
                        var code = data.toString('utf8');
                        var map = convert.fromSource(code, true).toObject();
                        var consumer = new SourceMapConsumer(map);
                        var pos = consumer.generatedPositionFor({ source: 'index.js', line: 1, column: 0 });
                        assert(pos.line === (positionWithoutLicensify.line + newlinesIn(header)));
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
        });
    }

    licensifyTest({debug: true});
    licensifyTest({debug: false});
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
