'use strict';
/* Run once against the pre-refactor RESTlet: node test/capture-golden.js > test/fixtures/golden.json */
var scenarios = require('./golden-scenarios');
var out = {};
scenarios.forEach(function (s) {
    var r = scenarios.run(s);
    out[s.name] = { out: r.out, calls: r.calls };
});
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
