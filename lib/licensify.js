/**
 * licensify:
 *   Browserify plugin to prepend license header to bundle
 *
 * https://github.com/twada/licensify
 *
 * Copyright (c) 2014-2015 Takuto Wada
 * Licensed under the MIT license.
 *   http://twada.mit-license.org/2014-2015
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

function extract (pkg) {
    var summary = {};
    extractLicense(pkg, summary);
    extractLicenses(pkg, summary);
    extractAuthor(pkg, summary);
    extractMaintainers(pkg, summary);
    extractContributors(pkg, summary);
    return summary;
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
    var scannedPkg = [];

    function alreadyScanned (pkg) {
        return scannedPkg.some(function (scanned) {
            return pkg.name === scanned;
        });
    }

    b.on('package', function (pkg) {
        if (alreadyScanned(pkg)) {
            return;
        }

        if (!opts.scanBrowser || !pkg.browser || typeName(pkg.browser) === 'string') {
            licenses[pkg.name] = extract(pkg);
            scannedPkg.push(pkg.name);
            return;
        }

        // If this pkg has "browser" field, licensify scans the field and extracts informations.
        // see https://github.com/substack/browserify-handbook#browser-field
        Object.keys(pkg.browser).forEach(function (key) {
            var subPkgPath = pkg.__dirname + '/node_modules/' + key + '/package.json';
            try {
                var subPkg = require(subPkgPath);
            } catch (e) {
                return;
            }
            licenses[subPkg.name] = extract(subPkg);
            scannedPkg.push(subPkg.name);
        });
        licenses[pkg.name] = extract(pkg);
        scannedPkg.push(pkg.name);
    });

    b.on('bundle', function () {
        var first = true;
        b.pipeline.get('wrap').push(through.obj(function (buf, enc, next) {
            if (first) {
                this.push(new Buffer(createLicenseHeader(licenses)));
                first = false;
            }
            this.push(buf);
            next();
        }));
    });
};
