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

define(['N/search', 'N/log'], function(search, log) {

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
                    ['name', search.Operator.IS, 'TF2(150)12']
                ]
            ],
            columns: [
                search.createColumn({ name: 'itemid' }),
                search.createColumn({ name: 'internalid' }),
                search.createColumn({ name: 'custitem_fc_group' }),
                search.createColumn({ name: 'custitem_qdt_pipe_spacing' }),
                search.createColumn({ name: 'custitem_qdt_pipe_diameter' }),
                search.createColumn({ name: 'displayname' }),
                search.createColumn({ name: 'salesdescription' })
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

                results.push({
                    itemid:                       result.getValue({ name: 'itemid' }),
                    internalid:                   result.id,
                    custitem_fc_group:            groupRaw ? parseInt(groupRaw, 10) : null,
                    custitem_qdt_pipe_spacing:    result.getValue({ name: 'custitem_qdt_pipe_spacing' }),
                    custitem_qdt_pipe_diameter:   result.getValue({ name: 'custitem_qdt_pipe_diameter' }),
                    label:                        displayname || salesDesc || ''
                });
            });
        });

        // Sort by group ID (ascending), then by itemid (alphabetical)
        results.sort(function(a, b) {
            var groupDiff = (a.custitem_fc_group || 0) - (b.custitem_fc_group || 0);
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
                    price:        parseFloat(row.getValue({ name: 'unitprice', join: 'pricing' })) || 0,
                    pricelevelid: priceLevelId
                };

            } catch (itemErr) {
                log.error({ title: 'getItemPrices – error looking up ' + itemCode, details: itemErr });
            }
        });

        return JSON.stringify({ success: true, data: result });
    }

    return { get: get };
});
