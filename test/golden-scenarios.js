'use strict';
/*
 * The getEpcData scenarios the golden test replays. golden.json holds what
 * the RESTlet returned for each one BEFORE epc_lib existed (captured from
 * fb0afc3 by capture-golden.js); the refactored RESTlet must match it byte for byte.
 */
var h = require('./helpers');

var SEARCH = '/api/domestic/search';
var CERT = '/api/certificate';

function routes(searchR, certR) {
    var r = {};
    if (searchR) { r[SEARCH] = searchR; }
    if (certR) { r[CERT] = certR; }
    return r;
}

module.exports = [
    { name: 'no token', token: '', params: { postcode: 'SN1 1AA' }, routes: routes() },
    { name: 'no parameters', token: 'tok', params: {}, routes: routes() },
    { name: 'search ok', token: 'tok', params: { postcode: 'SN1 1AA' }, routes: routes({ code: 200, body: h.fixture('search.json') }) },
    { name: 'search 404', token: 'tok', params: { postcode: 'KW1 4YT' }, routes: routes({ code: 404, body: '' }) },
    { name: 'search empty', token: 'tok', params: { postcode: 'KW1 4YT' }, routes: routes({ code: 200, body: { data: [] } }) },
    { name: 'search no data key', token: 'tok', params: { postcode: 'KW1 4YT' }, routes: routes({ code: 200, body: {} }) },
    { name: 'search 401 with message', token: 'tok', params: { postcode: 'SN1 1AA' }, routes: routes({ code: 401, body: { message: 'Unauthorised' } }) },
    { name: 'search 503 not JSON', token: 'tok', params: { postcode: 'SN1 1AA' }, routes: routes({ code: 503, body: '<html>down</html>' }) },
    { name: 'search exception', token: 'tok', params: { postcode: 'SN1 1AA' }, routes: routes(new Error('SSS_REQUEST_TIME_EXCEEDED')) },
    { name: 'search bad JSON', token: 'tok', params: { postcode: 'SN1 1AA' }, routes: routes({ code: 200, body: '{not json' }) },
    { name: 'cert invalid number', token: 'tok', params: { certificateNumber: '1234-5678' }, routes: routes() },
    { name: 'cert A', token: 'tok', params: { certificateNumber: '1111-2222-3333-4444-5555' }, routes: routes(null, { code: 200, body: h.fixture('certificate_a.json') }) },
    { name: 'cert B (no number in body)', token: 'tok', params: { certificateNumber: '9999-8888-7777-6666-5555' }, routes: routes(null, { code: 200, body: h.fixture('certificate_b.json') }) },
    { name: 'cert C (unknown codes)', token: 'tok', params: { certificateNumber: '9999-8888-7777-6666-5555' }, routes: routes(null, { code: 200, body: h.fixture('certificate_c.json') }) },
    { name: 'cert 404', token: 'tok', params: { certificateNumber: '1111-2222-3333-4444-5555' }, routes: routes(null, { code: 404, body: { message: 'Certificate not found' } }) },
    { name: 'cert 500 not JSON', token: 'tok', params: { certificateNumber: '1111-2222-3333-4444-5555' }, routes: routes(null, { code: 500, body: 'oops' }) },
    { name: 'cert no data', token: 'tok', params: { certificateNumber: '1111-2222-3333-4444-5555' }, routes: routes(null, { code: 200, body: {} }) },
    { name: 'cert exception', token: 'tok', params: { certificateNumber: '1111-2222-3333-4444-5555' }, routes: routes(null, new Error('Connection reset')) },
    { name: 'postcode wins over certificate', token: 'tok', params: { postcode: 'SN1 1AA', certificateNumber: '1111-2222-3333-4444-5555' }, routes: routes({ code: 200, body: h.fixture('search.json') }, { code: 200, body: h.fixture('certificate_a.json') }) }
];

module.exports.run = function (scenario) {
    var calls = [];
    var restlet = h.loadModule('ufh_quote_restlet.js', h.restletStubs(h.httpsStub(scenario.routes, calls), scenario.token));
    var params = { action: 'getEpcData' };
    Object.keys(scenario.params).forEach(function (k) { params[k] = scenario.params[k]; });
    return { out: restlet.get(params), calls: calls };
};
