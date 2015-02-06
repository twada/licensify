/**
 * licensify:
 *   Browserify plugin to prepend license header to bundle
 * 
 * https://github.com/twada/licensify
 *
 * Copyright (c) 2014 Takuto Wada
 * Licensed under the MIT license.
 *   http://twada.mit-license.org/
 */
'use strict';

var typeName = require('type-name');
var through = require('through2');
var props = [
    'license',
    'licenses',
    'author',
    'maintainers',
    'contributors'
];

function extractLicense (pkg, summary) {
    switch (typeName(pkg.license)) {
    case 'string':
        summary.license = pkg.license;
        break;
    case 'Object':
        summary.license = pkg.license.type;
        break;
    }
}

function extractLicenses (pkg, summary) {
    if (typeName(pkg.licenses) === 'Array') {
        summary.licenses = pkg.licenses.map(function (license) {
            return license.type;
        }).join(', ');
    }
}

function displayName (person) {
    switch (typeName(person)) {
    case 'string':
        return person;
    case 'Object':
        if (person.email) {
            return person.name + ' <' + person.email + '>';
        }
        return person.name;
    }
    return 'NO AUTHOR!';
}

function extractAuthor (pkg, summary) {
    if (pkg.author) {
        summary.author = displayName(pkg.author);
    }
}

function extractMaintainers (pkg, summary) {
    if (typeName(pkg.maintainers) === 'Array') {
        summary.maintainers = pkg.maintainers.map(function (person) {
            return displayName(person);
        }).join(', ');
    }
}

function extractContributors (pkg, summary) {
    if (typeName(pkg.contributors) === 'Array') {
        summary.contributors = pkg.contributors.map(function (person) {
            return displayName(person);
        }).join(', ');
    }
}

function createLicenseHeader (licenses) {
    var header = '';
    header += '/**\n';
    header += ' * Modules in this bundle\n';
    header += ' * \n';
    var keys = Object.keys(licenses);
    keys.sort();
    keys.forEach(function (key) {
        var m = licenses[key];
        header += ' * ' + key + ':\n';
        props.forEach(function (prop) {
            if (m[prop]) {
                header += ' *   ' + prop + ': ' + m[prop] + '\n';
            }
        });
        header += ' * \n';
    });
    header += ' */\n';
    return header;
}

module.exports = function licensify (b, opts) {
    var licenses = {};

    b.on('package', function (pkg) {
        var summary = {};
        extractLicense(pkg, summary);
        extractLicenses(pkg, summary);
        extractAuthor(pkg, summary);
        extractMaintainers(pkg, summary);
        extractContributors(pkg, summary);
        licenses[pkg.name] = summary;
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
