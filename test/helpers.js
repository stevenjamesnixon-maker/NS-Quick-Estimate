'use strict';
/*
 * A tiny AMD loader for the tests. It evaluates a SuiteScript file with a
 * define() that resolves 'N/...' modules from the stubs given, and relative
 * modules ('./epc_lib') from the repo root.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.join(__dirname, '..');

function loadModule(file, stubs) {
    var src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    var exported;
    function define(deps, factory) {
        var args = deps.map(function (dep) {
            if (Object.prototype.hasOwnProperty.call(stubs, dep)) { return stubs[dep]; }
            if (dep.indexOf('./') === 0) { return loadModule(dep.slice(2) + '.js', stubs); }
            throw new Error('No stub for module ' + dep);
        });
        exported = factory.apply(null, args);
    }
    vm.runInNewContext(src, { define: define, JSON: JSON, Object: Object, Array: Array, String: String,
        Number: Number, parseInt: parseInt, parseFloat: parseFloat, encodeURIComponent: encodeURIComponent,
        Error: Error, RegExp: RegExp, Math: Math, Date: Date }, { filename: file });
    return exported;
}

/* N/https stub: routes() maps a URL substring to { code, body } (body may be an object). */
function httpsStub(routes, calls) {
    return {
        get: function (opts) {
            if (calls) { calls.push(opts); }
            var keys = Object.keys(routes);
            for (var i = 0; i < keys.length; i++) {
                if (opts.url.indexOf(keys[i]) !== -1) {
                    var r = routes[keys[i]];
                    if (r instanceof Error) { throw r; }
                    return { code: r.code, body: typeof r.body === 'string' ? r.body : JSON.stringify(r.body) };
                }
            }
            return { code: 404, body: '' };
        }
    };
}

function noop() {}

function restletStubs(https, token) {
    return {
        'N/search': {},
        'N/log': { error: noop, debug: noop, audit: noop },
        'N/https': https,
        'N/encode': {},
        'N/record': {},
        'N/runtime': {
            getCurrentScript: function () {
                return { getParameter: function (o) { return o.name === 'custscript_epc_bearer_token' ? token : null; } };
            }
        }
    };
}

function fixture(name) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8'));
}

module.exports = { loadModule: loadModule, httpsStub: httpsStub, restletStubs: restletStubs, fixture: fixture };
