# NS-Quick-Estimate

The Nu-Heat UFH Quick Quote Tool: a Suitelet page (`ufh_quote_suitelet_v3.2.js`) and the RESTlet it calls (`ufh_quote_restlet.js`).

## Files

| File | Version | What it is |
|---|---|---|
| `ufh_quote_suitelet_v3.2.js` | 3.2 | The quick quote page |
| `ufh_quote_restlet.js` | 1.1.0 | The RESTlet: floor constructions, prices, entity search, estimate creation, and `getEpcData` |
| `epc_lib.js` | 1.0.0 | The shared EPC library: the GOV.UK EPC API calls and the certificate mapping. No script record, no deployment |

## Uploading

All three live in `/SuiteScripts/NuHeat/Quick Quote Tool/`.

1. **Upload `epc_lib.js` first.** The RESTlet loads it as `./epc_lib`, so if the RESTlet goes up first, every RESTlet call fails at load time.
2. Then upload `ufh_quote_restlet.js` over the existing file. The script record and deployment are unchanged, and `custscript_epc_bearer_token` is still read there.

## The EPC library is shared

`epc_lib.js` is `@NModuleScope Public` because the Customer Dashboard (NS-Customer-Dashboard) loads it by **absolute path**, `/SuiteScripts/NuHeat/Quick Quote Tool/epc_lib`, and refuses it unless `LIB_VERSION` is at least the version it needs. So:

- don't move or rename `epc_lib.js`;
- bump `LIB_VERSION` on any change, and keep it backwards compatible (the dashboard only checks a minimum);
- the library never reads script parameters and never logs. Each caller passes its own bearer token (the RESTlet from `custscript_epc_bearer_token`, the dashboard from its `EPC_BEARER_TOKEN` setting) and does its own logging. Never log the token.

```
search(postcode, token)     -> { ok, rows:[{certificateNumber,address,postcode,postTown,registrationDate}], message, statusCode }
certificate(number, token)  -> { ok, raw, data, message, statusCode }   // data = mapCertificate(raw)
mapCertificate(d)           -> pure; the quick quote fields plus windowsDescription, mainsGas, rawKeys
validCertificateNumber(s)   -> pure; XXXX-XXXX-XXXX-XXXX-XXXX
```

No token → `ok:false`. A 404 or no rows → `ok:true` with `rows:[]`. Any other non-200 → `ok:false` with `statusCode`. An exception → `ok:false` with the message (and the original as `error`).

## Tests

```
node --test test/*.test.js
```

`test/helpers.js` is a small AMD loader with an `N/https` stub. `test/fixtures/golden.json` holds what `getEpcData` returned for each scenario in `test/golden-scenarios.js` **before** `epc_lib` existed (captured from `fb0afc3` with `test/capture-golden.js`). The golden tests check the refactored RESTlet returns the same JSON strings and makes the same HTTP calls.
