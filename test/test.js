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
