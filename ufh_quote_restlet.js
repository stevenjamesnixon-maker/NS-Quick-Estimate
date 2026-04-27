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
     * Proxies requests to the DLUHC EPC Open Data Communities API.
     * Credentials are read from Script Parameters (custscript_epc_email and
     * custscript_epc_api_key) and combined into a Basic Auth header.
     *
     * Sub-modes (determined by which param is present):
     *   params.postcode  → address search — returns a sorted list of EPC rows
     *   params.lmkKey    → certificate lookup — returns a single certificate object
     *
     * @param {Object} params - Query-string parameters from the request
     * @returns {string} JSON string
     */
    function getEpcData(params) {
        try {
            var script    = runtime.getCurrentScript();
            var epcEmail  = script.getParameter({ name: 'custscript_epc_email' });
            var epcApiKey = script.getParameter({ name: 'custscript_epc_api_key' });

            var token = encode.convert({
                string: epcEmail + ':' + epcApiKey,
                inputEncoding: encode.Encoding.UTF_8,
                outputEncoding: encode.Encoding.BASE_64
            });
            var authHeader = 'Basic ' + token;

            /* ── Address search ── */
            if (params.postcode) {
                var searchUrl = 'https://epc.opendatacommunities.org/api/v1/domestic/search?postcode=' +
                    encodeURIComponent(params.postcode) + '&size=25';

                var searchResponse = https.get({
                    url: searchUrl,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    }
                });

                if (searchResponse.code !== 200) {
                    return JSON.stringify({
                        success: false,
                        error: 'EPC API returned status ' + searchResponse.code,
                        statusCode: searchResponse.code
                    });
                }

                var searchBody = JSON.parse(searchResponse.body);
                var rawRows    = (searchBody && searchBody.rows) ? searchBody.rows : [];

                if (rawRows.length === 0) {
                    return JSON.stringify({
                        success: true,
                        type: 'addressList',
                        rows: [],
                        message: 'No EPC certificates found for this postcode'
                    });
                }

                var mappedRows = rawRows.map(function(row) {
                    return {
                        lmkKey:         row['lmk-key'],
                        address:        row['address'],
                        postcode:       row['postcode'],
                        lodgementDate:  row['lodgement-date'],
                        propertyType:   row['property-type'],
                        totalFloorArea: row['total-floor-area']
                    };
                });

                /* Sort by lodgement-date descending (most recent first) */
                mappedRows.sort(function(a, b) {
                    if (a.lodgementDate > b.lodgementDate) return -1;
                    if (a.lodgementDate < b.lodgementDate) return 1;
                    return 0;
                });

                return JSON.stringify({
                    success: true,
                    type: 'addressList',
                    rows: mappedRows
                });
            }

            /* ── Certificate lookup ── */
            if (params.lmkKey) {
                var certUrl = 'https://epc.opendatacommunities.org/api/v1/domestic/certificate/' +
                    encodeURIComponent(params.lmkKey);

                var certResponse = https.get({
                    url: certUrl,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    }
                });

                if (certResponse.code !== 200) {
                    return JSON.stringify({
                        success: false,
                        error: 'EPC API returned status ' + certResponse.code,
                        statusCode: certResponse.code
                    });
                }

                var certBody = JSON.parse(certResponse.body);
                var row      = certBody.rows && certBody.rows[0];

                return JSON.stringify({
                    success: true,
                    type: 'certificate',
                    data: {
                        lmkKey:               row['lmk-key'],
                        address:              row['address'],
                        postcode:             row['postcode'],
                        propertyType:         row['property-type'],
                        builtForm:            row['built-form'] || null,
                        totalFloorArea:       parseFloat(row['total-floor-area']) || null,
                        currentEnergyRating:  row['current-energy-rating'],
                        floorDescription:     row['floor-description'],
                        wallsDescription:     row['walls-description'],
                        roofDescription:      row['roof-description'],
                        constructionAgeBand:  row['construction-age-band'],
                        lodgementDate:        row['lodgement-date'],
                        habitableRooms:       parseFloat(row['number-habitable-rooms']) || null,
                        uprn:                 row['uprn'] || null
                    }
                });
            }

            return JSON.stringify({ success: false, error: 'getEpcData requires postcode or lmkKey parameter' });

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
            /* Bare search -- no filters, just confirm search.Type.CUSTOMER returns anything */
            var bareResults = [];
            search.create({
                type: search.Type.CUSTOMER,
                columns: [
                    search.createColumn({ name: 'internalId' }),
                    search.createColumn({ name: 'entityId' }),
                    search.createColumn({ name: 'companyName' }),
                    search.createColumn({ name: 'firstName' }),
                    search.createColumn({ name: 'lastName' }),
                    search.createColumn({ name: 'type' })
                ]
            }).run().each(function(result) {
                bareResults.push({
                    internalid:  result.getValue({ name: 'internalId' }),
                    entityid:    result.getValue({ name: 'entityId' }),
                    companyname: result.getValue({ name: 'companyName' }),
                    firstname:   result.getValue({ name: 'firstName' }),
                    lastname:    result.getValue({ name: 'lastName' }),
                    type:        result.getText({ name: 'type' })
                });
                return bareResults.length < 5;
            });

            /* Full filtered search */
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
                    search.createColumn({ name: 'email' }),
                    search.createColumn({ name: 'type' })
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
                    type:        result.getText({ name: 'type' })
                });
                return filteredResults.length < 10;
            });

            return JSON.stringify({
                success: true,
                debug: {
                    q: q,
                    bareCount: bareResults.length,
                    bareSample: bareResults,
                    filteredCount: filteredResults.length
                },
                results: filteredResults
            });

        } catch(e) {
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
