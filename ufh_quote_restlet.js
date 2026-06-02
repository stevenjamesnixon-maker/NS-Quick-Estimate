/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 *
 * Nu-Heat UFH Quick Quote Tool - RESTlet
 *
 * ============================================================
 * DEPLOYMENT INSTRUCTIONS
 * ============================================================
 * This RESTlet requires the following setup in NetSuite before
 * it can be called from the browser:
 *
 * 1. Upload this file to File Cabinet > SuiteScripts
 * 2. Go to Customization > Scripting > Scripts > New
 * 3. Select this file and set Script Type to "RESTlet"
 * 4. Map the GET function to the entry point named "get"
 * 5. Save and deploy the script:
 *    - Go to the Deployments subtab on the Script record
 *    - Set Status to "Released"
 *    - Set Audience as appropriate (e.g. specific role or all employees)
 * 6. Copy the generated External URL from the deployment record
 *    and update the RESTLET_URL constant in ufh_quote_suitelet_v3.2.js
 * ============================================================
 */

define(['N/search', 'N/log', 'N/https', 'N/encode', 'N/runtime', 'N/record'], function(search, log, https, encode, runtime, record) {

    /**
     * GET entry point — routes to the correct handler based on the
     * "action" query parameter.
     *
     * @param {Object} params - Query-string parameters from the request
     * @returns {Object|Array} JSON response
     */
    function get(params) {
        var action = params.action;

        try {
            if (action === 'getFloorConstructions') {
                return getFloorConstructions();
            }

            if (action === 'getItemPrices') {
                return getItemPrices(params);
            }

            if (action === 'getEpcData') {
                return getEpcData(params);
            }

            if (action === 'searchEntities') {
                return searchEntities(params);
            }

            return { success: false, error: 'Unknown action: ' + action };

        } catch (e) {
            log.error({ title: 'UFH RESTlet GET error', details: e });
            return { success: false, error: e.message || String(e) };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // action = getFloorConstructions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns all active Assembly items where:
     *   custitem_prod_type  = "Floor Construction"
     *   custitem_fc_group   is 1, 2, or 3  (groups 4 and 6 excluded)
     *
     * Each result contains:
     *   itemid                   – the item code (name field)
     *   internalid
     *   custitem_fc_group        – numeric group ID
     *   custitem_qdt_pipe_spacing
     *   custitem_qdt_pipe_diameter
     *   label                    – displayname (falls back to salesdescription)
     *
     * Results are sorted by group ID then by item name.
     *
     * @returns {Object} { success: true, data: Array } or { success: false, error: string }
     */
    function getFloorConstructions() {
        var floorConstructionSearch = search.create({
            type: search.Type.ASSEMBLY_ITEM,
            filters: [
                ['custitem_prod_type', search.Operator.ANYOF, ['2']],
                'AND',
                ['custitem_fc_group', search.Operator.ANYOF, ['1', '2', '3']],
                'AND',
                ['isinactive', search.Operator.IS, 'F'],
                'AND',
                [
                    ['name', search.Operator.IS, 'SC(150)14'],
                    'OR',
                    ['name', search.Operator.IS, 'SSE(150)14'],
                    'OR',
                    ['name', search.Operator.IS, 'LP(150)10'],
                    'OR',
                    ['name', search.Operator.IS, 'LPM(150)10'],
                    'OR',
                    ['name', search.Operator.IS, 'ND(150)14'],
                    'OR',
                    ['name', search.Operator.IS, 'TF2+(150)12'],
                    'OR',
                    ['name', search.Operator.IS, 'DPJ(133)14'],
                    'OR',
                    ['name', search.Operator.IS, 'TPBA(400)14'],
                    'OR',
                    ['name', search.Operator.IS, 'OT2(120)12'],
                    'OR',
                    ['name', search.Operator.IS, 'FF25(150)16'],
                    'OR',
                    ['name', search.Operator.IS, 'LB2+(150)12'],
                    'OR',
                    ['name', search.Operator.IS, 'DPL(175)14'],
                    'OR',
                    ['name', search.Operator.IS, 'TF2(150)12'],
                    'OR',
                    ['name', search.Operator.IS, 'LB2(150)12'],
                    'OR',
                    ['name', search.Operator.IS, 'UL2(150)12']
                ]
            ],
            columns: [
                search.createColumn({ name: 'itemid' }),
                search.createColumn({ name: 'internalid' }),
                search.createColumn({ name: 'custitem_fc_group' }),
                search.createColumn({ name: 'custitem_qdt_pipe_spacing' }),
                search.createColumn({ name: 'custitem_qdt_pipe_diameter' }),
                search.createColumn({ name: 'displayname' }),
                search.createColumn({ name: 'salesdescription' }),
                search.createColumn({ name: 'custitem_qdt_pallets_per_sqm' })
            ]
        });

        var results = [];
        var pageData = floorConstructionSearch.runPaged({ pageSize: 1000 });

        pageData.pageRanges.forEach(function(pageRange) {
            var page = pageData.fetch({ index: pageRange.index });
            page.data.forEach(function(result) {
                var displayname   = result.getValue({ name: 'displayname' });
                var salesDesc     = result.getValue({ name: 'salesdescription' });
                var groupRaw      = result.getValue({ name: 'custitem_fc_group' });
                var groupValue    = (groupRaw && typeof groupRaw === 'object') ? groupRaw.value : groupRaw;

                results.push({
                    itemid:         result.getValue({ name: 'itemid' }),
                    internalid:     result.id,
                    fcGroup:        groupValue ? parseInt(groupValue, 10) : null,
                    pipeSpacing:    result.getValue({ name: 'custitem_qdt_pipe_spacing' }),
                    pipeDiameter:   result.getValue({ name: 'custitem_qdt_pipe_diameter' }),
                    palletsPerSqm:  parseFloat(result.getValue({ name: 'custitem_qdt_pallets_per_sqm' })) || 0,
                    label:          displayname || salesDesc || ''
                });
            });
        });

        // Sort by group ID (ascending), then by itemid (alphabetical)
        results.sort(function(a, b) {
            var groupDiff = (a.fcGroup || 0) - (b.fcGroup || 0);
            if (groupDiff !== 0) return groupDiff;
            if (a.itemid < b.itemid) return -1;
            if (a.itemid > b.itemid) return 1;
            return 0;
        });

        return { success: true, data: results };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // action = getItemPrices
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Accepts a comma-separated list of item codes via "itemids" and a price
     * level internal ID via "pricelevelid".  Returns price data keyed by itemid.
     *
     * Each found item returns:
     *   itemid        – the item code
     *   price         – unit price at the requested price level (parsed as float)
     *   pricelevelid  – the price level ID that was queried
     *
     * Items not found (no match for the name + price level combination) are
     * included with { notFound: true } so the front end can identify missing
     * items without an error being thrown.
     *
     * @param {Object} params - expects params.itemids and params.pricelevelid
     * @returns {string} JSON string: { success: true, data: { [itemid]: {...} } }
     */
    function getItemPrices(params) {
        var rawIds      = params.itemids      || '';
        var priceLevelId = params.pricelevelid || '';

        if (!rawIds) {
            return JSON.stringify({ success: false, error: 'No itemids supplied' });
        }

        var itemIdList = rawIds.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
        if (itemIdList.length === 0) {
            return JSON.stringify({ success: false, error: 'No valid itemids supplied' });
        }

        var result = {};

        // Initialise all requested items as notFound before the search loop.
        itemIdList.forEach(function(id) {
            result[id] = { notFound: true };
        });

        itemIdList.forEach(function(itemCode) {
            try {
                var itemSearch = search.create({
                    type: search.Type.ITEM,
                    filters: [
                        ['name', search.Operator.IS, itemCode],
                        'AND',
                        ['isinactive', search.Operator.IS, 'F'],
                        'AND',
                        ['pricing.pricelevel', search.Operator.ANYOF, [priceLevelId]]
                    ],
                    columns: [
                        search.createColumn({ name: 'itemid' }),
                        search.createColumn({ name: 'internalId' }),
                        search.createColumn({ name: 'unitprice', join: 'pricing' }),
                        search.createColumn({ name: 'pricelevel', join: 'pricing' })
                    ]
                });

                var rows = itemSearch.run().getRange({ start: 0, end: 1 });
                if (!rows || rows.length === 0) {
                    return;
                }

                var row = rows[0];
                result[itemCode] = {
                    itemid:       row.getValue({ name: 'itemid' }) || itemCode,
                    internalid:   row.getValue({ name: 'internalId' }),
                    price:        parseFloat(row.getValue({ name: 'unitprice', join: 'pricing' })) || 0,
                    pricelevelid: priceLevelId
                };

            } catch (itemErr) {
                log.error({ title: 'getItemPrices – error looking up ' + itemCode, details: itemErr });
            }
        });

        return JSON.stringify({ success: true, data: result });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // action = getEpcData
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Proxies requests to the GOV.UK EPC API (api.get-energy-performance-data.communities.gov.uk).
     * Auth token is read from Script Parameter custscript_epc_bearer_token (Bearer scheme).
     *
     * Sub-modes (determined by which param is present):
     *   params.postcode          → address search — returns a sorted list of EPC rows
     *   params.certificateNumber → certificate lookup — returns a single certificate object
     *
     * ROLLBACK RETAINED: custscript_epc_email and custscript_epc_api_key reads are kept
     * below but unused. Remove the bearer token param and restore the Basic auth block
     * to revert to the old opendatacommunities.org API.
     *
     * @param {Object} params - Query-string parameters from the request
     * @returns {string} JSON string
     */
    function getEpcData(params) {

        /*
         * Property-type integer codes returned by the new API certificate endpoint.
         * The old API returned human-readable strings; the new API returns integer codes
         * in property_type. The front-end ptMap requires lowercase strings ("house" etc.).
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
         * Built-form integer codes returned by the new API certificate endpoint.
         * The old API returned human-readable strings; the new API returns integer codes.
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

        try {
            var script = runtime.getCurrentScript();

            /* Retained for rollback only — not used while bearer token is active */
            /* var epcEmail  = script.getParameter({ name: 'custscript_epc_email' }); */
            /* var epcApiKey = script.getParameter({ name: 'custscript_epc_api_key' }); */

            var epcBearerToken = script.getParameter({ name: 'custscript_epc_bearer_token' });

            if (!epcBearerToken) {
                return JSON.stringify({
                    success: false,
                    error: 'EPC bearer token is not configured. Set custscript_epc_bearer_token in Script Parameters.'
                });
            }

            var authHeader = 'Bearer ' + epcBearerToken;

            /* ── Address search ── */
            if (params.postcode) {
                var searchUrl = 'https://api.get-energy-performance-data.communities.gov.uk/api/domestic/search?postcode=' +
                    encodeURIComponent(params.postcode);

                var searchResponse = https.get({
                    url: searchUrl,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    }
                });

                if (searchResponse.code === 404) {
                    return JSON.stringify({
                        success: true,
                        type: 'addressList',
                        rows: [],
                        message: 'No EPC certificates found for this postcode'
                    });
                }

                if (searchResponse.code !== 200) {
                    var searchErrMsg = 'EPC API returned status ' + searchResponse.code;
                    try {
                        var searchErrBody = JSON.parse(searchResponse.body);
                        if (searchErrBody && searchErrBody.message) { searchErrMsg = searchErrBody.message; }
                    } catch (ignored) {}
                    return JSON.stringify({
                        success: false,
                        error: searchErrMsg,
                        statusCode: searchResponse.code
                    });
                }

                var searchBody = JSON.parse(searchResponse.body);
                var rawRows    = (searchBody && searchBody.data) ? searchBody.data : [];

                if (rawRows.length === 0) {
                    return JSON.stringify({
                        success: true,
                        type: 'addressList',
                        rows: [],
                        message: 'No EPC certificates found for this postcode'
                    });
                }

                var mappedRows = rawRows.map(function(row) {
                    var addrParts = [
                        row.addressLine1 || null,
                        row.addressLine2 || null,
                        row.addressLine3 || null,
                        row.addressLine4 || null
                    ].filter(function(p) { return p && p.length > 0; });
                    var composedAddress = addrParts.join(', ');

                    var displayPostcode = row.postcode ? row.postcode.replace(/\+/g, ' ') : '';

                    return {
                        certificateNumber: row.certificateNumber,
                        address:           composedAddress,
                        postcode:          displayPostcode,
                        postTown:          row.postTown || null,
                        registrationDate:  row.registrationDate || null
                    };
                });

                /* Sort by registrationDate descending (most recent first) */
                mappedRows.sort(function(a, b) {
                    if (a.registrationDate > b.registrationDate) return -1;
                    if (a.registrationDate < b.registrationDate) return 1;
                    return 0;
                });

                return JSON.stringify({
                    success: true,
                    type: 'addressList',
                    rows: mappedRows
                });
            }

            /* ── Certificate lookup ── */
            if (params.certificateNumber) {
                /* Validate 20-digit hyphenated format: XXXX-XXXX-XXXX-XXXX-XXXX */
                var certNumPattern = /^\d{4}-\d{4}-\d{4}-\d{4}-\d{4}$/;
                if (!certNumPattern.test(params.certificateNumber)) {
                    return JSON.stringify({
                        success: false,
                        error: 'Invalid certificateNumber format. Expected 20-digit hyphenated value, e.g. 1111-2222-3333-4444-5555.',
                        statusCode: 400
                    });
                }

                var certUrl = 'https://api.get-energy-performance-data.communities.gov.uk/api/certificate?certificate_number=' +
                    encodeURIComponent(params.certificateNumber);

                var certResponse = https.get({
                    url: certUrl,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    }
                });

                if (certResponse.code !== 200) {
                    var certErrMsg = 'EPC API returned status ' + certResponse.code;
                    try {
                        var certErrBody = JSON.parse(certResponse.body);
                        if (certErrBody && certErrBody.message) { certErrMsg = certErrBody.message; }
                    } catch (ignored) {}
                    return JSON.stringify({
                        success: false,
                        error: certErrMsg,
                        statusCode: certResponse.code
                    });
                }

                var certBody = JSON.parse(certResponse.body);
                var d        = certBody.data;

                /*
                 * Field extraction notes (verified against RdSAP-Schema-21.0.1 JSON sample):
                 *
                 * property_type  — integer code in new API (0=house, 1=bungalow, 2=flat, 3=maisonette).
                 *                  Mapped via PROPERTY_TYPE_CODES to the lowercase string the front-end ptMap expects.
                 *                  Falls back to dwelling_type string if code not in map.
                 *
                 * built_form     — integer code in new API (1=Detached … 6=Enclosed Mid-Terrace).
                 *                  Mapped via BUILT_FORM_CODES to a display string. Front-end only uses for
                 *                  display (not calculations), so a null fallback is safe.
                 *
                 * floors/walls/roofs — arrays of objects; description is nested as description.value.
                 *                  First element taken; null-safe chained access used.
                 *
                 * construction_age_band — nested inside sap_building_parts[0], not top-level.
                 *
                 * habitable_room_count — confirmed key in new schema (old API used number-habitable-rooms).
                 *
                 * certificate_number — not present in warehouse JSON sample; likely injected by API layer.
                 *                  Mapped defensively; falls back to the param we sent.
                 *
                 * address_line_2..4 — not present in RdSAP-21.0.1 sample; only address_line_1 confirmed.
                 *                  Filter applied defensively as in search mapping.
                 */

                var certAddrParts = [
                    d.address_line_1 || null,
                    d.address_line_2 || null,
                    d.address_line_3 || null,
                    d.address_line_4 || null
                ].filter(function(p) { return p && p.length > 0; });
                var certAddress = certAddrParts.join(', ');

                var certPostcode = d.postcode ? d.postcode.replace(/\+/g, ' ') : null;

                var propertyTypeCode = (d.property_type !== undefined && d.property_type !== null)
                    ? parseInt(d.property_type, 10) : null;
                var propertyTypeStr = (propertyTypeCode !== null && PROPERTY_TYPE_CODES[propertyTypeCode])
                    ? PROPERTY_TYPE_CODES[propertyTypeCode]
                    : (d.dwelling_type ? d.dwelling_type.toLowerCase() : null);

                var builtFormCode = (d.built_form !== undefined && d.built_form !== null)
                    ? parseInt(d.built_form, 10) : null;
                var builtFormStr = (builtFormCode !== null && BUILT_FORM_CODES[builtFormCode])
                    ? BUILT_FORM_CODES[builtFormCode] : null;

                var floorDesc = (d.floors && d.floors[0] && d.floors[0].description)
                    ? (d.floors[0].description.value || d.floors[0].description || null)
                    : null;

                var wallsDesc = (d.walls && d.walls[0] && d.walls[0].description)
                    ? (d.walls[0].description.value || d.walls[0].description || null)
                    : null;

                var roofDesc = (d.roofs && d.roofs[0] && d.roofs[0].description)
                    ? (d.roofs[0].description.value || d.roofs[0].description || null)
                    : null;

                var constructionAge = (d.sap_building_parts && d.sap_building_parts[0])
                    ? (d.sap_building_parts[0].construction_age_band || null)
                    : null;

                return JSON.stringify({
                    success: true,
                    type: 'certificate',
                    data: {
                        certificateNumber:    d.certificate_number || params.certificateNumber,
                        address:              certAddress,
                        postcode:             certPostcode,
                        postTown:             d.post_town || null,
                        propertyType:         propertyTypeStr,
                        builtForm:            builtFormStr,
                        totalFloorArea:       parseFloat(d.total_floor_area) || null,
                        currentEnergyRating:  d.current_energy_efficiency_band || null,
                        floorDescription:     floorDesc,
                        wallsDescription:     wallsDesc,
                        roofDescription:      roofDesc,
                        constructionAgeBand:  constructionAge,
                        lodgementDate:        d.registration_date || null,
                        habitableRooms:       parseFloat(d.habitable_room_count) || null,
                        uprn:                 d.uprn || null
                    }
                });
            }

            return JSON.stringify({ success: false, error: 'getEpcData requires postcode or certificateNumber parameter' });

        } catch (e) {
            log.error({ title: 'getEpcData error', details: e });
            return JSON.stringify({ success: false, error: e.message });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // action = searchEntities
    // ─────────────────────────────────────────────────────────────────────────

    function searchEntities(params) {
        var q = params.q;

        if (!q || q.length < 2) {
            return JSON.stringify({ success: false, error: 'Query too short' });
        }

        try {
            var filters = [
                ['type', search.Operator.ANYOF, ['CustJob', 'Lead', 'Prospect']],
                'AND',
                ['isinactive', search.Operator.IS, 'F'],
                'AND',
                [
                    ['companyname', search.Operator.CONTAINS, q],
                    'OR',
                    ['firstname', search.Operator.CONTAINS, q],
                    'OR',
                    ['lastname', search.Operator.CONTAINS, q]
                ]
            ];

            var filteredResults = [];
            search.create({
                type: search.Type.CUSTOMER,
                columns: [
                    search.createColumn({ name: 'internalId' }),
                    search.createColumn({ name: 'entityId' }),
                    search.createColumn({ name: 'companyName' }),
                    search.createColumn({ name: 'firstName' }),
                    search.createColumn({ name: 'lastName' }),
                    search.createColumn({ name: 'email' })
                ],
                filters: filters
            }).run().each(function(result) {
                filteredResults.push({
                    internalid:  result.getValue({ name: 'internalId' }),
                    entityid:    result.getValue({ name: 'entityId' }),
                    companyname: result.getValue({ name: 'companyName' }),
                    firstname:   result.getValue({ name: 'firstName' }),
                    lastname:    result.getValue({ name: 'lastName' }),
                    email:       result.getValue({ name: 'email' }),
                    type:        ''
                });
                return filteredResults.length < 10;
            });

            return JSON.stringify({ success: true, results: filteredResults });

        } catch(e) {
            log.error({ title: 'searchEntities error', details: e });
            return JSON.stringify({ success: false, error: e.message, stack: e.stack });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST entry point
    // ─────────────────────────────────────────────────────────────────────────

    function post(body) {
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (pe) {
                return JSON.stringify({ success: false, error: 'Invalid JSON body' });
            }
        }
        var action = body.action;
        try {
            if (action === 'createEstimate') {
                return createEstimate(body);
            }
            return JSON.stringify({ success: false, error: 'Unknown action: ' + action });
        } catch (e) {
            log.error({ title: 'UFH RESTlet POST error', details: e });
            return JSON.stringify({ success: false, error: e.message || String(e) });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // action = createEstimate
    // ─────────────────────────────────────────────────────────────────────────

    function createEstimate(body) {
        try {
            var currentUser = runtime.getCurrentUser();
            var quotedBy = currentUser.name;

            var estimateRec = record.create({
                type: record.Type.ESTIMATE,
                isDynamic: false
            });

            estimateRec.setValue({ fieldId: 'customform',                value: 113 });
            estimateRec.setValue({ fieldId: 'entity',                    value: body.entityId });
            estimateRec.setValue({ fieldId: 'custbody_quoted_by',        value: quotedBy });
            estimateRec.setValue({ fieldId: 'custbody_quote_type',       value: 25 });
            estimateRec.setValue({ fieldId: 'custbodyquote_site_adress', value: body.siteAddress });

            var items = body.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                estimateRec.setSublistValue({ sublistId: 'item', fieldId: 'item',        line: i, value: item.internalid });
                estimateRec.setSublistValue({ sublistId: 'item', fieldId: 'quantity',    line: i, value: item.quantity });
                estimateRec.setSublistValue({ sublistId: 'item', fieldId: 'description', line: i, value: item.description });
                estimateRec.setSublistValue({ sublistId: 'item', fieldId: 'price',       line: i, value: -1 });
                estimateRec.setSublistValue({ sublistId: 'item', fieldId: 'rate',        line: i, value: item.rate });
            }

            var estimateId = estimateRec.save({});

            return JSON.stringify({
                success:    true,
                estimateId: estimateId,
                tranId:     record.load({ type: record.Type.ESTIMATE, id: estimateId }).getValue({ fieldId: 'tranid' })
            });
        } catch (e) {
            log.error({ title: 'createEstimate error', details: e });
            return JSON.stringify({ success: false, error: e.message });
        }
    }

    return { get: get, post: post };
});
