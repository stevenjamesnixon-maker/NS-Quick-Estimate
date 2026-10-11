'use strict';
var test = require('node:test');
var assert = require('node:assert');
var h = require('./helpers');
var scenarios = require('./golden-scenarios');
var golden = require('./fixtures/golden.json');

function lib(routes, calls) {
    return h.loadModule('epc_lib.js', { 'N/https': h.httpsStub(routes || {}, calls) });
}

function plain(o) { return JSON.parse(JSON.stringify(o)); }

test('LIB_VERSION is 1.0.0', function () {
    assert.strictEqual(lib().LIB_VERSION, '1.0.0');
});

test('mapCertificate joins walls, roofs and floors with "; "', function () {
    var m = lib().mapCertificate(h.fixture('certificate_a.json').data);
    assert.strictEqual(m.wallsDescription, 'Cavity wall, filled cavity; Timber frame, as built, insulated (assumed)');
    assert.strictEqual(m.roofDescription, 'Pitched, 270 mm loft insulation; Roof room(s), insulated (assumed)');
    assert.strictEqual(m.floorDescription, 'Solid, no insulation (assumed)');
    assert.strictEqual(m.propertyType, 'house');
    assert.strictEqual(m.builtForm, 'Semi-Detached');
    assert.strictEqual(m.constructionAgeBand, 'England and Wales: 1950-1966');
});

test('mapCertificate: the windows array (empty descriptions skipped)', function () {
    var m = lib().mapCertificate(h.fixture('certificate_a.json').data);
    assert.strictEqual(m.windowsDescription, 'Fully double glazed; Some secondary glazing');
});

test('mapCertificate: the single window object', function () {
    var m = lib().mapCertificate(h.fixture('certificate_b.json').data);
    assert.strictEqual(m.windowsDescription, 'High performance glazing');
});

test('mapCertificate: no windows at all → null', function () {
    var m = lib().mapCertificate(h.fixture('certificate_c.json').data);
    assert.strictEqual(m.windowsDescription, null);
});

test('mapCertificate: mains gas under each key shape, as returned', function () {
    var L = lib();
    assert.strictEqual(L.mapCertificate({ sap_energy_source: { mains_gas: 'N' } }).mainsGas, 'N');
    assert.strictEqual(L.mapCertificate({ sap_energy_source: { main_gas: 'Y' } }).mainsGas, 'Y');
    assert.strictEqual(L.mapCertificate({ mains_gas: true }).mainsGas, true);
    assert.strictEqual(L.mapCertificate({ sap_energy_source: { main_gas: false } }).mainsGas, false);
    assert.strictEqual(L.mapCertificate({}).mainsGas, null);
});

test('mapCertificate: a missing age band → null', function () {
    var L = lib();
    assert.strictEqual(L.mapCertificate({ sap_building_parts: [] }).constructionAgeBand, null);
    assert.strictEqual(L.mapCertificate({}).constructionAgeBand, null);
    assert.strictEqual(L.mapCertificate({ sap_building_parts: [{}] }).constructionAgeBand, null);
});

test('mapCertificate: rawKeys are the sorted top-level keys', function () {
    var m = lib().mapCertificate({ walls: [], address_line_1: 'x', Uprn: 1 });
    assert.deepStrictEqual(plain(m.rawKeys), ['Uprn', 'address_line_1', 'walls']);
});

test('validCertificateNumber', function () {
    var L = lib();
    assert.strictEqual(L.validCertificateNumber('1111-2222-3333-4444-5555'), true);
    assert.strictEqual(L.validCertificateNumber('1111-2222-3333-4444-555'), false);
    assert.strictEqual(L.validCertificateNumber('11112222333344445555'), false);
    assert.strictEqual(L.validCertificateNumber(' 1111-2222-3333-4444-5555'), false);
    assert.strictEqual(L.validCertificateNumber('aaaa-2222-3333-4444-5555'), false);
    assert.strictEqual(L.validCertificateNumber(null), false);
    assert.strictEqual(L.validCertificateNumber(11112222), false);
});

test('search: no token → ok:false, and no HTTP call', function () {
    var calls = [];
    var r = lib({}, calls).search('SN1 1AA', '');
    assert.strictEqual(r.ok, false);
    assert.match(r.message, /not configured/);
    assert.strictEqual(calls.length, 0);
});

test('search: rows newest first; 404 → ok with no rows; 500 → statusCode; exception → message', function () {
    var ok = lib({ '/domestic/search': { code: 200, body: h.fixture('search.json') } }).search('SN1 1AA', 't');
    assert.strictEqual(ok.ok, true);
    assert.deepStrictEqual(ok.rows.map(function (r) { return r.registrationDate; }), ['2021-11-19', '2018-07-30', '2015-03-02']);
    var none = lib({ '/domestic/search': { code: 404, body: '' } }).search('KW1 4YT', 't');
    assert.deepStrictEqual([none.ok, none.rows.length, none.message], [true, 0, 'No EPC certificates found for this postcode']);
    var bad = lib({ '/domestic/search': { code: 500, body: 'x' } }).search('SN1', 't');
    assert.deepStrictEqual([bad.ok, bad.statusCode, bad.message], [false, 500, 'EPC API returned status 500']);
    var ex = lib({ '/domestic/search': new Error('boom') }).search('SN1', 't');
    assert.deepStrictEqual([ex.ok, ex.message], [false, 'boom']);
});

test('certificate: the token is sent as Bearer and the number falls back', function () {
    var calls = [];
    var r = lib({ '/certificate': { code: 200, body: h.fixture('certificate_b.json') } }, calls)
        .certificate('9999-8888-7777-6666-5555', 'secret');
    assert.strictEqual(r.ok, true);
    assert.strictEqual(r.data.certificateNumber, '9999-8888-7777-6666-5555');
    assert.strictEqual(calls[0].headers.Authorization, 'Bearer secret');
    assert.strictEqual(r.raw.address_line_1, '5 High Street');
});

test('certificate: an invalid number → 400 without an HTTP call', function () {
    var calls = [];
    var r = lib({}, calls).certificate('12-34', 't');
    assert.deepStrictEqual([r.ok, r.statusCode, calls.length], [false, 400, 0]);
});

/* The golden test: every getEpcData envelope, and every HTTP call, is what fb0afc3 produced. */
scenarios.forEach(function (s) {
    test('golden: getEpcData unchanged — ' + s.name, function () {
        var r = scenarios.run(s);
        assert.strictEqual(r.out, golden[s.name].out);
        assert.deepStrictEqual(plain(r.calls), golden[s.name].calls);
    });
});
