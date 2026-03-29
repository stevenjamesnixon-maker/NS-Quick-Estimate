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
            log.error('UFH RESTlet GET error', JSON.stringify({ name: e.name, message: e.message, stack: e.stack }));
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
        try {
            var floorConstructionSearch = search.create({
                type: search.Type.ASSEMBLY_ITEM,
                filters: [
                    ['custitem_prod_type', search.Operator.IS, '2'],
                    'AND',
                    ['custitem_fc_group', search.Operator.ANYOF, ['1', '2', '3']],
                    'AND',
                    ['isinactive', search.Operator.IS, false],
                    'AND',
                    // Allowlist — add new floor construction item IDs here to make them available in the tool
                    ['name', search.Operator.ANYOF, [
                        'SC(150)14', 'SSE(150)14', 'LP(150)10', 'LPM(150)10',
                        'ND(150)14', 'TF2+(150)12', 'DPJ(133)14', 'TPBA(400)14',
                        'OT2(120)12', 'FF25(150)16', 'LB2+(150)12', 'DPL(175)14',
                        'TF2(150)12'
                    ]]
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

            // Collect raw search result objects first
            var results = [];
            var pageData = floorConstructionSearch.runPaged({ pageSize: 1000 });

            pageData.pageRanges.forEach(function(pageRange) {
                var page = pageData.fetch({ index: pageRange.index });
                page.data.forEach(function(result) {
                    results.push(result);
                });
            });

            // Process raw results into output — each result in its own try/catch
            // so a bad record is skipped rather than crashing the whole response.
            var output = [];
            for (var i = 0; i < results.length; i++) {
                try {
                    var result     = results[i];
                    var displayname = result.getValue({ name: 'displayname' });
                    var salesDesc   = result.getValue({ name: 'salesdescription' });

                    // custitem_fc_group may come back as an object { value, text }
                    // or as a plain number/string — handle both.
                    var groupRaw = result.getValue({ name: 'custitem_fc_group' });
                    var groupVal = (groupRaw !== null && groupRaw !== undefined)
                        ? (typeof groupRaw === 'object' ? groupRaw.value : groupRaw)
                        : null;

                    // Spacing and diameter: default to null if missing rather than throwing.
                    var spacingRaw  = result.getValue({ name: 'custitem_qdt_pipe_spacing' });
                    var diameterRaw = result.getValue({ name: 'custitem_qdt_pipe_diameter' });

                    output.push({
                        itemid:                     result.getValue({ name: 'itemid' }),
                        internalid:                 result.id,
                        custitem_fc_group:          groupVal !== null ? parseInt(groupVal, 10) : null,
                        custitem_qdt_pipe_spacing:  (spacingRaw  !== null && spacingRaw  !== undefined) ? spacingRaw  : null,
                        custitem_qdt_pipe_diameter: (diameterRaw !== null && diameterRaw !== undefined) ? diameterRaw : null,
                        label:                      displayname || salesDesc || ''
                    });
                } catch (e) {
                    log.error('Result processing error at index ' + i, JSON.stringify({ name: e.name, message: e.message, result: JSON.stringify(results[i]) }));
                }
            }

            // Sort by group ID (ascending), then by itemid (alphabetical)
            output.sort(function(a, b) {
                var groupDiff = (a.custitem_fc_group || 0) - (b.custitem_fc_group || 0);
                if (groupDiff !== 0) return groupDiff;
                if (a.itemid < b.itemid) return -1;
                if (a.itemid > b.itemid) return 1;
                return 0;
            });

            return { success: true, data: output };

        } catch (e) {
            log.error('getFloorConstructions error', JSON.stringify({ name: e.name, message: e.message, stack: e.stack }));
            return { success: false, error: e.message || String(e) };
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // action = getItemPrices
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Accepts a comma-separated list of item name/itemid values via the
     * "itemids" query parameter (e.g. DSSB5-C,OMS06-C,OMDA-C) and returns
     * price and cost data keyed by itemid.
     *
     * Fields returned per item:
     *   itemid
     *   internalid
     *   custrecord_price_homeowner   – homeowner price level
     *   custrecord_price_installer   – installer price level
     *   cost                         – standard cost
     *
     * !! IMPORTANT – PLACEHOLDER FIELD NAMES !!
     * custrecord_price_homeowner and custrecord_price_installer are
     * PLACEHOLDER names.  The correct custom field IDs for the two price
     * levels must be confirmed with the client before going live and
     * substituted here.
     *
     * Items not found are included with { notFound: true } so the front end
     * can identify missing items without an error being thrown.
     *
     * @param {Object} params - Request parameters; expects params.itemids
     * @returns {Object} { success: true, data: { [itemid]: {...} } } or { success: false, error: string }
     */
    function getItemPrices(params) {
        var rawIds = params.itemids || '';
        if (!rawIds) {
            return { success: false, error: 'No itemids supplied' };
        }

        var itemIdList = rawIds.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
        if (itemIdList.length === 0) {
            return { success: false, error: 'No valid itemids supplied' };
        }

        var result = {};

        // Initialise all requested items as notFound so anything that doesn't
        // come back from the search is included with the correct flag.
        itemIdList.forEach(function(id) {
            result[id] = { notFound: true };
        });

        // Use search.lookupFields for each item — more efficient than loading
        // the full item record when only a handful of fields are needed.
        itemIdList.forEach(function(itemCode) {
            try {
                // Find the internal ID by searching on the itemid (name) field
                var idSearch = search.create({
                    type: search.Type.ITEM,
                    filters: [
                        ['name', search.Operator.IS, itemCode]
                    ],
                    columns: [
                        search.createColumn({ name: 'internalid' })
                    ]
                });

                var idResults = idSearch.run().getRange({ start: 0, end: 1 });
                if (!idResults || idResults.length === 0) {
                    // Already initialised as notFound above — nothing to do
                    return;
                }

                var internalId = idResults[0].id;

                // !! IMPORTANT — REPLACE PLACEHOLDER FIELD NAMES BELOW !!
                // custrecord_price_homeowner and custrecord_price_installer
                // must be replaced with the correct price level field IDs
                // once confirmed with the client.
                var fields = search.lookupFields({
                    type: search.Type.ITEM,
                    id: internalId,
                    columns: [
                        'itemid',
                        'cost',
                        'custrecord_price_homeowner',   // ← REPLACE with confirmed field ID
                        'custrecord_price_installer'    // ← REPLACE with confirmed field ID
                    ]
                });

                result[itemCode] = {
                    itemid:                      fields.itemid || itemCode,
                    internalid:                  internalId,
                    custrecord_price_homeowner:  fields.custrecord_price_homeowner || null,
                    custrecord_price_installer:  fields.custrecord_price_installer || null,
                    cost:                        fields.cost || null
                };

            } catch (itemErr) {
                log.error({ title: 'getItemPrices – error looking up ' + itemCode, details: itemErr });
                // Leave as notFound rather than aborting the whole request
            }
        });

        return { success: true, data: result };
    }

    return { get: get };
});
