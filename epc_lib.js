/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * Nu-Heat EPC library — the GOV.UK EPC (Bearer) API calls and the certificate
 * mapping, shared by the Quick Quote RESTlet and the Customer Dashboard.
 *
 * File Cabinet: /SuiteScripts/NuHeat/Quick Quote Tool/epc_lib.js (beside the RESTlet).
 * The RESTlet loads it as './epc_lib'; the dashboard loads it by absolute path
 * and checks LIB_VERSION.
 *
 * Rules:
 *   - The bearer token is passed in. This library never reads script parameters.
 *   - N/https only. No N/log: callers log (and must never log the token).
 *   - Nothing here throws: every failure comes back as { ok: false, message, statusCode? }.
 *     An exception also comes back as `error` so a caller can log the original object.
 *
 * @version 1.0.0
 */
define(['N/https'], function (https) {
    'use strict';

    var LIB_VERSION = '1.0.0';

    var BASE = 'https://api.get-energy-performance-data.communities.gov.uk/api';
    var NO_TOKEN = 'EPC bearer token is not configured.';
    var NO_ROWS = 'No EPC certificates found for this postcode';
    var BAD_NUMBER = 'Invalid certificateNumber format. Expected 20-digit hyphenated value, e.g. 1111-2222-3333-4444-5555.';

    /*
     * Property-type integer codes returned by the certificate endpoint.
     * The old API returned human-readable strings; the new API returns integer codes
     * in property_type. The quick quote front end's ptMap requires lowercase strings ("house" etc.).
     * Codes sourced from RdSAP schema documentation.
     */
    var PROPERTY_TYPE_CODES = {
        0: 'house',
        1: 'bungalow',
        2: 'flat',
        3: 'maisonette',
        4: 'park home'
    };

    /*
     * Built-form integer codes returned by the certificate endpoint. Display-only.
     * Codes sourced from RdSAP schema documentation.
     */
    var BUILT_FORM_CODES = {
        1: 'Detached',
        2: 'Semi-Detached',
        3: 'End-Terrace',
        4: 'Mid-Terrace',
        5: 'Enclosed End-Terrace',
        6: 'Enclosed Mid-Terrace'
    };

    function headers(token) {
        return {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    }

    /* The API's own message when the error body is JSON with one, else the status line. */
    function errorMessage(response) {
        var msg = 'EPC API returned status ' + response.code;
        try {
            var body = JSON.parse(response.body);
            if (body && body.message) { msg = body.message; }
        } catch (ignored) {}
        return msg;
    }

    function failure(e) {
        return { ok: false, message: e && e.message, error: e };
    }

    /** Pure: the 20-digit hyphenated certificate number, XXXX-XXXX-XXXX-XXXX-XXXX. */
    function validCertificateNumber(s) {
        return typeof s === 'string' && /^\d{4}-\d{4}-\d{4}-\d{4}-\d{4}$/.test(s);
    }

    /**
     * Address search for a postcode.
     * 404, or 200 with no rows → { ok: true, rows: [], message: NO_ROWS }.
     * Rows are sorted by registrationDate, newest first.
     */
    function search(postcode, token) {
        if (!token) { return { ok: false, rows: [], message: NO_TOKEN }; }
        try {
            var response = https.get({
                url: BASE + '/domestic/search?postcode=' + encodeURIComponent(postcode),
                headers: headers(token)
            });

            if (response.code === 404) {
                return { ok: true, rows: [], message: NO_ROWS, statusCode: 404 };
            }
            if (response.code !== 200) {
                return { ok: false, rows: [], message: errorMessage(response), statusCode: response.code };
            }

            var body = JSON.parse(response.body);
            var rawRows = (body && body.data) ? body.data : [];
            if (rawRows.length === 0) {
                return { ok: true, rows: [], message: NO_ROWS, statusCode: 200 };
            }

            var rows = rawRows.map(function (row) {
                var addrParts = [
                    row.addressLine1 || null,
                    row.addressLine2 || null,
                    row.addressLine3 || null,
                    row.addressLine4 || null
                ].filter(function (p) { return p && p.length > 0; });

                return {
                    certificateNumber: row.certificateNumber,
                    address:           addrParts.join(', '),
                    postcode:          row.postcode ? row.postcode.replace(/\+/g, ' ') : '',
                    postTown:          row.postTown || null,
                    registrationDate:  row.registrationDate || null
                };
            });

            /* Sort by registrationDate descending (most recent first) */
            rows.sort(function (a, b) {
                if (a.registrationDate > b.registrationDate) { return -1; }
                if (a.registrationDate < b.registrationDate) { return 1; }
                return 0;
            });

            return { ok: true, rows: rows, message: '', statusCode: 200 };
        } catch (e) {
            var f = failure(e);
            f.rows = [];
            return f;
        }
    }

    /**
     * One certificate. data = mapCertificate(raw), with certificateNumber
     * falling back to the number asked for (the API layer does not always echo it).
     */
    function certificate(number, token) {
        if (!token) { return { ok: false, raw: null, data: null, message: NO_TOKEN }; }
        if (!validCertificateNumber(number)) {
            return { ok: false, raw: null, data: null, message: BAD_NUMBER, statusCode: 400 };
        }
        try {
            var response = https.get({
                url: BASE + '/certificate?certificate_number=' + encodeURIComponent(number),
                headers: headers(token)
            });

            if (response.code !== 200) {
                return { ok: false, raw: null, data: null, message: errorMessage(response), statusCode: response.code };
            }

            var body = JSON.parse(response.body);
            var raw = body.data;
            var data = mapCertificate(raw);
            if (!data.certificateNumber) { data.certificateNumber = number; }
            return { ok: true, raw: raw, data: data, message: '', statusCode: 200 };
        } catch (e) {
            var f = failure(e);
            f.raw = null;
            f.data = null;
            return f;
        }
    }

    /*
     * joinDescriptions — maps an array of component objects to a "; "-joined string of
     * their description values. Handles 1..n entries and absent/empty arrays safely.
     * description is a flat string on all confirmed live certs (no .value nesting).
     */
    function joinDescriptions(arr) {
        if (!arr || !arr.length) { return null; }
        var parts = [];
        for (var i = 0; i < arr.length; i++) {
            var desc = arr[i] && arr[i].description;
            if (desc && typeof desc === 'string' && desc.length > 0) {
                parts.push(desc);
            }
        }
        return parts.length > 0 ? parts.join('; ') : null;
    }

    function present(v) {
        return v !== undefined && v !== null;
    }

    /**
     * Pure: the certificate body (`data`) → the mapped object.
     *
     * Cross-schema field notes (verified against live certs A=SAP-Schema-16.2 and B=RdSAP-Schema-20.0.0):
     *
     * property_type  — integer code (0=house, 1=bungalow, 2=flat, 3=maisonette).
     *                  Mapped via PROPERTY_TYPE_CODES. Falls back to dwelling_type lowercased.
     * built_form     — integer code (1=Detached ... 6=Enclosed Mid-Terrace). Display-only.
     * floors/walls/roofs — arrays; description is a FLAT STRING on the live API.
     *                  Multiple entries possible; joined with "; ".
     * window vs windows — Cert A has "windows" (array); Cert B has "window" (object).
     * mains_gas vs main_gas in sap_energy_source — Cert A "main_gas", Cert B "mains_gas".
     *                  Returned as the API gave it (string or boolean); null when absent.
     * construction_age_band — nested at sap_building_parts[0].construction_age_band.
     * certificate_number — not always present; certificate() falls back to the number asked for.
     *
     * FUTURE CALC WORK — sap_floor_dimensions[] fields (total_floor_area, room_height,
     * heat_loss_perimeter, party_wall_length) are flat numbers on SAP-16.x and
     * { value, quantity } objects on RdSAP-20+. The top-level total_floor_area is a flat
     * number on both and is what is read here.
     */
    function mapCertificate(d) {
        /* d.address_line_1 is read first, so a missing body fails exactly as the RESTlet always has */
        var certAddrParts = [
            d.address_line_1 || null,
            d.address_line_2 || null,
            d.address_line_3 || null,
            d.address_line_4 || null
        ].filter(function (p) { return p && p.length > 0; });

        var propertyTypeCode = present(d.property_type) ? parseInt(d.property_type, 10) : null;
        var propertyTypeStr = (propertyTypeCode !== null && PROPERTY_TYPE_CODES[propertyTypeCode])
            ? PROPERTY_TYPE_CODES[propertyTypeCode]
            : (d.dwelling_type ? d.dwelling_type.toLowerCase() : null);

        var builtFormCode = present(d.built_form) ? parseInt(d.built_form, 10) : null;
        var builtFormStr = (builtFormCode !== null && BUILT_FORM_CODES[builtFormCode])
            ? BUILT_FORM_CODES[builtFormCode] : null;

        var constructionAge = (d.sap_building_parts && d.sap_building_parts.length > 0)
            ? (d.sap_building_parts[0].construction_age_band || null)
            : null;

        var windowsDesc = joinDescriptions(d.windows);
        if (windowsDesc === null && d.window && typeof d.window.description === 'string' && d.window.description.length > 0) {
            windowsDesc = d.window.description;
        }

        var src = d.sap_energy_source || {};
        var mainsGas = present(src.mains_gas) ? src.mains_gas
            : present(src.main_gas) ? src.main_gas
                : present(d.mains_gas) ? d.mains_gas : null;

        return {
            certificateNumber:    d.certificate_number || null,
            address:              certAddrParts.join(', '),
            postcode:             d.postcode ? d.postcode.replace(/\+/g, ' ') : null,
            postTown:             d.post_town || null,
            propertyType:         propertyTypeStr,
            builtForm:            builtFormStr,
            totalFloorArea:       parseFloat(d.total_floor_area) || null,
            currentEnergyRating:  d.current_energy_efficiency_band || null,
            floorDescription:     joinDescriptions(d.floors),
            wallsDescription:     joinDescriptions(d.walls),
            roofDescription:      joinDescriptions(d.roofs),
            constructionAgeBand:  constructionAge,
            lodgementDate:        d.registration_date || null,
            habitableRooms:       parseFloat(d.habitable_room_count) || null,
            uprn:                 d.uprn || null,
            windowsDescription:   windowsDesc,
            mainsGas:             mainsGas,
            rawKeys:              Object.keys(d).sort()
        };
    }

    return {
        LIB_VERSION: LIB_VERSION,
        search: search,
        certificate: certificate,
        mapCertificate: mapCertificate,
        validCertificateNumber: validCertificateNumber
    };
});
