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

    it('creates license header', function (done) {
        var save = saveFirstChunk();
        var b = browserify();
        b.add(path.normalize(path.join(__dirname, '..', 'index.js')));
        b.plugin(licensify);
        b.bundle().pipe(save).pipe(es.wait(function(err, data) {
            assert(!err);
            var actual = save.firstChunk;
            expectedModules.forEach(function (moduleName) {
                var re = new RegExp(' \* ' + moduleName + '\:$', 'gm');
                assert(re.test(actual));
            });
            done();
        }));
    });

});
