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
    var expectedModules = [
        'base64-js',
        'buffer',
        'core-util-is',
        'events',
        'ieee754',
        'inherits',
        'is-array',
        'isarray',
        'licensify',
        'process',
        'readable-stream',
        'stream-browserify',
        'string_decoder',
        'through2',
        'type-name',
        'util',
        'xtend'
    ];

    expectedModules.forEach(function (moduleName) {
        var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
        it('ensure header includes [' + moduleName + ']', function (done) {
            var save = saveFirstChunk();
            var b = browserify();
            b.add(path.normalize(path.join(__dirname, '..', 'index.js')));
            b.plugin(licensify);
            b.bundle().pipe(save).pipe(es.wait(function(err, data) {
                assert(!err);
                var actual = save.firstChunk;
                assert(re.test(actual));
                done();
            }));
        });
    });

});

describe('licensify scan browser fields', function () {
    describe('true scanBrowser', function () {
        var expectedModules = [
            'licensify-test-scan-browser-fields',
            'jquery',
            'angular'
        ];
        expectedModules.forEach(function (moduleName) {
            var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
            it('ensure header includes [' + moduleName + ']', function (done) {
                var save = saveFirstChunk();
                var b = browserify();
                b.add(path.normalize(path.join(__dirname, 'test-scan-browser-fields', 'index.js')));
                b.plugin(licensify, {scanBrowser: true}); // with option
                b.bundle().pipe(save).pipe(es.wait(function(err, data) {
                    assert(!err);
                    var actual = save.firstChunk;
                    assert(re.test(actual));
                    done();
                }));
            });
        });
    });

    describe('false scanBrowser as a default', function () {
        var expectedNotIncludedModules = [
            'jquery',
            'angular'
        ];
        expectedNotIncludedModules.forEach(function (moduleName) {
            var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
            it('ensure header NOT includes [' + moduleName + ']', function (done) {
                var save = saveFirstChunk();
                var b = browserify();
                b.add(path.normalize(path.join(__dirname, 'test-scan-browser-fields', 'index.js')));
                b.plugin(licensify); // default
                b.bundle().pipe(save).pipe(es.wait(function(err, data) {
                    assert(!err);
                    var actual = save.firstChunk;
                    assert(!re.test(actual));
                    done();
                }));
            });
        });
    });
});
