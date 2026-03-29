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

define(['N/ui/serverWidget'], function(serverWidget) {

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

            htmlField.defaultValue = getQuoteToolHTML();
            context.response.writePage(form);
        }
    }

    function getQuoteToolHTML() {
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
'                <label>Build Type</label>' +
'                <select id="buildType">' +
'                    <option value="New Build">New Build</option>' +
'                    <option value="Renovation">Renovation</option>' +
'                </select>' +
'            </div>' +
'            <div class="form-group">' +
'                <label>Target Margin (%)</label>' +
'                <input type="number" id="targetMargin" value="55" min="0" max="100">' +
'            </div>' +
'        </div>' +
'    </div>' +
'    <div class="card">' +
'        <div class="card-title">Manifolds and Areas</div>' +
'        <div id="manifoldsContainer"></div>' +
'        <button type="button" class="btn btn-secondary" onclick="window.addManifold()">' +
'            + Add Manifold' +
'        </button>' +
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
'var FLOOR_CONSTRUCTIONS = [' +
'    { name: "Screed (Cliptrack)", itemCode: "SC(200)14", pipeDiameter: 14, tubeSpacing: 200, palletsPerM2: 0.002, cost: 1.28, price: 3.48 },' +
'    { name: "Screed (Staple)", itemCode: "SSE(200)14", pipeDiameter: 14, tubeSpacing: 200, palletsPerM2: 0.004, cost: 0.56, price: 2.79 },' +
'    { name: "LoPro", itemCode: "LP(150)10", pipeDiameter: 10, tubeSpacing: 150, palletsPerM2: 0.02, cost: 17.64, price: 51.15 },' +
'    { name: "LoPro Max", itemCode: "LPM(150)10", pipeDiameter: 10, tubeSpacing: 150, palletsPerM2: 0.041, cost: 23.86, price: 59.24 },' +
'    { name: "Nu-Deck", itemCode: "ND(150)14", pipeDiameter: 14, tubeSpacing: 150, palletsPerM2: 0.04, cost: 29.0, price: 77.4 },' +
'    { name: "Torfloor 2 Plus", itemCode: "TF2+(150)12", pipeDiameter: 12, tubeSpacing: 150, palletsPerM2: 0.04, cost: 42.24, price: 126.05 },' +
'    { name: "Floating (DPL)", itemCode: "DPL(175)14", pipeDiameter: 14, tubeSpacing: 133, palletsPerM2: 0.0173, cost: 10.78, price: 29.18 },' +
'    { name: "Joisted (ClippaPlate)", itemCode: "TPBA(400)14", pipeDiameter: 14, tubeSpacing: 200, palletsPerM2: 0.0011, cost: 7.2, price: 11.4 },' +
'    { name: "Lowboard", itemCode: "LB2+(150)12", pipeDiameter: 12, tubeSpacing: 150, palletsPerM2: 0.02, cost: 35.13, price: 104.54 }' +
'];' +
'var BOILER_PUMPS = [' +
'    { itemCode: "PM1W/2-A", description: "Manifold-mounted pump module for underfloor heating temperature control.", cost: 132.57, price: 460.26, newBuildArea: 215, renovationArea: 125 },' +
'    { itemCode: "PM2W/3-A", description: "Pump and temperature control module with Wilo variable speed pump and ESBE mixing valve (remote mount)", cost: 248.28, price: 644.83, newBuildArea: 380, renovationArea: 225 },' +
'    { itemCode: "PM3W/3-A", description: "Pump and temperature control module with Wilo high efficiency pump and ESBE electronically controlled mixing valve", cost: 261.91, price: 1261.45, newBuildArea: 600, renovationArea: 350 },' +
'    { itemCode: "PM4W/2-A", description: "Pump and temperature control module with Wilo High Flow pump and ESBE electronic mixing valve", cost: 459.29, price: 1445.33, newBuildArea: 1050, renovationArea: 615 },' +
'    { itemCode: "PM5W/1-A", description: "Wilo Para HF25/10 pump and 1.5in ESBE electronically controlled mixing valve", cost: 406.81, price: 1680.39, newBuildArea: 1500, renovationArea: 905 }' +
'];' +
'var HEAT_PUMP_PUMPS = [' +
'    { itemCode: "W2560SC7-A", description: "Wilo Para SC7 pump (EuP compliant) with valves", cost: 67.01, price: 219.61, newBuildArea: 415, renovationArea: 240 },' +
'    { itemCode: "W2570HF-A", description: "Wilo 2570 HF pump with pump unions", cost: 220.87, price: 923.46, newBuildArea: 700, renovationArea: 410 },' +
'    { itemCode: "W2575SC8-A", description: "Wilo Para RS25/7.5SC8 pump (EuP compliant) with pump valves", cost: 80.64, price: 281.33, newBuildArea: 1250, renovationArea: 730 },' +
'    { itemCode: "W25100HF-A", description: "Wilo 2510 HF pump with fittings", cost: 140.83, price: 934.74, newBuildArea: 1750, renovationArea: 1000 }' +
'];' +
'var MANIFOLDS = [' +
'    { ports: 1, itemCode: "OMS01-C", description: "1-Port Optiflo control manifolds, stainless steel", cost: 40.11, price: 146.73 },' +
'    { ports: 2, itemCode: "OMS02-C", description: "2-Port Optiflo control manifolds, stainless steel", cost: 46.74, price: 203.41 },' +
'    { ports: 3, itemCode: "OMS03-C", description: "3-Port Optiflo control manifolds, stainless steel", cost: 55.95, price: 244.8 },' +
'    { ports: 4, itemCode: "OMS04-C", description: "4-Port Optiflo control manifolds, stainless steel", cost: 65.17, price: 286.19 },' +
'    { ports: 5, itemCode: "OMS05-C", description: "5-Port Optiflo control manifolds, stainless steel", cost: 74.37, price: 327.59 },' +
'    { ports: 6, itemCode: "OMS06-C", description: "6-Port Optiflo control manifolds, stainless steel", cost: 83.65, price: 368.99 },' +
'    { ports: 7, itemCode: "OMS07-C", description: "7-Port Optiflo control manifolds, stainless steel", cost: 92.86, price: 410.37 },' +
'    { ports: 8, itemCode: "OMS08-C", description: "8-Port Optiflo control manifolds, stainless steel", cost: 102.08, price: 451.79 },' +
'    { ports: 9, itemCode: "OMS09-C", description: "9-Port Optiflo control manifolds, stainless steel", cost: 111.3, price: 493.16 },' +
'    { ports: 10, itemCode: "OMS10-C", description: "10-Port Optiflo control manifolds, stainless steel", cost: 120.75, price: 534.58 },' +
'    { ports: 11, itemCode: "OMS11-C", description: "11-Port Optiflo control manifolds, stainless steel", cost: 129.96, price: 575.98 },' +
'    { ports: 12, itemCode: "OMS12-C", description: "12-Port Optiflo control manifolds, stainless steel", cost: 139.18, price: 617.37 }' +
'];' +
'var MANIFOLD_CONNECTION = { itemCode: "MCP-A", description: "Isolator pack for Optiflo manifolds", cost: 17.46, price: 55.5 };' +
'var THERMOSTAT = { itemCode: "neoStatWv2-C", description: "White neoStat V2 thermostat, Mains Voltage (240V) wired connection", cost: 36.28, price: 126.37 };' +
'var WIRING_CENTRE = { itemCode: "UH8-C", description: "UH8, 8 zone 230V Wiring Centre", cost: 34.16, price: 165.84 };' +
'var ACTUATOR = { itemCode: "OMDA-C", description: "Zone valve actuator", cost: 6.29, price: 36.97 };' +
'var JUNCTION_BOX = { itemCode: "JB12-C", description: "Danfoss connection block", cost: 3.59, price: 12.12 };' +
'var PIPE_COILS = {' +
'    10: { coils: [' +
'        { length: 30, itemCode: "TPER10/30-C", description: "10mm x 30m Fastflo pipe", cost: 10.5, price: 46.61 },' +
'        { length: 35, itemCode: "TPER10/35-C", description: "10mm x 35m Fastflo pipe", cost: 11.52, price: 56.43 },' +
'        { length: 40, itemCode: "TPER10/40-C", description: "10mm x 40m Fastflo pipe", cost: 10.67, price: 64.46 },' +
'        { length: 45, itemCode: "TPER10/45-C", description: "10mm x 45m Fastflo pipe", cost: 12.0, price: 72.52 },' +
'        { length: 50, itemCode: "TPER10/50-C", description: "10mm x 50m Fastflo pipe", cost: 9.36, price: 80.57 },' +
'        { length: 55, itemCode: "TPER10/55-C", description: "10mm x 55m Fastflo pipe", cost: 10.3, price: 88.65 },' +
'        { length: 60, itemCode: "TPER10/60-C", description: "10mm x 60m Fastflo pipe", cost: 11.23, price: 96.67 }' +
'    ] },' +
'    12: { coils: [' +
'        { length: 40, itemCode: "UP120140-A", description: "12mm OMNIFLO pipe (40m)", cost: 5.73, price: 30.87 },' +
'        { length: 60, itemCode: "UP120160-A", description: "12mm OMNIFLO pipe (60m)", cost: 8.59, price: 44.1 },' +
'        { length: 80, itemCode: "UP120180-A", description: "12mm OMNIFLO pipe (80m)", cost: 11.46, price: 58.43 }' +
'    ] },' +
'    14: { coils: [' +
'        { length: 40, itemCode: "WPER14/40-C", description: "14mm x 40m Fastflo pipe", cost: 14.89, price: 73.57 },' +
'        { length: 50, itemCode: "WPER14/50-C", description: "14mm x 50m Fastflo pipe", cost: 15.79, price: 91.97 },' +
'        { length: 60, itemCode: "WPER14/60-C", description: "14mm x 60m Fastflo pipe", cost: 18.94, price: 110.32 },' +
'        { length: 70, itemCode: "WPER14/70-C", description: "14mm x 70m Fastflo pipe", cost: 22.09, price: 128.72 },' +
'        { length: 80, itemCode: "WPER14/80-C", description: "14mm x 80m Fastflo pipe", cost: 25.26, price: 147.1 },' +
'        { length: 90, itemCode: "WPER14/90-C", description: "14mm x 90m Fastflo pipe", cost: 28.41, price: 165.51 },' +
'        { length: 100, itemCode: "WPER14/100-C", description: "14mm x 100m Fastflo pipe", cost: 31.56, price: 183.9 },' +
'        { length: 110, itemCode: "WPER14/110-C", description: "14mm x 110m Fastflo pipe", cost: 34.71, price: 202.28 },' +
'        { length: 120, itemCode: "WPER14/120-C", description: "14mm x 120m Fastflo pipe", cost: 37.87, price: 220.65 }' +
'    ] }' +
'};' +
'var PIPE_CONNECTORS = {' +
'    10: { itemCode: "ALE075/10-C", description: "3/4in x 10mm Eurofitting manifold pipe nut, tail and olive", cost: 0.97, price: 7.04 },' +
'    12: { itemCode: "UMFP0112-C", description: "12mm pipe connectors", cost: 0.64, price: 3.96 },' +
'    14: { itemCode: "ALE075/14-C", description: "3/4in x 14mm Eurofitting manifold pipe nut, tail and olive", cost: 1.0, price: 4.43 }' +
'};' +
'var GUIDE_CURVES = {' +
'    10: { itemCode: "GC10-C", description: "Guide curve for 10-12mm pipe", cost: 0.27, price: 1.34 },' +
'    12: { itemCode: "GC10-C", description: "Guide curve for 10-12mm pipe", cost: 0.27, price: 1.34 },' +
'    14: { itemCode: "GC14-C", description: "Guide curve for 14 and 17mm pipe", cost: 0.3, price: 2.04 }' +
'};' +
'var MAX_PIPE_LENGTH = {' +
'    10: { newBuild: 50, renovation: 45 },' +
'    12: { newBuild: 80, renovation: 70 },' +
'    14: { newBuild: 110, renovation: 105 }' +
'};' +
'var DESIGN_RATE_PER_HOUR = 36;' +
'var DESIGN_AREA_MULTIPLIER = 0.015;' +
'var DESIGN_BASE_HOURS = 2;' +
'var DESIGN_MARGIN = 0.66;' +
'var DELIVERY_PER_100M2 = 75;' +
'var DELIVERY_MARGIN = 0.66;' +
'var manifolds = [];' +
'var manifoldCounter = 0;' +
'var bomExpanded = false;' +
'var expandedSections = {};' +
'function generateId() {' +
'    return Math.random().toString(36).substring(2, 9);' +
'}' +
'function calculateManifoldPorts(areas, buildType) {' +
'    var totalPorts = 0;' +
'    for (var i = 0; i < areas.length; i++) {' +
'        var area = areas[i];' +
'        var fc = null;' +
'        for (var j = 0; j < FLOOR_CONSTRUCTIONS.length; j++) {' +
'            if (FLOOR_CONSTRUCTIONS[j].name === area.floorConstruction) {' +
'                fc = FLOOR_CONSTRUCTIONS[j];' +
'                break;' +
'            }' +
'        }' +
'        if (fc && area.areaSqm > 0) {' +
'            var pipeLength = (area.areaSqm * 1000) / fc.tubeSpacing;' +
'            var maxLength = MAX_PIPE_LENGTH[fc.pipeDiameter][buildType === "New Build" ? "newBuild" : "renovation"];' +
'            var coils = Math.ceil(pipeLength / maxLength);' +
'            totalPorts += coils;' +
'        }' +
'    }' +
'    return totalPorts;' +
'}' +
'window.addManifold = function() {' +
'    manifoldCounter++;' +
'    var manifold = {' +
'        id: generateId(),' +
'        name: "Manifold " + manifoldCounter,' +
'        areas: [{ id: generateId(), roomName: "", floorConstruction: "Screed (Cliptrack)", areaSqm: 20, thermostats: 1 }],' +
'        expanded: true' +
'    };' +
'    manifolds.push(manifold);' +
'    window.renderManifolds();' +
'};' +
'window.removeManifold = function(manifoldId) {' +
'    var newManifolds = [];' +
'    for (var i = 0; i < manifolds.length; i++) {' +
'        if (manifolds[i].id !== manifoldId) {' +
'            newManifolds.push(manifolds[i]);' +
'        }' +
'    }' +
'    manifolds = newManifolds;' +
'    window.renderManifolds();' +
'};' +
'window.addArea = function(manifoldId) {' +
'    for (var i = 0; i < manifolds.length; i++) {' +
'        if (manifolds[i].id === manifoldId) {' +
'            manifolds[i].areas.push({ id: generateId(), roomName: "", floorConstruction: "Screed (Cliptrack)", areaSqm: 20, thermostats: 1 });' +
'            break;' +
'        }' +
'    }' +
'    window.renderManifolds();' +
'};' +
'window.removeArea = function(manifoldId, areaId) {' +
'    for (var i = 0; i < manifolds.length; i++) {' +
'        if (manifolds[i].id === manifoldId && manifolds[i].areas.length > 1) {' +
'            var newAreas = [];' +
'            for (var j = 0; j < manifolds[i].areas.length; j++) {' +
'                if (manifolds[i].areas[j].id !== areaId) {' +
'                    newAreas.push(manifolds[i].areas[j]);' +
'                }' +
'            }' +
'            manifolds[i].areas = newAreas;' +
'            break;' +
'        }' +
'    }' +
'    window.renderManifolds();' +
'};' +
'window.toggleManifold = function(manifoldId) {' +
'    for (var i = 0; i < manifolds.length; i++) {' +
'        if (manifolds[i].id === manifoldId) {' +
'            manifolds[i].expanded = !manifolds[i].expanded;' +
'            break;' +
'        }' +
'    }' +
'    window.renderManifolds();' +
'};' +
'window.updateArea = function(manifoldId, areaId, field, value) {' +
'    for (var i = 0; i < manifolds.length; i++) {' +
'        if (manifolds[i].id === manifoldId) {' +
'            for (var j = 0; j < manifolds[i].areas.length; j++) {' +
'                if (manifolds[i].areas[j].id === areaId) {' +
'                    manifolds[i].areas[j][field] = value;' +
'                    break;' +
'                }' +
'            }' +
'            break;' +
'        }' +
'    }' +
'};' +
'window.renderManifolds = function() {' +
'    var container = document.getElementById("manifoldsContainer");' +
'    var buildType = document.getElementById("buildType").value;' +
'    var html = "";' +
'    for (var mIdx = 0; mIdx < manifolds.length; mIdx++) {' +
'        var manifold = manifolds[mIdx];' +
'        var ports = calculateManifoldPorts(manifold.areas, buildType);' +
'        var hasError = ports > 12;' +
'        html += "<div class=\\"manifold-card\\">";' +
'        html += "<div class=\\"manifold-header\\" onclick=\\"window.toggleManifold(\'" + manifold.id + "\')\\">";' +
'        html += "<div class=\\"manifold-title\\">";' +
'        html += "<span class=\\"chevron " + (manifold.expanded ? "down" : "") + "\\">▶</span>";' +
'        html += "<span>" + manifold.name + "</span>";' +
'        html += "</div>";' +
'        html += "<div class=\\"manifold-info\\">";' +
'        html += "<span class=\\"port-badge " + (hasError ? "error" : "") + "\\">" + ports + " Ports</span>";' +
'        if (manifolds.length > 1) {' +
'            html += "<button type=\\"button\\" class=\\"btn btn-danger\\" onclick=\\"event.stopPropagation(); window.removeManifold(\'" + manifold.id + "\')\\">[X]</button>";' +
'        }' +
'        html += "</div></div>";' +
'        html += "<div class=\\"manifold-content " + (manifold.expanded ? "expanded" : "") + "\\">";' +
'        if (hasError) {' +
'            html += "<div class=\\"error-message\\">Warning: More than 12 ports are being used on this manifold - please adjust</div>";' +
'        }' +
'        for (var aIdx = 0; aIdx < manifold.areas.length; aIdx++) {' +
'            var area = manifold.areas[aIdx];' +
'            html += "<div class=\\"area-row\\">";' +
'            html += "<div class=\\"area-header\\">";' +
'            html += "<span>Area " + (aIdx + 1) + (area.roomName ? " - " + area.roomName : "") + "</span>";' +
'            if (manifold.areas.length > 1) {' +
'                html += "<button type=\\"button\\" class=\\"btn btn-danger\\" onclick=\\"window.removeArea(\'" + manifold.id + "\', \'" + area.id + "\')\\">[X]</button>";' +
'            }' +
'            html += "</div>";' +
'            html += "<div class=\\"area-inputs\\">";' +
'            html += "<div class=\\"form-group\\">";' +
'            html += "<label>Room Name (optional)</label>";' +
'            html += "<input type=\\"text\\" value=\\"" + (area.roomName || "") + "\\" placeholder=\\"e.g. Kitchen\\" onchange=\\"window.updateArea(\'" + manifold.id + "\', \'" + area.id + "\', \'roomName\', this.value); window.renderManifolds();\\">";' +
'            html += "</div>";' +
'            html += "<div class=\\"form-group\\">";' +
'            html += "<label>Floor Construction</label>";' +
'            html += "<select onchange=\\"window.updateArea(\'" + manifold.id + "\', \'" + area.id + "\', \'floorConstruction\', this.value); window.renderManifolds();\\">";' +
'            for (var fcIdx = 0; fcIdx < FLOOR_CONSTRUCTIONS.length; fcIdx++) {' +
'                var fc = FLOOR_CONSTRUCTIONS[fcIdx];' +
'                html += "<option value=\\"" + fc.name + "\\"" + (area.floorConstruction === fc.name ? " selected" : "") + ">" + fc.name + "</option>";' +
'            }' +
'            html += "</select></div>";' +
'            html += "<div class=\\"form-group\\">";' +
'            html += "<label>Area (m2)</label>";' +
'            html += "<input type=\\"number\\" value=\\"" + area.areaSqm + "\\" min=\\"0\\" onchange=\\"window.updateArea(\'" + manifold.id + "\', \'" + area.id + "\', \'areaSqm\', parseFloat(this.value) || 0); window.renderManifolds();\\">";' +
'            html += "</div>";' +
'            html += "<div class=\\"form-group\\">";' +
'            html += "<label>Thermostats</label>";' +
'            html += "<input type=\\"number\\" value=\\"" + area.thermostats + "\\" min=\\"0\\" onchange=\\"window.updateArea(\'" + manifold.id + "\', \'" + area.id + "\', \'thermostats\', parseInt(this.value) || 0);\\">";' +
'            html += "</div>";' +
'            html += "</div></div>";' +
'        }' +
'        html += "<button type=\\"button\\" class=\\"btn btn-secondary\\" onclick=\\"window.addArea(\'" + manifold.id + "\')\\">[+] Add Area</button>";' +
'        html += "</div></div>";' +
'    }' +
'    container.innerHTML = html;' +
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
'window.calculateQuote = function() {' +
'    var heatSource = document.getElementById("heatSource").value;' +
'    var buildType = document.getElementById("buildType").value;' +
'    var targetMargin = parseFloat(document.getElementById("targetMargin").value) || 0;' +
'    var lineItems = [];' +
'    var errors = [];' +
'    var totalArea = 0;' +
'    var totalThermostats = 0;' +
'    var totalPorts = 0;' +
'    var floorConstructionTotals = {};' +
'    var pipeDiameterTotals = {};' +
'    for (var mIdx = 0; mIdx < manifolds.length; mIdx++) {' +
'        var manifold = manifolds[mIdx];' +
'        var ports = calculateManifoldPorts(manifold.areas, buildType);' +
'        if (ports > 12) {' +
'            errors.push(manifold.name + " has more than 12 ports (" + ports + "). Please adjust.");' +
'        }' +
'        totalPorts += ports;' +
'        for (var aIdx = 0; aIdx < manifold.areas.length; aIdx++) {' +
'            var area = manifold.areas[aIdx];' +
'            totalArea += area.areaSqm;' +
'            totalThermostats += area.thermostats;' +
'            var fc = null;' +
'            for (var fcIdx = 0; fcIdx < FLOOR_CONSTRUCTIONS.length; fcIdx++) {' +
'                if (FLOOR_CONSTRUCTIONS[fcIdx].name === area.floorConstruction) {' +
'                    fc = FLOOR_CONSTRUCTIONS[fcIdx];' +
'                    break;' +
'                }' +
'            }' +
'            if (fc) {' +
'                if (!floorConstructionTotals[fc.name]) {' +
'                    floorConstructionTotals[fc.name] = { area: 0, fc: fc };' +
'                }' +
'                floorConstructionTotals[fc.name].area += area.areaSqm;' +
'                if (!pipeDiameterTotals[fc.pipeDiameter]) {' +
'                    pipeDiameterTotals[fc.pipeDiameter] = { length: 0, ports: 0 };' +
'                }' +
'                var pipeLength = (area.areaSqm * 1000) / fc.tubeSpacing;' +
'                pipeDiameterTotals[fc.pipeDiameter].length += pipeLength;' +
'                var maxLength = MAX_PIPE_LENGTH[fc.pipeDiameter][buildType === "New Build" ? "newBuild" : "renovation"];' +
'                pipeDiameterTotals[fc.pipeDiameter].ports += Math.ceil(pipeLength / maxLength);' +
'            }' +
'        }' +
'    }' +
'    var pumpList = heatSource === "Heat Pump" ? HEAT_PUMP_PUMPS : BOILER_PUMPS;' +
'    var areaKey = buildType === "New Build" ? "newBuildArea" : "renovationArea";' +
'    var selectedPump = pumpList[pumpList.length - 1];' +
'    for (var pIdx = 0; pIdx < pumpList.length; pIdx++) {' +
'        var pump = pumpList[pIdx];' +
'        if (totalArea <= pump[areaKey]) {' +
'            selectedPump = pump;' +
'            break;' +
'        }' +
'    }' +
'    lineItems.push({ section: "Pump", description: selectedPump.description + " (" + selectedPump.itemCode + ")", quantity: 1, cost: selectedPump.cost, price: selectedPump.price, totalCost: selectedPump.cost, totalPrice: selectedPump.price });' +
'    for (var mIdx2 = 0; mIdx2 < manifolds.length; mIdx2++) {' +
'        var manifold2 = manifolds[mIdx2];' +
'        var ports2 = Math.min(12, calculateManifoldPorts(manifold2.areas, buildType));' +
'        var manifoldData = MANIFOLDS[MANIFOLDS.length - 1];' +
'        for (var manIdx = 0; manIdx < MANIFOLDS.length; manIdx++) {' +
'            if (MANIFOLDS[manIdx].ports >= ports2) {' +
'                manifoldData = MANIFOLDS[manIdx];' +
'                break;' +
'            }' +
'        }' +
'        lineItems.push({ section: "Manifold", description: manifoldData.description + " (" + manifoldData.itemCode + ")", quantity: 1, cost: manifoldData.cost, price: manifoldData.price, totalCost: manifoldData.cost, totalPrice: manifoldData.price });' +
'    }' +
'    lineItems.push({ section: "Manifold", description: MANIFOLD_CONNECTION.description + " (" + MANIFOLD_CONNECTION.itemCode + ")", quantity: manifolds.length, cost: MANIFOLD_CONNECTION.cost, price: MANIFOLD_CONNECTION.price, totalCost: MANIFOLD_CONNECTION.cost * manifolds.length, totalPrice: MANIFOLD_CONNECTION.price * manifolds.length });' +
'    if (totalThermostats > 0) {' +
'        lineItems.push({ section: "Controls", description: THERMOSTAT.description + " (" + THERMOSTAT.itemCode + ")", quantity: totalThermostats, cost: THERMOSTAT.cost, price: THERMOSTAT.price, totalCost: THERMOSTAT.cost * totalThermostats, totalPrice: THERMOSTAT.price * totalThermostats });' +
'    }' +
'    var wiringCentres = Math.ceil(totalThermostats / 8);' +
'    if (wiringCentres > 0) {' +
'        lineItems.push({ section: "Controls", description: WIRING_CENTRE.description + " (" + WIRING_CENTRE.itemCode + ")", quantity: wiringCentres, cost: WIRING_CENTRE.cost, price: WIRING_CENTRE.price, totalCost: WIRING_CENTRE.cost * wiringCentres, totalPrice: WIRING_CENTRE.price * wiringCentres });' +
'    }' +
'    if (totalPorts > 0) {' +
'        lineItems.push({ section: "Controls", description: ACTUATOR.description + " (" + ACTUATOR.itemCode + ")", quantity: totalPorts, cost: ACTUATOR.cost, price: ACTUATOR.price, totalCost: ACTUATOR.cost * totalPorts, totalPrice: ACTUATOR.price * totalPorts });' +
'        if (heatSource !== "Heat Pump") {' +
'            var junctionBoxes = Math.ceil(totalPorts / 12);' +
'            lineItems.push({ section: "Controls", description: JUNCTION_BOX.description + " (" + JUNCTION_BOX.itemCode + ")", quantity: junctionBoxes, cost: JUNCTION_BOX.cost, price: JUNCTION_BOX.price, totalCost: JUNCTION_BOX.cost * junctionBoxes, totalPrice: JUNCTION_BOX.price * junctionBoxes });' +
'        }' +
'    }' +
'    for (var diameter in pipeDiameterTotals) {' +
'        if (pipeDiameterTotals.hasOwnProperty(diameter)) {' +
'            var data = pipeDiameterTotals[diameter];' +
'            var d = parseInt(diameter);' +
'            var coils = PIPE_COILS[d].coils;' +
'            var largeCoil = coils[coils.length - 1];' +
'            var numCoils = Math.ceil(data.length / largeCoil.length);' +
'            if (numCoils > 0) {' +
'                lineItems.push({ section: "Pipe", description: largeCoil.description + " (" + largeCoil.itemCode + ")", quantity: numCoils, cost: largeCoil.cost, price: largeCoil.price, totalCost: largeCoil.cost * numCoils, totalPrice: largeCoil.price * numCoils });' +
'            }' +
'            var connectors = data.ports * 2;' +
'            var connector = PIPE_CONNECTORS[d];' +
'            lineItems.push({ section: "Pipe", description: connector.description + " (" + connector.itemCode + ")", quantity: connectors, cost: connector.cost, price: connector.price, totalCost: connector.cost * connectors, totalPrice: connector.price * connectors });' +
'            var guideCurve = GUIDE_CURVES[d];' +
'            lineItems.push({ section: "Pipe", description: guideCurve.description + " (" + guideCurve.itemCode + ")", quantity: data.ports, cost: guideCurve.cost, price: guideCurve.price, totalCost: guideCurve.cost * data.ports, totalPrice: guideCurve.price * data.ports });' +
'        }' +
'    }' +
'    for (var fcName in floorConstructionTotals) {' +
'        if (floorConstructionTotals.hasOwnProperty(fcName)) {' +
'            var fcData = floorConstructionTotals[fcName];' +
'            lineItems.push({ section: "Floor Construction", description: fcName + " (" + fcData.fc.itemCode + ") - " + fcData.area.toFixed(1) + " m2", quantity: Math.ceil(fcData.area), cost: fcData.fc.cost, price: fcData.fc.price, totalCost: fcData.fc.cost * fcData.area, totalPrice: fcData.fc.price * fcData.area });' +
'        }' +
'    }' +
'    var designHours = Math.ceil(totalArea * DESIGN_AREA_MULTIPLIER + DESIGN_BASE_HOURS);' +
'    var designCost = designHours * DESIGN_RATE_PER_HOUR;' +
'    var designPrice = designCost / (1 - DESIGN_MARGIN);' +
'    lineItems.push({ section: "Design and Delivery", description: "Design charge (" + designHours + " hours)", quantity: 1, cost: designCost, price: designPrice, totalCost: designCost, totalPrice: designPrice });' +
'    var pallets = Math.max(2, Math.ceil(totalArea / 100) + 1);' +
'    var deliveryCost = pallets * DELIVERY_PER_100M2;' +
'    var deliveryPrice = deliveryCost / (1 - DELIVERY_MARGIN);' +
'    lineItems.push({ section: "Design and Delivery", description: "Delivery charge (" + pallets + " pallets)", quantity: 1, cost: deliveryCost, price: deliveryPrice, totalCost: deliveryCost, totalPrice: deliveryPrice });' +
'    var totalCost = 0;' +
'    var totalListPrice = 0;' +
'    for (var liIdx = 0; liIdx < lineItems.length; liIdx++) {' +
'        totalCost += lineItems[liIdx].totalCost;' +
'        totalListPrice += lineItems[liIdx].totalPrice;' +
'    }' +
'    var finalQuotePrice = totalCost / (1 - targetMargin / 100);' +
'    renderResults(lineItems, errors, totalCost, totalListPrice, finalQuotePrice, targetMargin);' +
'};' +
'function renderResults(lineItems, errors, totalCost, totalListPrice, finalQuotePrice, targetMargin) {' +
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
'    summaryHtml += "<div class=\\"summary-box\\"><p class=\\"label\\">Total Cost</p><p class=\\"value\\">" + formatCurrency(totalCost) + "</p></div>";' +
'    summaryHtml += "<div class=\\"summary-box\\"><p class=\\"label\\">List Price Total</p><p class=\\"value\\">" + formatCurrency(totalListPrice) + "</p></div>";' +
'    summaryHtml += "<div class=\\"summary-box highlight\\"><p class=\\"label\\">Quote Price (" + targetMargin + "% margin)</p><p class=\\"value\\">" + formatCurrency(finalQuotePrice) + "</p></div>";' +
'    summaryHtml += "</div>";' +
'    summaryContainer.innerHTML = summaryHtml;' +
'    var descLines = [];' +
'    descLines.push("Nu-Heat Underfloor Heating Quote");' +
'    descLines.push("================================");' +
'    descLines.push("");' +
'    for (var mIdx = 0; mIdx < manifolds.length; mIdx++) {' +
'        var manifold = manifolds[mIdx];' +
'        if (manifolds.length > 1) {' +
'            descLines.push(manifold.name + ":");' +
'        }' +
'        for (var aIdx = 0; aIdx < manifold.areas.length; aIdx++) {' +
'            var area = manifold.areas[aIdx];' +
'            var roomLabel = area.roomName ? area.roomName + " - " : "";' +
'            descLines.push("\\u2022 " + roomLabel + area.floorConstruction + ", " + area.areaSqm + "m\\u00B2");' +
'        }' +
'        if (manifolds.length > 1 && mIdx < manifolds.length - 1) {' +
'            descLines.push("");' +
'        }' +
'    }' +
'    descLines.push("");' +
'    descLines.push("--------------------------------");' +
'    descLines.push("Estimated Price: " + formatCurrency(finalQuotePrice));' +
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
'    for (var mIdx2 = 0; mIdx2 < manifolds.length; mIdx2++) {' +
'        var manifold2 = manifolds[mIdx2];' +
'        if (manifolds.length > 1) {' +
'            descHtml += "<div style=\\"font-weight:500;color:#4b5563;\\">" + manifold2.name + ":</div>";' +
'        }' +
'        for (var aIdx2 = 0; aIdx2 < manifold2.areas.length; aIdx2++) {' +
'            var area2 = manifold2.areas[aIdx2];' +
'            var roomLabel2 = area2.roomName ? area2.roomName + " - " : "";' +
'            descHtml += "<div style=\\"margin-left:8px;\\">\\u2022 " + roomLabel2 + area2.floorConstruction + ", " + area2.areaSqm + "m\\u00B2</div>";' +
'        }' +
'    }' +
'    descHtml += "<div class=\\"price-line\\">Estimated Price: " + formatCurrency(finalQuotePrice) + "</div>";' +
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
'}' +
'window.addManifold();' +
'</script>' +
'</body>' +
'</html>';
    }

    return {
        onRequest: onRequest
    };
});
