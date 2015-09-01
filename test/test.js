'use strict';

delete require.cache[require.resolve('../')];
var licensify = require('../');
var path = require('path');
var browserify = require('browserify');
var through = require('through2');
var es = require('event-stream');
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

describe('licensify', function () {
    var header;

    before(function (done) {
        var save = saveFirstChunk();
        var b = browserify();
        b.add(path.normalize(path.join(__dirname, '..', 'index.js')));
        b.plugin(licensify);
        b.bundle().pipe(save).pipe(es.wait(function(err, data) {
            assert(!err);
            header = save.firstChunk;
            done();
        }));
    });

    it('ensure header includes @license tag', function (){
        var re = new RegExp(' \* @license$', 'gm');
        assert(re.test(header));
    });

    var expectedModules = [
        'licensify',
        'base64-js',
        'buffer',
        'core-util-is',
        'events',
        'ieee754',
        'inherits',
        'is-array',
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
    expectedModules.forEach(function (moduleName) {
        var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
        it('ensure header includes [' + moduleName + ']', function () {
            assert(re.test(header));
        });
    });

    var expectedUrls = [
        'homepage: https://github.com/twada/licensify',
        'homepage: https://github.com/beatgammit/base64-js',
        'homepage: https://github.com/feross/buffer',
        'homepage: https://github.com/isaacs/core-util-is',
        'homepage: https://github.com/Gozala/events',
        'homepage: https://github.com/feross/ieee754#readme',
        'homepage: https://github.com/isaacs/inherits',
        'homepage: https://github.com/retrofox/is-array',
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
    expectedUrls.forEach(function (url) {
        var re = new RegExp(' \* ' + url + '$', 'gm');
        it('ensure header includes [' + url + ']', function () {
            assert(re.test(header));
        });
    });
});


describe('`scanBrowser` option to scan `browser` fields in package.json:', function () {

    describe('when truthy', function () {
        var header;

        before(function (done) {
            var save = saveFirstChunk();
            var b = browserify();
            b.add(path.normalize(path.join(__dirname, 'test-scan-browser-fields', 'index.js')));
            b.plugin(licensify, {scanBrowser: true}); // with option
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

    describe('default is false', function () {
        var header;

        before(function (done) {
            var save = saveFirstChunk();
            var b = browserify();
            b.add(path.normalize(path.join(__dirname, 'test-scan-browser-fields', 'index.js')));
            b.plugin(licensify); // default
            b.bundle().pipe(save).pipe(es.wait(function(err, data) {
                assert(!err);
                header = save.firstChunk;
                done();
            }));
        });

        var expectedModules = [
            'licensify-test-scan-browser-fields'
        ];
        expectedModules.forEach(function (moduleName) {
            var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
            it('ensure header includes [' + moduleName + ']', function () {
                assert(re.test(header));
            });
        });

        var notToBeIncludedModules = [
            'jquery',
            'angular'
        ];
        notToBeIncludedModules.forEach(function (moduleName) {
            var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
            it('ensure header does NOT include [' + moduleName + ']', function () {
                assert(!re.test(header));
            });
        });
    });
});
