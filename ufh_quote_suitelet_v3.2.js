/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * 
 * Nu-Heat UFH Quick Quote Tool - Suitelet v5.3
 * 
 * Version: 5.3
 * Changes: Added 5% markup to all cost AND price values
 * Date: 2026-01-29
 * Changes: Updated disclaimer text to prompt for floor plans
 * 
 * Deployment Instructions:
 * 1. Upload this file to File Cabinet > SuiteScripts
 * 2. Create a new Script record (Customization > Scripting > Scripts > New)
 * 3. Select this file and set Script Type to "Suitelet"
 * 4. Deploy the script and set Status to "Released"
 * 5. Access via the generated URL
 */

define(['N/ui/serverWidget', 'N/url'], function(serverWidget, url) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = serverWidget.createForm({
                title: 'Nu-Heat UFH Quick Quote Tool'
            });

            var htmlField = form.addField({
                id: 'custpage_quote_html',
                type: serverWidget.FieldType.INLINEHTML,
                label: ' '
            });

            // Build the RESTlet URL server-side so no environment URL is hardcoded
            // in the client-side HTML.
            // IMPORTANT: Replace 'customscript_ufh_quote_restlet' and
            // 'customdeploy_ufh_quote_restlet' with the actual Script ID and
            // Deployment ID values once the RESTlet has been deployed in NetSuite.
            // The Script ID is visible on the Script record
            // (Customization > Scripting > Scripts > [RESTlet record] > ID field).
            // The Deployment ID is on the Deployment record
            // (same Script record > Deployments subtab > open the deployment > ID field).
            var restletUrl = url.resolveScript({
                scriptId: 'customscript_quick_quote_rl',
                deploymentId: 'customdeploy_quick_quote_rl',
                returnExternalUrl: false
            });

            htmlField.defaultValue = getQuoteToolHTML(restletUrl);
            context.response.writePage(form);
        }
    }

    function getQuoteToolHTML(restletUrl) {
        return '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'    <meta charset="UTF-8">' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'    <style>' +
'        :root {' +
'            --nuheat-green: #2E7D32;' +
'            --nuheat-green-light: #4CAF50;' +
'            --nuheat-green-dark: #1B5E20;' +
'        }' +
'        .quote-container {' +
'            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
'            max-width: 1200px;' +
'            margin: 0 auto;' +
'            padding: 20px;' +
'            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);' +
'            min-height: 100vh;' +
'        }' +
'        .header { text-align: center; margin-bottom: 30px; }' +
'        .header h1 { color: var(--nuheat-green); font-size: 28px; margin-bottom: 8px; }' +
'        .header p { color: #64748b; font-size: 14px; }' +
'        .card {' +
'            background: white;' +
'            border-radius: 12px;' +
'            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);' +
'            padding: 24px;' +
'            margin-bottom: 20px;' +
'        }' +
'        .card-title {' +
'            font-size: 16px;' +
'            font-weight: 600;' +
'            color: #1e293b;' +
'            margin-bottom: 16px;' +
'            display: flex;' +
'            align-items: center;' +
'            gap: 8px;' +
'        }' +
'        .top-inputs {' +
'            display: grid;' +
'            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));' +
'            gap: 16px;' +
'        }' +
'        .form-group { display: flex; flex-direction: column; }' +
'        .form-group label {' +
'            font-size: 12px;' +
'            color: #64748b;' +
'            margin-bottom: 6px;' +
'            font-weight: 500;' +
'        }' +
'        .form-group input, .form-group select {' +
'            padding: 10px 12px;' +
'            border: 1px solid #e2e8f0;' +
'            border-radius: 8px;' +
'            font-size: 14px;' +
'            transition: all 0.2s;' +
'        }' +
'        .form-group input:focus, .form-group select:focus {' +
'            outline: none;' +
'            border-color: var(--nuheat-green);' +
'            box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);' +
'        }' +
'        .btn {' +
'            padding: 10px 20px;' +
'            border-radius: 8px;' +
'            font-size: 14px;' +
'            font-weight: 500;' +
'            cursor: pointer;' +
'            transition: all 0.2s;' +
'            display: inline-flex;' +
'            align-items: center;' +
'            gap: 8px;' +
'        }' +
'        .btn-primary {' +
'            background: var(--nuheat-green);' +
'            color: white;' +
'            border: none;' +
'        }' +
'        .btn-primary:hover { background: var(--nuheat-green-dark); }' +
'        .btn-secondary {' +
'            background: white;' +
'            color: var(--nuheat-green);' +
'            border: 1px solid var(--nuheat-green);' +
'        }' +
'        .btn-secondary:hover { background: rgba(46, 125, 50, 0.05); }' +
'        .btn-danger {' +
'            background: #fee2e2;' +
'            color: #dc2626;' +
'            border: none;' +
'            padding: 6px 10px;' +
'        }' +
'        .btn-danger:hover { background: #fecaca; }' +
'        .btn-copy {' +
'            background: var(--nuheat-green);' +
'            color: white;' +
'            border: none;' +
'            padding: 8px 16px;' +
'            font-size: 13px;' +
'        }' +
'        .btn-copy:hover { background: var(--nuheat-green-dark); }' +
'        .btn-copy.copied { background: #22c55e; }' +
'        .manifold-card {' +
'            border: 1px solid #e2e8f0;' +
'            border-radius: 10px;' +
'            margin-bottom: 16px;' +
'            overflow: hidden;' +
'        }' +
'        .manifold-header {' +
'            background: #f8fafc;' +
'            padding: 12px 16px;' +
'            display: flex;' +
'            justify-content: space-between;' +
'            align-items: center;' +
'            cursor: pointer;' +
'            border-bottom: 1px solid #e2e8f0;' +
'        }' +
'        .manifold-header:hover { background: #f1f5f9; }' +
'        .manifold-title {' +
'            font-weight: 600;' +
'            color: #1e293b;' +
'            display: flex;' +
'            align-items: center;' +
'            gap: 8px;' +
'        }' +
'        .manifold-info { display: flex; align-items: center; gap: 16px; }' +
'        .port-badge {' +
'            background: var(--nuheat-green);' +
'            color: white;' +
'            padding: 4px 12px;' +
'            border-radius: 20px;' +
'            font-size: 12px;' +
'            font-weight: 500;' +
'        }' +
'        .port-badge.error { background: #dc2626; }' +
'        .manifold-content { padding: 16px; display: none; }' +
'        .manifold-content.expanded { display: block; }' +
'        .area-row {' +
'            background: #f8fafc;' +
'            border-radius: 8px;' +
'            padding: 12px;' +
'            margin-bottom: 12px;' +
'        }' +
'        .area-header {' +
'            display: flex;' +
'            justify-content: space-between;' +
'            align-items: center;' +
'            margin-bottom: 12px;' +
'        }' +
'        .area-header span { font-size: 13px; font-weight: 500; color: #475569; }' +
'        .area-inputs {' +
'            display: grid;' +
'            grid-template-columns: repeat(4, 1fr);' +
'            gap: 12px;' +
'        }' +
'        @media (max-width: 768px) {' +
'            .area-inputs { grid-template-columns: 1fr 1fr; }' +
'        }' +
'        .error-message {' +
'            background: #fef2f2;' +
'            border: 1px solid #fecaca;' +
'            color: #dc2626;' +
'            padding: 12px 16px;' +
'            border-radius: 8px;' +
'            margin-top: 12px;' +
'            font-size: 13px;' +
'        }' +
'        .results-section { margin-top: 30px; }' +
'        .summary-grid {' +
'            display: grid;' +
'            grid-template-columns: repeat(3, 1fr);' +
'            gap: 16px;' +
'            margin-bottom: 20px;' +
'        }' +
'        @media (max-width: 768px) {' +
'            .summary-grid { grid-template-columns: 1fr; }' +
'        }' +
'        .summary-box {' +
'            background: #f8fafc;' +
'            border-radius: 8px;' +
'            padding: 16px;' +
'        }' +
'        .summary-box.highlight {' +
'            background: #E8F5E9;' +
'        }' +
'        .summary-box p.label {' +
'            font-size: 12px;' +
'            color: #64748b;' +
'            margin: 0 0 4px 0;' +
'        }' +
'        .summary-box.highlight p.label {' +
'            color: var(--nuheat-green);' +
'        }' +
'        .summary-box p.value {' +
'            font-size: 20px;' +
'            font-weight: 700;' +
'            color: #374151;' +
'            margin: 0;' +
'        }' +
'        .summary-box.highlight p.value {' +
'            font-size: 24px;' +
'            color: var(--nuheat-green);' +
'        }' +
'        .quote-description-box {' +
'            border: 1px solid #e2e8f0;' +
'            border-radius: 8px;' +
'            margin-bottom: 20px;' +
'            overflow: hidden;' +
'        }' +
'        .quote-description-header {' +
'            background: #E8F5E9;' +
'            padding: 12px 16px;' +
'            display: flex;' +
'            justify-content: space-between;' +
'            align-items: center;' +
'        }' +
'        .quote-description-header h4 {' +
'            font-size: 14px;' +
'            font-weight: 600;' +
'            color: var(--nuheat-green);' +
'            margin: 0;' +
'        }' +
'        .quote-description-content {' +
'            padding: 16px;' +
'            background: white;' +
'            font-family: monospace;' +
'            font-size: 13px;' +
'            line-height: 1.6;' +
'            color: #374151;' +
'        }' +
'        .quote-description-content .title {' +
'            font-weight: 600;' +
'            color: #1f2937;' +
'            margin-bottom: 8px;' +
'        }' +
'        .quote-description-content .price-line {' +
'            border-top: 1px solid #e2e8f0;' +
'            margin-top: 12px;' +
'            padding-top: 12px;' +
'            font-weight: 600;' +
'            font-size: 16px;' +
'            color: var(--nuheat-green);' +
'        }' +
'        .quote-description-content .disclaimer {' +
'            font-size: 11px;' +
'            color: #6b7280;' +
'            margin-top: 8px;' +
'        }' +
'        .bom-collapsible {' +
'            border: 1px solid #e2e8f0;' +
'            border-radius: 8px;' +
'            overflow: hidden;' +
'        }' +
'        .bom-header {' +
'            background: #f8fafc;' +
'            padding: 12px 16px;' +
'            display: flex;' +
'            justify-content: space-between;' +
'            align-items: center;' +
'            cursor: pointer;' +
'        }' +
'        .bom-header:hover { background: #f1f5f9; }' +
'        .bom-header h3 {' +
'            font-size: 16px;' +
'            font-weight: 600;' +
'            color: #1e293b;' +
'            margin: 0;' +
'        }' +
'        .bom-header .item-count {' +
'            font-size: 13px;' +
'            color: #64748b;' +
'            margin-right: 8px;' +
'        }' +
'        .bom-content { display: none; padding: 16px; }' +
'        .bom-content.expanded { display: block; }' +
'        .bom-section {' +
'            border: 1px solid #f1f5f9;' +
'            border-radius: 6px;' +
'            margin-bottom: 12px;' +
'            overflow: hidden;' +
'        }' +
'        .bom-section-header {' +
'            background: #f8fafc;' +
'            padding: 8px 12px;' +
'            display: flex;' +
'            justify-content: space-between;' +
'            align-items: center;' +
'            cursor: pointer;' +
'            font-size: 14px;' +
'            font-weight: 500;' +
'            color: #374151;' +
'        }' +
'        .bom-section-header:hover { background: #f1f5f9; }' +
'        .bom-section-content { display: none; }' +
'        .bom-section-content.expanded { display: block; }' +
'        .results-table { width: 100%; border-collapse: collapse; font-size: 14px; }' +
'        .results-table th {' +
'            text-align: left;' +
'            padding: 12px;' +
'            background: #f8fafc;' +
'            color: #64748b;' +
'            font-weight: 500;' +
'            border-bottom: 2px solid #e2e8f0;' +
'        }' +
'        .results-table th:last-child,' +
'        .results-table th:nth-child(3),' +
'        .results-table th:nth-child(4) { text-align: right; }' +
'        .results-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }' +
'        .results-table td:last-child,' +
'        .results-table td:nth-child(3),' +
'        .results-table td:nth-child(4) { text-align: right; }' +
'        .hidden { display: none; }' +
'        .actions { display: flex; gap: 12px; margin-top: 20px; }' +
'        .chevron { transition: transform 0.2s; }' +
'        .chevron.down { transform: rotate(90deg); }' +
'        .fc-spinner {' +
'            display: flex; align-items: center; gap: 8px;' +
'            font-size: 13px; color: #64748b; padding: 10px 12px;' +
'            border: 1px solid #e2e8f0; border-radius: 8px;' +
'        }' +
'        .fc-spinner::before {' +
'            content: ""; width: 14px; height: 14px;' +
'            border: 2px solid #e2e8f0; border-top-color: var(--nuheat-green);' +
'            border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;' +
'        }' +
'        .fc-error-inline {' +
'            font-size: 12px; color: #dc2626; padding: 6px 10px;' +
'            border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2;' +
'        }' +
'        @keyframes spin { to { transform: rotate(360deg); } }' +
'        .join-zone-label { font-size: 12px; color: #475569; display: flex; align-items: center; gap: 6px; margin-top: 4px; cursor: pointer; }' +
'        .join-zone-label input[type="checkbox"] { width: 14px; height: 14px; cursor: pointer; accent-color: var(--nuheat-green); }' +
'    </style>' +
'</head>' +
'<body>' +
'<div class="quote-container">' +
'    <div class="header">' +
'        <h1>Nu-Heat UFH Quick Quote</h1>' +
'        <p>Underfloor Heating Estimate Calculator - v5.3</p>' +
'    </div>' +
'    <div class="card">' +
'        <div class="card-title">Configuration</div>' +
'        <div class="top-inputs">' +
'            <div class="form-group">' +
'                <label>Heat Source</label>' +
'                <select id="heatSource">' +
'                    <option value="Boiler">Boiler</option>' +
'                    <option value="Heat Pump">Heat Pump</option>' +
'                </select>' +
'            </div>' +
'            <div class="form-group">' +
'                <label>Project Type</label>' +
'                <select id="workType" onchange="window.renderFloors()">' +
'                    <option value="New Build" selected>New Build</option>' +
'                    <option value="Renovation (Back to Brick)">Renovation (Back to Brick)</option>' +
'                    <option value="Renovation (Light Touch)">Renovation (Light Touch)</option>' +
'                </select>' +
'            </div>' +
'            <div class="form-group">' +
'                <label>Thermostat Type</label>' +
'                <select id="thermostatType">' +
'                    <option value="Dial" selected>Dial</option>' +
'                    <option value="Wired Programmable">Wired Programmable</option>' +
'                    <option value="Wireless">Wireless</option>' +
'                </select>' +
'            </div>' +
'            <div class="form-group">' +
'                <label>Price Level</label>' +
'                <select id="priceLevel">' +
'                    <option value="13" selected>Homeowner</option>' +
'                    <option value="14">Installer</option>' +
'                    <option value="15">Developer</option>' +
'                    <option value="16">Merchant</option>' +
'                </select>' +
'            </div>' +
'        </div>' +
'    </div>' +
'    <div class="card">' +
'        <div class="card-title">Floors and Manifolds</div>' +
'        <div id="floorsContainer"></div>' +
'        <div class="floor-add-buttons">' +
'            <button type="button" class="btn btn-secondary" onclick="window.addFloor(\'ground\')">+ Add Ground Floor</button>' +
'            <button type="button" class="btn btn-secondary" onclick="window.addFloor(\'lowerground\')">+ Add Lower Ground</button>' +
'            <button type="button" class="btn btn-secondary" onclick="window.addFloor(\'basement\')">+ Add Basement</button>' +
'            <button type="button" class="btn btn-secondary" onclick="window.addFloor(\'upper\')">+ Add Upper Floor</button>' +
'        </div>' +
'    </div>' +
'    <div class="actions">' +
'        <button type="button" class="btn btn-primary" onclick="window.calculateQuote()">' +
'            Calculate Quote' +
'        </button>' +
'    </div>' +
'    <div id="resultsSection" class="results-section hidden">' +
'        <div class="card">' +
'            <div id="errorsContainer"></div>' +
'            <div id="summaryContainer"></div>' +
'            <div id="quoteDescriptionContainer"></div>' +
'            <div id="bomContainer"></div>' +
'        </div>' +
'    </div>' +
'</div>' +
'<script>' +
'/* RESTLET_BASE_URL is injected server-side by the Suitelet using N/url.resolveScript. */' +
'/* It resolves correctly for whichever NetSuite environment (production / sandbox) */' +
'/* the Suitelet is running in — no environment URL is hardcoded here. */' +
'var RESTLET_BASE_URL = ' + JSON.stringify(restletUrl) + ';' +
'' +
'/* Floor constructions — populated at runtime from the RESTlet (action=getFloorConstructions). */' +
'/* Do NOT add hardcoded items here; they are loaded dynamically on page load. */' +
'var FLOOR_CONSTRUCTIONS = [];' +
'var floorConstructionsLoaded = false;' +
'var BOILER_PUMPS = [' +
'    { itemCode: "PM1W/2-A", description: "Manifold-mounted pump module for underfloor heating temperature control.", newBuildArea: 215, renovationArea: 125 },' +
'    { itemCode: "PM2W/3-A", description: "Pump and temperature control module with Wilo variable speed pump and ESBE mixing valve (remote mount)", newBuildArea: 380, renovationArea: 225 },' +
'    { itemCode: "PM3W/3-A", description: "Pump and temperature control module with Wilo high efficiency pump and ESBE electronically controlled mixing valve", newBuildArea: 600, renovationArea: 350 },' +
'    { itemCode: "PM4W/2-A", description: "Pump and temperature control module with Wilo High Flow pump and ESBE electronic mixing valve", newBuildArea: 1050, renovationArea: 615 },' +
'    { itemCode: "PM5W/1-A", description: "Wilo Para HF25/10 pump and 1.5in ESBE electronically controlled mixing valve", newBuildArea: 1500, renovationArea: 905 }' +
'];' +
'var HEAT_PUMP_PUMPS = [' +
'    { itemCode: "W2560SC7-A", description: "Wilo Para SC7 pump (EuP compliant) with valves", newBuildArea: 415, renovationArea: 240 },' +
'    { itemCode: "W2570HF-A", description: "Wilo 2570 HF pump with pump unions", newBuildArea: 700, renovationArea: 410 },' +
'    { itemCode: "W2575SC8-A", description: "Wilo Para RS25/7.5SC8 pump (EuP compliant) with pump valves", newBuildArea: 1250, renovationArea: 730 },' +
'    { itemCode: "W25100HF-A", description: "Wilo 2510 HF pump with fittings", newBuildArea: 1750, renovationArea: 1000 }' +
'];' +
'var MANIFOLDS = [' +
'    { ports: 1,  itemCode: "OMS01-C", description: "1-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 2,  itemCode: "OMS02-C", description: "2-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 3,  itemCode: "OMS03-C", description: "3-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 4,  itemCode: "OMS04-C", description: "4-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 5,  itemCode: "OMS05-C", description: "5-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 6,  itemCode: "OMS06-C", description: "6-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 7,  itemCode: "OMS07-C", description: "7-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 8,  itemCode: "OMS08-C", description: "8-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 9,  itemCode: "OMS09-C", description: "9-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 10, itemCode: "OMS10-C", description: "10-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 11, itemCode: "OMS11-C", description: "11-Port Optiflo control manifolds, stainless steel" },' +
'    { ports: 12, itemCode: "OMS12-C", description: "12-Port Optiflo control manifolds, stainless steel" }' +
'];' +
'var MANIFOLD_CONNECTION = { itemCode: "MCP-A", description: "Isolator pack for Optiflo manifolds" };' +
'/* Thermostats — keyed by Thermostat Type dropdown value. */' +
'var THERMOSTATS = {' +
'    "Dial":               { itemCode: "DSSB5-C",      description: "Dial thermostat" },' +
'    "Wired Programmable": { itemCode: "neoStatWv2-C", description: "White neoStat V2 thermostat, Mains Voltage (240V) wired connection" },' +
'    "Wireless":           { itemCode: "neoAirWv3-C",  description: "Wireless thermostat" }' +
'};' +
'/* Wiring centres — keyed by Thermostat Type dropdown value. */' +
'var WIRING_CENTRES = {' +
'    "Dial":               { itemCode: "UH8-C",   description: "UH8, 8 zone 230V Wiring Centre" },' +
'    "Wired Programmable": { itemCode: "UH8-C",   description: "UH8, 8 zone 230V Wiring Centre" },' +
'    "Wireless":           { itemCode: "UH8RF-C", description: "UH8RF, 8 zone Wireless Wiring Centre" }' +
'};' +
'var ACTUATOR = { itemCode: "OMDA-C", description: "Zone valve actuator" };' +
'var JUNCTION_BOX = { itemCode: "JB12-C", description: "Danfoss connection block" };' +
'var PIPE_COILS = {' +
'    10: { coils: [' +
'        { length: 30,  itemCode: "TPER10/30-C",  description: "10mm x 30m Fastflo pipe" },' +
'        { length: 35,  itemCode: "TPER10/35-C",  description: "10mm x 35m Fastflo pipe" },' +
'        { length: 40,  itemCode: "TPER10/40-C",  description: "10mm x 40m Fastflo pipe" },' +
'        { length: 45,  itemCode: "TPER10/45-C",  description: "10mm x 45m Fastflo pipe" },' +
'        { length: 50,  itemCode: "TPER10/50-C",  description: "10mm x 50m Fastflo pipe" },' +
'        { length: 55,  itemCode: "TPER10/55-C",  description: "10mm x 55m Fastflo pipe" },' +
'        { length: 60,  itemCode: "TPER10/60-C",  description: "10mm x 60m Fastflo pipe" }' +
'    ] },' +
'    12: { coils: [' +
'        { length: 40,  itemCode: "UP120140-A",    description: "12mm OMNIFLO pipe (40m)" },' +
'        { length: 60,  itemCode: "UP120160-A",    description: "12mm OMNIFLO pipe (60m)" },' +
'        { length: 80,  itemCode: "UP120180-A",    description: "12mm OMNIFLO pipe (80m)" }' +
'    ] },' +
'    14: { coils: [' +
'        { length: 40,  itemCode: "WPER14/40-C",  description: "14mm x 40m Fastflo pipe" },' +
'        { length: 50,  itemCode: "WPER14/50-C",  description: "14mm x 50m Fastflo pipe" },' +
'        { length: 60,  itemCode: "WPER14/60-C",  description: "14mm x 60m Fastflo pipe" },' +
'        { length: 70,  itemCode: "WPER14/70-C",  description: "14mm x 70m Fastflo pipe" },' +
'        { length: 80,  itemCode: "WPER14/80-C",  description: "14mm x 80m Fastflo pipe" },' +
'        { length: 90,  itemCode: "WPER14/90-C",  description: "14mm x 90m Fastflo pipe" },' +
'        { length: 100, itemCode: "WPER14/100-C", description: "14mm x 100m Fastflo pipe" },' +
'        { length: 110, itemCode: "WPER14/110-C", description: "14mm x 110m Fastflo pipe" },' +
'        { length: 120, itemCode: "WPER14/120-C", description: "14mm x 120m Fastflo pipe" }' +
'    ] },' +
'    16: { coils: [' +
'        { length: 40,  itemCode: "UP160240-A",   description: "16mm OMNIFLO pipe (40m)" },' +
'        { length: 60,  itemCode: "UP160260-A",   description: "16mm OMNIFLO pipe (60m)" },' +
'        { length: 80,  itemCode: "UP160280-A",   description: "16mm OMNIFLO pipe (80m)" },' +
'        { length: 100, itemCode: "UP160210-A",   description: "16mm OMNIFLO pipe (100m)" },' +
'        { length: 120, itemCode: "UP160212-A",   description: "16mm OMNIFLO pipe (120m)" }' +
'    ] }' +
'};' +
'var PIPE_CONNECTORS = {' +
'    10: { itemCode: "ALE075/10-C", description: "3/4in x 10mm Eurofitting manifold pipe nut, tail and olive" },' +
'    12: { itemCode: "UMFP0112-C",  description: "12mm pipe connectors" },' +
'    14: { itemCode: "ALE075/14-C", description: "3/4in x 14mm Eurofitting manifold pipe nut, tail and olive" },' +
'    16: { itemCode: "UMFP0116-C",  description: "16mm pipe connectors (placeholder — confirm item code)" }' +
'};' +
'var GUIDE_CURVES = {' +
'    10: { itemCode: "GC10-C", description: "Guide curve for 10-12mm pipe" },' +
'    12: { itemCode: "GC10-C", description: "Guide curve for 10-12mm pipe" },' +
'    14: { itemCode: "GC14-C", description: "Guide curve for 14 and 17mm pipe" },' +
'    16: { itemCode: "GC14-C", description: "Guide curve for 14 and 17mm pipe" }' +
'};' +
'var MAX_PIPE_LENGTH = {' +
'    10: { newBuild: 50, renovation: 45 },' +
'    12: { newBuild: 80, renovation: 70 },' +
'    14: { newBuild: 110, renovation: 105 },' +
'    16: { newBuild: 110, renovation: 100 }' +
'};' +
'var DESIGN_RATE_PER_HOUR = 36;' +
'var DESIGN_BASE_HOURS = 2;' +
'var DELIVERY_PER_100M2 = 75;' +
'var floors = [];' +
'var floorCounters = { ground: 0, upper: 0, lowerground: 0, basement: 0 };' +
'var bomExpanded = false;' +
'var expandedSections = {};' +
'function generateId() {' +
'    return Math.random().toString(36).substring(2, 9);' +
'}' +
'function findFC(itemid) {' +
'    for (var j = 0; j < FLOOR_CONSTRUCTIONS.length; j++) {' +
'        if (FLOOR_CONSTRUCTIONS[j].itemid === itemid) return FLOOR_CONSTRUCTIONS[j];' +
'    }' +
'    return null;' +
'}' +
'function fcPipeSpacing(fc) {' +
'    return parseFloat(fc.pipeSpacing) || 150;' +
'}' +
'function fcPipeDiameter(fc) {' +
'    return parseInt(fc.pipeDiameter, 10) || 14;' +
'}' +
'function calculateManifoldPorts(areas, workType) {' +
'    var totalPorts = 0;' +
'    for (var i = 0; i < areas.length; i++) {' +
'        var area = areas[i];' +
'        var fc = findFC(area.floorConstruction);' +
'        if (fc && area.areaSqm > 0) {' +
'            var spacing = fcPipeSpacing(fc);' +
'            var diameter = fcPipeDiameter(fc);' +
'            var pipeLength = (area.areaSqm * 1000) / spacing;' +
'            var maxLengthMap = MAX_PIPE_LENGTH[diameter];' +
'            var maxLength = maxLengthMap ? maxLengthMap[workType === "New Build" ? "newBuild" : "renovation"] : 100;' +
'            totalPorts += Math.ceil(pipeLength / maxLength);' +
'        }' +
'    }' +
'    return totalPorts;' +
'}' +
'function generateFloorName(type) {' +
'    if (type === "ground") {' +
'        floorCounters.ground++;' +
'        return floorCounters.ground === 1 ? "Ground Floor" : "Ground Floor " + floorCounters.ground;' +
'    }' +
'    if (type === "upper") {' +
'        floorCounters.upper++;' +
'        return floorCounters.upper === 1 ? "Upper Floor" : "Upper Floor " + floorCounters.upper;' +
'    }' +
'    if (type === "lowerground") {' +
'        floorCounters.lowerground++;' +
'        return floorCounters.lowerground === 1 ? "Lower Ground Floor" : "Lower Ground Floor " + floorCounters.lowerground;' +
'    }' +
'    floorCounters.basement++;' +
'    return floorCounters.basement === 1 ? "Basement" : "Basement " + floorCounters.basement;' +
'}' +
'function defaultFCForFloorType(floorType) {' +
'    return floorType === "joisted" ? "ND(150)14" : "SC(150)14";' +
'}' +
'function applyFloorTypeToManifold(manifold, floorType) {' +
'    manifold.floorType = floorType;' +
'    for (var i = 0; i < manifold.areas.length; i++) {' +
'        if (!manifold.areas[i].floorTypeOverridden) {' +
'            manifold.areas[i].floorType = floorType;' +
'            manifold.areas[i].floorConstruction = defaultFCForFloorType(floorType);' +
'        }' +
'    }' +
'}' +
'function applyFloorTypeToFloor(floor, floorType) {' +
'    floor.floorType = floorType;' +
'    for (var i = 0; i < floor.manifolds.length; i++) {' +
'        if (!floor.manifolds[i].floorTypeOverridden) {' +
'            applyFloorTypeToManifold(floor.manifolds[i], floorType);' +
'        }' +
'    }' +
'}' +
'window.renderFloors = function() {' +
'    try {' +
'    var container = document.getElementById("floorsContainer");' +
'    var workType = document.getElementById("workType") ? document.getElementById("workType").value : "New Build";' +
'    var html = "";' +
'    for (var fIdx = 0; fIdx < floors.length; fIdx++) {' +
'        var floor = floors[fIdx];' +
'        html += "<div class=\\"floor-card\\">";' +
'        html += "<div class=\\"floor-header\\">";' +
'        html += "<div class=\\"floor-title\\" onclick=\\"window.toggleFloor(\'" + floor.id + "\')\\">";' +
'        html += "<span class=\\"chevron " + (floor.expanded ? "down" : "") + "\\">▶</span>";' +
'        html += "<span>" + floor.name + "</span>";' +
'        html += "</div>";' +
'        html += "<div class=\\"floor-controls\\">";' +
'        html += "<select onchange=\\"window.updateFloorType(\'" + floor.id + "\', this.value)\\">";' +
'        html += "<option value=\\"solid\\"" + (floor.floorType === "solid" ? " selected" : "") + ">Solid (concrete)</option>";' +
'        html += "<option value=\\"joisted\\"" + (floor.floorType === "joisted" ? " selected" : "") + ">Joisted (suspended timber)</option>";' +
'        html += "</select>";' +
'        if (floors.length > 1) {' +
'            html += "<button type=\\"button\\" class=\\"btn btn-danger\\" onclick=\\"event.stopPropagation(); window.removeFloor(\'" + floor.id + "\')\\">[X]</button>";' +
'        }' +
'        html += "</div></div>";' +
'        html += "<div class=\\"floor-content " + (floor.expanded ? "expanded" : "") + "\\">";' +
'        for (var mIdx = 0; mIdx < floor.manifolds.length; mIdx++) {' +
'            var manifold = floor.manifolds[mIdx];' +
'            var ports = calculateManifoldPorts(manifold.areas, workType);' +
'            var hasError = ports > 12;' +
'            html += "<div class=\\"manifold-card\\">";' +
'            html += "<div class=\\"manifold-header\\" onclick=\\"window.toggleManifold(\'" + floor.id + "\', \'" + manifold.id + "\')\\">";' +
'            html += "<div class=\\"manifold-title\\">";' +
'            html += "<span class=\\"chevron " + (manifold.expanded ? "down" : "") + "\\">▶</span>";' +
'            html += "<span>" + manifold.name + "</span>";' +
'            html += "</div>";' +
'            html += "<div class=\\"manifold-info\\">";' +
'            html += "<span class=\\"port-badge " + (hasError ? "error" : "") + "\\">" + ports + " Ports</span>";' +
'            html += "<select onclick=\\"event.stopPropagation();\\" onchange=\\"event.stopPropagation(); window.updateManifoldFloorType(\'" + floor.id + "\', \'" + manifold.id + "\', this.value)\\">";' +
'            html += "<option value=\\"solid\\"" + (manifold.floorType === "solid" ? " selected" : "") + ">Solid (concrete)</option>";' +
'            html += "<option value=\\"joisted\\"" + (manifold.floorType === "joisted" ? " selected" : "") + ">Joisted (suspended timber)</option>";' +
'            html += "</select>";' +
'            if (floor.manifolds.length > 1) {' +
'                html += "<button type=\\"button\\" class=\\"btn btn-danger\\" onclick=\\"event.stopPropagation(); window.removeManifold(\'" + floor.id + "\', \'" + manifold.id + "\')\\">[X]</button>";' +
'            }' +
'            html += "</div></div>";' +
'            html += "<div class=\\"manifold-content " + (manifold.expanded ? "expanded" : "") + "\\">";' +
'            if (hasError) {' +
'                html += "<div class=\\"error-message\\">Warning: More than 12 ports are being used on this manifold - please adjust</div>";' +
'            }' +
'            for (var aIdx = 0; aIdx < manifold.areas.length; aIdx++) {' +
'                var area = manifold.areas[aIdx];' +
'                html += "<div class=\\"area-row\\">";' +
'                html += "<div class=\\"area-header\\">";' +
'                html += "<span>Area " + (aIdx + 1) + (area.roomName ? " - " + area.roomName : "") + "</span>";' +
'                if (manifold.areas.length > 1) {' +
'                    html += "<button type=\\"button\\" class=\\"btn btn-danger\\" onclick=\\"window.removeArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\')\\">[X]</button>";' +
'                }' +
'                html += "</div>";' +
'                html += "<div class=\\"area-inputs\\">";' +
'                html += "<div class=\\"form-group\\">";' +
'                html += "<label>Room Name (optional)</label>";' +
'                html += "<input type=\\"text\\" value=\\"" + (area.roomName || "") + "\\" placeholder=\\"e.g. Kitchen\\" onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'roomName\', this.value); window.renderFloors();\\">";' +
'                html += "</div>";' +
'                html += "<div class=\\"form-group\\">";' +
'                html += "<label>Floor Type</label>";' +
'                html += "<select onchange=\\"window.updateAreaFloorType(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', this.value)\\">";' +
'                html += "<option value=\\"solid\\"" + (area.floorType === "solid" ? " selected" : "") + ">Solid (concrete)</option>";' +
'                html += "<option value=\\"joisted\\"" + (area.floorType === "joisted" ? " selected" : "") + ">Joisted (suspended timber)</option>";' +
'                html += "</select>";' +
'                html += "</div>";' +
'                html += "<div class=\\"form-group\\">";' +
'                html += "<label>Floor Construction</label>";' +
'                if (!floorConstructionsLoaded) {' +
'                    html += "<div class=\\"fc-spinner\\">Loading floor constructions\u2026</div>";' +
'                } else if (FLOOR_CONSTRUCTIONS.length === 0) {' +
'                    html += "<div class=\\"fc-error-inline\\">Floor construction data unavailable \u2014 please contact support</div>";' +
'                } else {' +
'                    html += "<select onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'floorConstruction\', this.value); window.renderFloors();\\">";' +
'                    for (var fcIdx = 0; fcIdx < FLOOR_CONSTRUCTIONS.length; fcIdx++) {' +
'                        var fc = FLOOR_CONSTRUCTIONS[fcIdx];' +
'                        html += "<option value=\\"" + fc.itemid + "\\"" + (area.floorConstruction === fc.itemid ? " selected" : "") + ">" + (fc.label || fc.itemid) + " (" + fc.itemid + ")</option>";' +
'                    }' +
'                    html += "</select>";' +
'                }' +
'                html += "</div>";' +
'                html += "<div class=\\"form-group\\">";' +
'                html += "<label>Area (m2)</label>";' +
'                html += "<input type=\\"number\\" value=\\"" + area.areaSqm + "\\" min=\\"0\\" onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'areaSqm\', parseFloat(this.value) || 0);\\">";' +
'                html += "</div>";' +
'                html += "<div class=\\"form-group\\">";' +
'                html += "<label>Thermostats</label>";' +
'                html += "<input type=\\"number\\" value=\\"" + area.thermostats + "\\" min=\\"0\\" onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'thermostats\', parseInt(this.value) || 0);\\">";' +
'                html += "<label class=\\"join-zone-label\\" style=\\"margin-top:6px;\\">" +' +
'                    "<input type=\\"checkbox\\"" + (area.joinZone ? " checked" : "") + " onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'joinZone\', this.checked);\\">" +' +
'                    " Join to adjacent zone (shared thermostat)</label>";' +
'                html += "</div>";' +
'                html += "</div></div>";' +
'            }' +
'            html += "<button type=\\"button\\" class=\\"btn btn-secondary\\" onclick=\\"window.addArea(\'" + floor.id + "\', \'" + manifold.id + "\')\\">[+] Add Area</button>";' +
'            html += "</div></div>";' +
'        }' +
'        html += "<button type=\\"button\\" class=\\"btn btn-secondary\\" onclick=\\"window.addManifold(\'" + floor.id + "\')\\">[+] Add Manifold</button>";' +
'        html += "</div></div>";' +
'    }' +
'    container.innerHTML = html;' +
'    } catch(renderErr) {' +
'        console.error("renderFloors error:", renderErr);' +
'    }' +
'};' +
'window.addFloor = function(type) {' +
'    var floorType = (type === "upper") ? "joisted" : "solid";' +
'    var newFloor = {' +
'        id: generateId(),' +
'        type: type,' +
'        name: generateFloorName(type),' +
'        floorType: floorType,' +
'        expanded: true,' +
'        manifolds: [{' +
'            id: generateId(),' +
'            name: "Manifold 1",' +
'            floorType: floorType,' +
'            expanded: true,' +
'            areas: [{ id: generateId(), roomName: "", floorConstruction: defaultFCForFloorType(floorType), floorType: floorType, areaSqm: 20, thermostats: 1, joinZone: false }]' +
'        }]' +
'    };' +
'    floors.push(newFloor);' +
'    window.renderFloors();' +
'};' +
'window.removeFloor = function(floorId) {' +
'    var newFloors = [];' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id !== floorId) newFloors.push(floors[i]);' +
'    }' +
'    floors = newFloors;' +
'    window.renderFloors();' +
'};' +
'window.toggleFloor = function(floorId) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) { floors[i].expanded = !floors[i].expanded; break; }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.updateFloorType = function(floorId, floorType) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            floors[i].floorTypeOverridden = true;' +
'            applyFloorTypeToFloor(floors[i], floorType);' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.updateManifoldFloorType = function(floorId, manifoldId, floorType) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            for (var j = 0; j < floors[i].manifolds.length; j++) {' +
'                if (floors[i].manifolds[j].id === manifoldId) {' +
'                    floors[i].manifolds[j].floorTypeOverridden = true;' +
'                    applyFloorTypeToManifold(floors[i].manifolds[j], floorType);' +
'                    break;' +
'                }' +
'            }' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.updateAreaFloorType = function(floorId, manifoldId, areaId, floorType) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            for (var j = 0; j < floors[i].manifolds.length; j++) {' +
'                if (floors[i].manifolds[j].id === manifoldId) {' +
'                    for (var k = 0; k < floors[i].manifolds[j].areas.length; k++) {' +
'                        if (floors[i].manifolds[j].areas[k].id === areaId) {' +
'                            floors[i].manifolds[j].areas[k].floorTypeOverridden = true;' +
'                            floors[i].manifolds[j].areas[k].floorType = floorType;' +
'                            floors[i].manifolds[j].areas[k].floorConstruction = defaultFCForFloorType(floorType);' +
'                            break;' +
'                        }' +
'                    }' +
'                    break;' +
'                }' +
'            }' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.addManifold = function(floorId) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            var mCount = floors[i].manifolds.length + 1;' +
'            floors[i].manifolds.push({' +
'                id: generateId(),' +
'                name: "Manifold " + mCount,' +
'                floorType: floors[i].floorType,' +
'                expanded: true,' +
'                areas: [{ id: generateId(), roomName: "", floorConstruction: defaultFCForFloorType(floors[i].floorType), floorType: floors[i].floorType, areaSqm: 20, thermostats: 1, joinZone: false }]' +
'            });' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.removeManifold = function(floorId, manifoldId) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId && floors[i].manifolds.length > 1) {' +
'            var newMans = [];' +
'            for (var j = 0; j < floors[i].manifolds.length; j++) {' +
'                if (floors[i].manifolds[j].id !== manifoldId) newMans.push(floors[i].manifolds[j]);' +
'            }' +
'            floors[i].manifolds = newMans;' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.toggleManifold = function(floorId, manifoldId) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            for (var j = 0; j < floors[i].manifolds.length; j++) {' +
'                if (floors[i].manifolds[j].id === manifoldId) {' +
'                    floors[i].manifolds[j].expanded = !floors[i].manifolds[j].expanded;' +
'                    break;' +
'                }' +
'            }' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.addArea = function(floorId, manifoldId) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            for (var j = 0; j < floors[i].manifolds.length; j++) {' +
'                if (floors[i].manifolds[j].id === manifoldId) {' +
'                    var ft = floors[i].manifolds[j].floorType;' +
'                    floors[i].manifolds[j].areas.push({ id: generateId(), roomName: "", floorConstruction: defaultFCForFloorType(ft), floorType: ft, areaSqm: 20, thermostats: 1, joinZone: false });' +
'                    break;' +
'                }' +
'            }' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.removeArea = function(floorId, manifoldId, areaId) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            for (var j = 0; j < floors[i].manifolds.length; j++) {' +
'                if (floors[i].manifolds[j].id === manifoldId && floors[i].manifolds[j].areas.length > 1) {' +
'                    var newAreas = [];' +
'                    for (var k = 0; k < floors[i].manifolds[j].areas.length; k++) {' +
'                        if (floors[i].manifolds[j].areas[k].id !== areaId) newAreas.push(floors[i].manifolds[j].areas[k]);' +
'                    }' +
'                    floors[i].manifolds[j].areas = newAreas;' +
'                    break;' +
'                }' +
'            }' +
'            break;' +
'        }' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.updateArea = function(floorId, manifoldId, areaId, field, value) {' +
'    for (var i = 0; i < floors.length; i++) {' +
'        if (floors[i].id === floorId) {' +
'            for (var j = 0; j < floors[i].manifolds.length; j++) {' +
'                if (floors[i].manifolds[j].id === manifoldId) {' +
'                    for (var k = 0; k < floors[i].manifolds[j].areas.length; k++) {' +
'                        if (floors[i].manifolds[j].areas[k].id === areaId) {' +
'                            floors[i].manifolds[j].areas[k][field] = value;' +
'                            break;' +
'                        }' +
'                    }' +
'                    break;' +
'                }' +
'            }' +
'            break;' +
'        }' +
'    }' +
'};' +
'function formatCurrency(value) {' +
'    return "\\u00A3" + value.toFixed(2);' +
'}' +
'window.toggleBom = function() {' +
'    bomExpanded = !bomExpanded;' +
'    var content = document.getElementById("bomContent");' +
'    var chevron = document.getElementById("bomChevron");' +
'    if (bomExpanded) {' +
'        content.classList.add("expanded");' +
'        chevron.classList.add("down");' +
'    } else {' +
'        content.classList.remove("expanded");' +
'        chevron.classList.remove("down");' +
'    }' +
'};' +
'window.toggleBomSection = function(section) {' +
'    expandedSections[section] = !expandedSections[section];' +
'    var content = document.getElementById("bomSection_" + section.replace(/ /g, "_"));' +
'    var chevron = document.getElementById("bomSectionChevron_" + section.replace(/ /g, "_"));' +
'    if (expandedSections[section]) {' +
'        content.classList.add("expanded");' +
'        chevron.classList.add("down");' +
'    } else {' +
'        content.classList.remove("expanded");' +
'        chevron.classList.remove("down");' +
'    }' +
'};' +
'window.copyQuoteDescription = function() {' +
'    var text = window.quoteDescriptionText || "";' +
'    navigator.clipboard.writeText(text).then(function() {' +
'        var btn = document.getElementById("copyBtn");' +
'        btn.textContent = "Copied!";' +
'        btn.classList.add("copied");' +
'        setTimeout(function() {' +
'            btn.textContent = "Copy to Clipboard";' +
'            btn.classList.remove("copied");' +
'        }, 2000);' +
'    });' +
'};' +
'window.fetchPrices = function(itemCodes, priceLevelId, callback) {' +
'    var url = RESTLET_BASE_URL + "&action=getItemPrices"' +
'        + "&itemids=" + encodeURIComponent(itemCodes.join(","))' +
'        + "&pricelevelid=" + encodeURIComponent(priceLevelId);' +
'    fetch(url, {' +
'        method: "GET",' +
'        headers: { "Content-Type": "application/json" }' +
'    })' +
'    .then(function(r) { return r.json(); })' +
'    .then(function(data) {' +
'        if (data && data.success) {' +
'            callback(null, data.data);' +
'        } else {' +
'            callback(new Error("getItemPrices failed"), null);' +
'        }' +
'    })' +
'    .catch(function(err) { callback(err, null); });' +
'};' +
'window.calculateQuote = function() {' +
'    var heatSource = document.getElementById("heatSource").value;' +
'    var workType = document.getElementById("workType").value;' +
'    var thermostatType = document.getElementById("thermostatType") ? document.getElementById("thermostatType").value : "Dial";' +
'    var priceLevelId = document.getElementById("priceLevel").value;' +
'    var errors = [];' +
'    var totalArea = 0;' +
'    var totalThermostats = 0;' +
'    var totalPorts = 0;' +
'    var floorConstructionTotals = {};' +
'    var pipeDiameterTotals = {};' +
'    var totalManifolds = 0;' +
'    for (var fIdx = 0; fIdx < floors.length; fIdx++) {' +
'        var floorObj = floors[fIdx];' +
'        for (var mIdx = 0; mIdx < floorObj.manifolds.length; mIdx++) {' +
'            var manifold = floorObj.manifolds[mIdx];' +
'            totalManifolds++;' +
'            var ports = calculateManifoldPorts(manifold.areas, workType);' +
'            if (ports > 12) {' +
'                errors.push(manifold.name + " (" + floorObj.name + ") has more than 12 ports (" + ports + "). Please adjust.");' +
'            }' +
'            totalPorts += ports;' +
'            for (var aIdx = 0; aIdx < manifold.areas.length; aIdx++) {' +
'                var area = manifold.areas[aIdx];' +
'                totalArea += area.areaSqm;' +
'                /* joinZone areas share a thermostat — do not add to thermostat count */' +
'                if (!area.joinZone) {' +
'                    totalThermostats += area.thermostats;' +
'                }' +
'                var fc = findFC(area.floorConstruction);' +
'                if (fc) {' +
'                    var fcKey = fc.itemid;' +
'                    if (!floorConstructionTotals[fcKey]) {' +
'                        floorConstructionTotals[fcKey] = { area: 0, fc: fc };' +
'                    }' +
'                    floorConstructionTotals[fcKey].area += area.areaSqm;' +
'                    var spacing = fcPipeSpacing(fc);' +
'                    var diameter = fcPipeDiameter(fc);' +
'                    if (!pipeDiameterTotals[diameter]) {' +
'                        pipeDiameterTotals[diameter] = { length: 0, ports: 0 };' +
'                    }' +
'                    var pipeLength = (area.areaSqm * 1000) / spacing;' +
'                    pipeDiameterTotals[diameter].length += pipeLength;' +
'                    var maxLengthMap = MAX_PIPE_LENGTH[diameter];' +
'                    var maxLength = maxLengthMap ? maxLengthMap[workType === "New Build" ? "newBuild" : "renovation"] : 100;' +
'                    pipeDiameterTotals[diameter].ports += Math.ceil(pipeLength / maxLength);' +
'                }' +
'            }' +
'        }' +
'    }' +
'    var pumpList = heatSource === "Heat Pump" ? HEAT_PUMP_PUMPS : BOILER_PUMPS;' +
'    var areaKey = workType === "New Build" ? "newBuildArea" : "renovationArea";' +
'    var selectedPump = pumpList[pumpList.length - 1];' +
'    for (var pIdx = 0; pIdx < pumpList.length; pIdx++) {' +
'        if (totalArea <= pumpList[pIdx][areaKey]) {' +
'            selectedPump = pumpList[pIdx];' +
'            break;' +
'        }' +
'    }' +
'    var selectedManifoldData = [];' +
'    for (var fIdx2 = 0; fIdx2 < floors.length; fIdx2++) {' +
'        for (var mIdx2 = 0; mIdx2 < floors[fIdx2].manifolds.length; mIdx2++) {' +
'            var manifold2 = floors[fIdx2].manifolds[mIdx2];' +
'            var ports2 = Math.min(12, calculateManifoldPorts(manifold2.areas, workType));' +
'            var manifoldData = MANIFOLDS[MANIFOLDS.length - 1];' +
'            for (var manIdx = 0; manIdx < MANIFOLDS.length; manIdx++) {' +
'                if (MANIFOLDS[manIdx].ports >= ports2) {' +
'                    manifoldData = MANIFOLDS[manIdx];' +
'                    break;' +
'                }' +
'            }' +
'            selectedManifoldData.push(manifoldData);' +
'        }' +
'    }' +
'    var selectedThermostat = THERMOSTATS[thermostatType] || THERMOSTATS["Dial"];' +
'    var selectedWiringCentre = WIRING_CENTRES[thermostatType] || WIRING_CENTRES["Dial"];' +
'    /* Wiring centre quantity = max(ceil(thermostats/8), number of manifolds) */' +
'    var wiringCentres = Math.max(Math.ceil(totalThermostats / 8), totalManifolds);' +
'    var junctionBoxes = (heatSource !== "Heat Pump" && totalPorts > 0) ? Math.ceil(totalPorts / 12) : 0;' +
'    var selectedPipeCoils = {};' +
'    for (var diam in pipeDiameterTotals) {' +
'        if (pipeDiameterTotals.hasOwnProperty(diam)) {' +
'            var d = parseInt(diam);' +
'            var coils = PIPE_COILS[d].coils;' +
'            selectedPipeCoils[d] = coils[coils.length - 1];' +
'        }' +
'    }' +
'    var itemCodesObj = {};' +
'    itemCodesObj[selectedPump.itemCode] = true;' +
'    for (var smi = 0; smi < selectedManifoldData.length; smi++) { itemCodesObj[selectedManifoldData[smi].itemCode] = true; }' +
'    itemCodesObj[MANIFOLD_CONNECTION.itemCode] = true;' +
'    if (totalThermostats > 0) { itemCodesObj[selectedThermostat.itemCode] = true; }' +
'    if (wiringCentres > 0) { itemCodesObj[selectedWiringCentre.itemCode] = true; }' +
'    if (totalPorts > 0) {' +
'        itemCodesObj[ACTUATOR.itemCode] = true;' +
'        if (heatSource !== "Heat Pump" && junctionBoxes > 0) { itemCodesObj[JUNCTION_BOX.itemCode] = true; }' +
'    }' +
'    for (var diam2 in pipeDiameterTotals) {' +
'        if (pipeDiameterTotals.hasOwnProperty(diam2)) {' +
'            var d2 = parseInt(diam2);' +
'            itemCodesObj[selectedPipeCoils[d2].itemCode] = true;' +
'            itemCodesObj[PIPE_CONNECTORS[d2].itemCode] = true;' +
'            itemCodesObj[GUIDE_CURVES[d2].itemCode] = true;' +
'        }' +
'    }' +
'    for (var fcKey2 in floorConstructionTotals) {' +
'        if (floorConstructionTotals.hasOwnProperty(fcKey2)) { itemCodesObj[fcKey2] = true; }' +
'    }' +
'    var itemCodes = Object.keys(itemCodesObj);' +
'    window.fetchPrices(itemCodes, priceLevelId, function(err, prices) {' +
'        if (err || !prices) {' +
'            console.error("fetchPrices error:", err);' +
'            prices = {};' +
'        }' +
'        function getPrice(itemCode) {' +
'            var p = prices[itemCode];' +
'            if (p && !p.notFound) { return p.price || 0; }' +
'            console.warn("Price not found for: " + itemCode);' +
'            return 0;' +
'        }' +
'        var lineItems = [];' +
'        var pumpPrice = getPrice(selectedPump.itemCode);' +
'        lineItems.push({ section: "Pump", description: selectedPump.description + " (" + selectedPump.itemCode + ")", quantity: 1, price: pumpPrice, totalPrice: pumpPrice });' +
'        for (var mi = 0; mi < selectedManifoldData.length; mi++) {' +
'            var md = selectedManifoldData[mi];' +
'            var mdPrice = getPrice(md.itemCode);' +
'            lineItems.push({ section: "Manifold", description: md.description + " (" + md.itemCode + ")", quantity: 1, price: mdPrice, totalPrice: mdPrice });' +
'        }' +
'        var mcPrice = getPrice(MANIFOLD_CONNECTION.itemCode);' +
'        lineItems.push({ section: "Manifold", description: MANIFOLD_CONNECTION.description + " (" + MANIFOLD_CONNECTION.itemCode + ")", quantity: totalManifolds, price: mcPrice, totalPrice: mcPrice * totalManifolds });' +
'        if (totalThermostats > 0) {' +
'            var thPrice = getPrice(selectedThermostat.itemCode);' +
'            lineItems.push({ section: "Controls", description: selectedThermostat.description + " (" + selectedThermostat.itemCode + ")", quantity: totalThermostats, price: thPrice, totalPrice: thPrice * totalThermostats });' +
'        }' +
'        if (wiringCentres > 0) {' +
'            var wcPrice = getPrice(selectedWiringCentre.itemCode);' +
'            lineItems.push({ section: "Controls", description: selectedWiringCentre.description + " (" + selectedWiringCentre.itemCode + ")", quantity: wiringCentres, price: wcPrice, totalPrice: wcPrice * wiringCentres });' +
'        }' +
'        if (totalPorts > 0) {' +
'            var actPrice = getPrice(ACTUATOR.itemCode);' +
'            lineItems.push({ section: "Controls", description: ACTUATOR.description + " (" + ACTUATOR.itemCode + ")", quantity: totalPorts, price: actPrice, totalPrice: actPrice * totalPorts });' +
'            if (heatSource !== "Heat Pump" && junctionBoxes > 0) {' +
'                var jbPrice = getPrice(JUNCTION_BOX.itemCode);' +
'                lineItems.push({ section: "Controls", description: JUNCTION_BOX.description + " (" + JUNCTION_BOX.itemCode + ")", quantity: junctionBoxes, price: jbPrice, totalPrice: jbPrice * junctionBoxes });' +
'            }' +
'        }' +
'        for (var diam3 in pipeDiameterTotals) {' +
'            if (pipeDiameterTotals.hasOwnProperty(diam3)) {' +
'                var diamData = pipeDiameterTotals[diam3];' +
'                var d3 = parseInt(diam3);' +
'                var coil = selectedPipeCoils[d3];' +
'                var numCoils = Math.ceil(diamData.length / coil.length);' +
'                if (numCoils > 0) {' +
'                    var coilPrice = getPrice(coil.itemCode);' +
'                    lineItems.push({ section: "Pipe", description: coil.description + " (" + coil.itemCode + ")", quantity: numCoils, price: coilPrice, totalPrice: coilPrice * numCoils });' +
'                }' +
'                var connectors = diamData.ports * 2;' +
'                var connector = PIPE_CONNECTORS[d3];' +
'                var connPrice = getPrice(connector.itemCode);' +
'                lineItems.push({ section: "Pipe", description: connector.description + " (" + connector.itemCode + ")", quantity: connectors, price: connPrice, totalPrice: connPrice * connectors });' +
'                var guideCurve = GUIDE_CURVES[d3];' +
'                var gcPrice = getPrice(guideCurve.itemCode);' +
'                lineItems.push({ section: "Pipe", description: guideCurve.description + " (" + guideCurve.itemCode + ")", quantity: diamData.ports, price: gcPrice, totalPrice: gcPrice * diamData.ports });' +
'            }' +
'        }' +
'        for (var fcN in floorConstructionTotals) {' +
'            if (floorConstructionTotals.hasOwnProperty(fcN)) {' +
'                var fcDat = floorConstructionTotals[fcN];' +
'                var fcLabel = (fcDat.fc.label || fcDat.fc.itemid) + " (" + fcDat.fc.itemid + ") - " + fcDat.area.toFixed(1) + " m2";' +
'                var fcPrice = getPrice(fcN);' +
'                lineItems.push({ section: "Floor Construction", description: fcLabel, quantity: Math.ceil(fcDat.area), price: fcPrice, totalPrice: fcPrice * Math.ceil(fcDat.area) });' +
'            }' +
'        }' +
'        /* Design line — included in project scope, price 0 */' +
'        lineItems.push({ section: "Design and Delivery", description: "UFH Design", quantity: 1, price: 0, totalPrice: 0 });' +
'        var pallets = Math.max(2, Math.ceil(totalArea / 100) + 1);' +
'        var deliveryCost = pallets * DELIVERY_PER_100M2;' +
'        /* Delivery price = cost × 1.15 */' +
'        var deliveryPrice = deliveryCost * 1.15;' +
'        lineItems.push({ section: "Design and Delivery", description: "Delivery charge (" + pallets + " pallets)", quantity: 1, price: deliveryPrice, totalPrice: deliveryPrice });' +
'        var totalPrice = 0;' +
'        for (var liIdx = 0; liIdx < lineItems.length; liIdx++) { totalPrice += lineItems[liIdx].totalPrice; }' +
'        renderResults(lineItems, errors, totalPrice);' +
'    });' +
'};' +
'function renderResults(lineItems, errors, totalPrice) {' +
'    var resultsSection = document.getElementById("resultsSection");' +
'    var errorsContainer = document.getElementById("errorsContainer");' +
'    var summaryContainer = document.getElementById("summaryContainer");' +
'    var quoteDescriptionContainer = document.getElementById("quoteDescriptionContainer");' +
'    var bomContainer = document.getElementById("bomContainer");' +
'    bomExpanded = false;' +
'    expandedSections = {};' +
'    if (errors.length > 0) {' +
'        var errHtml = "";' +
'        for (var eIdx = 0; eIdx < errors.length; eIdx++) {' +
'            errHtml += "<div class=\\"error-message\\">Warning: " + errors[eIdx] + "</div>";' +
'        }' +
'        errorsContainer.innerHTML = errHtml;' +
'    } else {' +
'        errorsContainer.innerHTML = "";' +
'    }' +
'    var summaryHtml = "<div class=\\"summary-grid\\">";' +
'    summaryHtml += "<div class=\\"summary-box highlight\\"><p class=\\"label\\">Total Price</p><p class=\\"value\\">" + formatCurrency(totalPrice) + "</p></div>";' +
'    summaryHtml += "</div>";' +
'    summaryContainer.innerHTML = summaryHtml;' +
'    var descLines = [];' +
'    descLines.push("Nu-Heat Underfloor Heating Quote");' +
'    descLines.push("================================");' +
'    descLines.push("");' +
'    var totalManifoldsForDesc = 0;' +
'    for (var f = 0; f < floors.length; f++) { totalManifoldsForDesc += floors[f].manifolds.length; }' +
'    for (var fdIdx = 0; fdIdx < floors.length; fdIdx++) {' +
'        var floorD = floors[fdIdx];' +
'        if (floors.length > 1) { descLines.push(floorD.name + ":"); }' +
'        for (var mdIdx = 0; mdIdx < floorD.manifolds.length; mdIdx++) {' +
'            var manifoldD = floorD.manifolds[mdIdx];' +
'            if (totalManifoldsForDesc > 1) { descLines.push("  " + manifoldD.name + ":"); }' +
'            for (var adIdx = 0; adIdx < manifoldD.areas.length; adIdx++) {' +
'                var areaD = manifoldD.areas[adIdx];' +
'                var roomLabelD = areaD.roomName ? areaD.roomName + " - " : "";' +
'                descLines.push("\\u2022 " + roomLabelD + areaD.floorConstruction + ", " + areaD.areaSqm + "m\\u00B2");' +
'            }' +
'        }' +
'        if (floors.length > 1 && fdIdx < floors.length - 1) { descLines.push(""); }' +
'    }' +
'    descLines.push("");' +
'    descLines.push("--------------------------------");' +
'    descLines.push("Estimated Price: " + formatCurrency(totalPrice));' +
'    descLines.push("--------------------------------");' +
'    descLines.push("");' +
'    descLines.push("This quote includes all materials, design, and delivery.");' +
'    descLines.push("Final price subject to full survey and specification.");' +
'    window.quoteDescriptionText = descLines.join("\\n");' +
'    var descHtml = "<div class=\\"quote-description-box\\">";' +
'    descHtml += "<div class=\\"quote-description-header\\">";' +
'    descHtml += "<h4>Quick Quote Description</h4>";' +
'    descHtml += "<button type=\\"button\\" id=\\"copyBtn\\" class=\\"btn btn-copy\\" onclick=\\"window.copyQuoteDescription()\\">Copy to Clipboard</button>";' +
'    descHtml += "</div>";' +
'    descHtml += "<div class=\\"quote-description-content\\">";' +
'    descHtml += "<div class=\\"title\\">Nu-Heat Underfloor Heating Quote</div>";' +
'    for (var fdIdx2 = 0; fdIdx2 < floors.length; fdIdx2++) {' +
'        var floorH = floors[fdIdx2];' +
'        if (floors.length > 1) {' +
'            descHtml += "<div style=\\"font-weight:600;color:#374151;\\">" + floorH.name + "</div>";' +
'        }' +
'        for (var mdIdx2 = 0; mdIdx2 < floorH.manifolds.length; mdIdx2++) {' +
'            var manifoldH = floorH.manifolds[mdIdx2];' +
'            if (totalManifoldsForDesc > 1) {' +
'                descHtml += "<div style=\\"font-weight:500;color:#4b5563;margin-left:8px;\\">" + manifoldH.name + ":</div>";' +
'            }' +
'            for (var adIdx2 = 0; adIdx2 < manifoldH.areas.length; adIdx2++) {' +
'                var area2 = manifoldH.areas[adIdx2];' +
'                var roomLabel2 = area2.roomName ? area2.roomName + " - " : "";' +
'                descHtml += "<div style=\\"margin-left:16px;\\">\\u2022 " + roomLabel2 + area2.floorConstruction + ", " + area2.areaSqm + "m\\u00B2</div>";' +
'            }' +
'        }' +
'    }' +
'    descHtml += "<div class=\\"price-line\\">Estimated Price: " + formatCurrency(totalPrice) + "</div>";' +
'    descHtml += "<div class=\\"disclaimer\\">This is a quick estimate. For a detailed quote, please provide us with a set of floor plans.</div>";' +
'    descHtml += "</div></div>";' +
'    quoteDescriptionContainer.innerHTML = descHtml;' +
'    var sections = ["Pump", "Manifold", "Controls", "Pipe", "Floor Construction", "Design and Delivery"];' +
'    var bomHtml = "<div class=\\"bom-collapsible\\">";' +
'    bomHtml += "<div class=\\"bom-header\\" onclick=\\"window.toggleBom()\\">";' +
'    bomHtml += "<h3>Bill of Materials</h3>";' +
'    bomHtml += "<div><span class=\\"item-count\\">" + lineItems.length + " items</span><span id=\\"bomChevron\\" class=\\"chevron\\">▶</span></div>";' +
'    bomHtml += "</div>";' +
'    bomHtml += "<div id=\\"bomContent\\" class=\\"bom-content\\">";' +
'    for (var sIdx = 0; sIdx < sections.length; sIdx++) {' +
'        var section = sections[sIdx];' +
'        var sectionId = section.replace(/ /g, "_");' +
'        var items = [];' +
'        for (var liIdx2 = 0; liIdx2 < lineItems.length; liIdx2++) {' +
'            if (lineItems[liIdx2].section === section) {' +
'                items.push(lineItems[liIdx2]);' +
'            }' +
'        }' +
'        if (items.length > 0) {' +
'            bomHtml += "<div class=\\"bom-section\\">";' +
'            bomHtml += "<div class=\\"bom-section-header\\" onclick=\\"window.toggleBomSection(\'" + section + "\')\\"><span><span id=\\"bomSectionChevron_" + sectionId + "\\" class=\\"chevron\\">▶</span> " + section + "</span><span>" + items.length + " items</span></div>";' +
'            bomHtml += "<div id=\\"bomSection_" + sectionId + "\\" class=\\"bom-section-content\\">";' +
'            bomHtml += "<table class=\\"results-table\\"><thead><tr><th>Description</th><th style=\\"text-align:center\\">Qty</th><th style=\\"text-align:right\\">Unit Price</th><th style=\\"text-align:right\\">Total</th></tr></thead><tbody>";' +
'            for (var iIdx = 0; iIdx < items.length; iIdx++) {' +
'                var item = items[iIdx];' +
'                bomHtml += "<tr><td>" + item.description + "</td><td style=\\"text-align:center\\">" + item.quantity + "</td><td style=\\"text-align:right\\">" + formatCurrency(item.price) + "</td><td style=\\"text-align:right\\">" + formatCurrency(item.totalPrice) + "</td></tr>";' +
'            }' +
'            bomHtml += "</tbody></table></div></div>";' +
'        }' +
'    }' +
'    bomHtml += "</div></div>";' +
'    bomContainer.innerHTML = bomHtml;' +
'    resultsSection.classList.remove("hidden");' +
'    resultsSection.scrollIntoView({ behavior: "smooth" });' +
'};' +
'/* Fetch floor constructions from the RESTlet on page load. */' +
'/* Renders manifolds once loaded; shows spinner in FC dropdowns while loading. */' +
'(function fetchFloorConstructions() {' +
'    fetch(RESTLET_BASE_URL + "&action=getFloorConstructions", {' +
'        method: "GET",' +
'        headers: { "Content-Type": "application/json" }' +
'    })' +
'    .then(function(response) {' +
'        if (!response.ok) throw new Error("HTTP " + response.status);' +
'        return response.json();' +
'    })' +
'    .then(function(data) {' +
'        if (Array.isArray(data)) {' +
'            FLOOR_CONSTRUCTIONS = data;' +
'        } else if (data && data.success && Array.isArray(data.data)) {' +
'            FLOOR_CONSTRUCTIONS = data.data;' +
'        } else {' +
'            console.warn("getFloorConstructions: unexpected response", data);' +
'            FLOOR_CONSTRUCTIONS = [];' +
'        }' +
'        floorConstructionsLoaded = true;' +
'        window.renderFloors();' +
'    })' +
'    .catch(function(err) {' +
'        console.error("Failed to load floor constructions:", err);' +
'        FLOOR_CONSTRUCTIONS = [];' +
'        floorConstructionsLoaded = true;' +
'        /* allow render with empty list + error message */' +
'        window.renderFloors();' +
'    });' +
'})();' +
'(function() {' +
'    /* Initialise with one ground floor, one manifold, one area */' +
'    var initFloor = {' +
'        id: generateId(),' +
'        type: "ground",' +
'        name: generateFloorName("ground"),' +
'        floorType: "solid",' +
'        expanded: true,' +
'        manifolds: [{' +
'            id: generateId(),' +
'            name: "Manifold 1",' +
'            floorType: "solid",' +
'            expanded: true,' +
'            areas: [{ id: generateId(), roomName: "", floorConstruction: defaultFCForFloorType("solid"), floorType: "solid", areaSqm: 20, thermostats: 1, joinZone: false }]' +
'        }]' +
'    };' +
'    floors.push(initFloor);' +
'})();' +
'</script>' +
'</body>' +
'</html>';
    }

    return {
        onRequest: onRequest
    };
});
