/**
 * licensify:
 *   Gather license information of bundled file
 * 
 * https://github.com/twada/licensify
 *
 * Copyright (c) 2014 Takuto Wada
 * Licensed under the MIT license.
 *   http://twada.mit-license.org/
 */
'use strict';

var fs = require('fs');
var typeName = require('type-name');
var through = require('through2');

function extractLicense (pkg) {
    if (typeName(pkg.licenses) === 'Array') {
        return pkg.licenses.map(function (license) {
            return license.type;
        }).join(',');
    }
    switch (typeName(pkg.license)) {
    case 'undefined':
        return 'NO LICENSE!';
    case 'string':
        return pkg.license;
    case 'Object':
        return pkg.license.type;
    default:
        throw new Error('license: Cannot be here. type: ' + typeName(pkg.license));
    }
}

function extractAuthor (pkg) {
    switch (typeName(pkg.author)) {
    case 'undefined':
        return 'NO AUTHOR!';
    case 'string':
        return pkg.author;
    case 'Object':
        return pkg.author.name + ' <' + pkg.author.email + '>';
    default:
        throw new Error('author: Cannot be here. type: ' + typeName(pkg.author));
    }
}

function createLicenseHeader (licenses) {
    var header = '';
    header += '/**\n';
    header += ' * \n';
    var keys = Object.keys(licenses);
    keys.sort();
    keys.forEach(function (key) {
        var m = licenses[key];
        header += ' * module: ' + key + '\n';
        header += ' *   license: ' + m.license + '\n';
        header += ' *   author: ' + m.author + '\n';
        header += ' * \n';
    });
    header += ' */\n';
    return header;
}

module.exports = function licensify (b, opts) {
    var licenses = {};

    b.on('package', function (pkg) {
        licenses[pkg.name] = {
            author: extractAuthor(pkg),
            license: extractLicense(pkg)
        };
    });

    b.on('bundle', function (pipeline) {
        var first = true;
        pipeline.get('wrap').push(through.obj(function (buf, enc, next) {
            if (first) {
                this.push(new Buffer(createLicenseHeader(licenses)));
                first = false;
            }
            this.push(buf);
            next();
        }));
    });
};
