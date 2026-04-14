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
                title: ' '
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
'        @import url(\'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap\');' +
'        /* === Nu-Heat Brand Tokens === */' +
'        :root {' +
'  --nh-teal: #00857D;' +
'  --nh-teal-dark: #074F71;' +
'  --nh-secondary: #00B0B9;' +
'  --nh-accent: #E35205;' +
'  --nh-yellow: #FFB500;' +
'  --nh-yellow-light: #fff8e1;' +
'  --nh-magenta: #AA0061;' +
'  --nh-purple: #59315F;' +
'  --nh-success: #00b67a;' +
'  --nh-text: #53565A;' +
'  --nh-text-dark: #2d2d2d;' +
'  --nh-text-light: #796E65;' +
'  --nh-grey-light: #f5f5f5;' +
'  --nh-grey-border: #D9D9D6;' +
'  --nh-white: #FFFFFF;' +
'  --nh-bg: #F5F5F5;' +
'  --nh-shadow-sm: 0 1px 3px rgba(0,0,0,0.08);' +
'  --nh-shadow-md: 0 4px 12px rgba(0,0,0,0.10);' +
'  --nh-shadow-lg: 0 8px 24px rgba(0,0,0,0.12);' +
'  --nh-radius-sm: 4px;' +
'  --nh-radius-md: 8px;' +
'  --nh-radius-lg: 12px;' +
'  --nh-font-family: "Poppins", sans-serif;' +
'        }' +
'        /* === Base === */' +
'        * { box-sizing: border-box; margin: 0; padding: 0; }' +
'        body {' +
'            font-family: var(--nh-font-family);' +
'            background: var(--nh-bg);' +
'            color: var(--nh-text);' +
'            width: 100%;' +
'            overflow-x: hidden;' +
'            -webkit-font-smoothing: antialiased;' +
'            -moz-osx-font-smoothing: grayscale;' +
'            font-size: 16px;' +
'            line-height: 1.6;' +
'        }' +
'        /* === Header === */' +
'        .nh-header-logo {' +
'            color: var(--nh-white);' +
'            font-size: 22px;' +
'            font-weight: 700;' +
'            letter-spacing: -0.5px;' +
'        }' +
'        .nh-header-logo span { font-weight: 300; }' +
'        /* === Hero === */' +
'        .nh-hero {' +
'            background: var(--nh-white);' +
'            text-align: center;' +
'            padding: 36px 32px 28px;' +
'            border-bottom: 1px solid var(--nh-grey-border);' +
'        }' +
'        .nh-hero h1 {' +
'            font-size: 36px;' +
'            font-weight: 700;' +
'            color: var(--nh-purple);' +
'            margin-bottom: 12px;' +
'            letter-spacing: -0.5px;' +
'        }' +
'        .nh-hero p {' +
'            font-size: 16px;' +
'            color: var(--nh-text);' +
'            max-width: 720px;' +
'            margin: 0 auto;' +
'            font-weight: 400;' +
'            line-height: 1.7;' +
'        }' +
'        /* === Page wrapper === */' +
'        .nh-page { max-width: 1400px; margin: 0 auto; padding: 0 40px 64px; box-shadow: var(--nh-shadow-lg); background: var(--nh-white); }' +
'        /* === Section === */' +
'        .nh-section {' +
'            margin-top: 32px;' +
'            margin-bottom: 36px;' +
'            background: var(--nh-white);' +
'            border-radius: 8px;' +
'            border: 1px solid var(--nh-grey-border);' +
'            overflow: hidden;' +
'        }' +
'        .nh-section-header {' +
'            background: var(--nh-teal);' +
'            padding: 12px 20px;' +
'            color: var(--nh-white);' +
'            font-size: 18px;' +
'            font-weight: 600;' +
'            letter-spacing: 0.5px;' +
'            text-transform: uppercase;' +
'            display: flex;' +
'            align-items: center;' +
'            gap: 10px;' +
'        }' +
'        .nh-step-num {' +
'            display: inline-flex;' +
'            align-items: center;' +
'            justify-content: center;' +
'            width: 22px;' +
'            height: 22px;' +
'            border-radius: 50%;' +
'            background: rgba(255,255,255,0.2);' +
'            font-size: 12px;' +
'            font-weight: 700;' +
'            flex-shrink: 0;' +
'        }' +
'        .nh-section-body { padding: 24px 20px; }' +
'        .nh-section-header h2 { font-size: inherit; font-weight: inherit; margin: 0; }' +
'        /* === Config sections === */' +
'        .nh-config-section {' +
'            display: flex;' +
'            align-items: flex-start;' +
'            gap: 24px;' +
'            padding: 16px 20px;' +
'            background: #f0f0ee;' +
'            border-radius: 6px;' +
'            margin-bottom: 12px;' +
'        }' +
'        .nh-config-section:last-child { margin-bottom: 0; }' +
'        .nh-config-label {' +
'            flex-shrink: 0;' +
'            width: 160px;' +
'            padding-top: 6px;' +
'        }' +
'        .nh-config-label-title { font-size: 13px; font-weight: 600; color: var(--nh-text-dark); margin-bottom: 4px; }' +
'        .nh-config-label-hint { font-size: 11px; font-weight: 400; color: var(--nh-text); line-height: 1.4; }' +
'        .nh-config-cards { flex: 1; }' +
'        /* === Collapsible panel === */' +
'        .nh-collapsible-toggle {' +
'            display: flex;' +
'            justify-content: space-between;' +
'            align-items: center;' +
'            cursor: pointer;' +
'            padding: 0;' +
'            background: none;' +
'            border: none;' +
'            width: 100%;' +
'        }' +
'        .nh-collapsible-toggle:hover .nh-section-header { background: var(--nh-teal-dark); }' +
'        .nh-collapsible-body { overflow: hidden; transition: max-height 0.25s ease; }' +
'        .nh-collapsible-body.collapsed { display: none; }' +
'        .nh-collapse-chevron {' +
'            color: var(--nh-white);' +
'            font-size: 13px;' +
'            margin-left: 12px;' +
'            transition: transform 0.2s;' +
'            flex-shrink: 0;' +
'        }' +
'        .nh-collapse-chevron.open { transform: rotate(180deg); }' +
'        /* === Card grid === */' +
'        .nh-card-grid { display: flex; flex-wrap: wrap; gap: 12px; }' +
'        .nh-card {' +
'            flex: 0 0 140px;' +
'            min-height: 90px;' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 8px;' +
'            padding: 12px 10px 10px;' +
'            text-align: center;' +
'            cursor: pointer;' +
'            background: var(--nh-white);' +
'            transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;' +
'            position: relative;' +
'            user-select: none;' +
'        }' +
'        .nh-card:hover { border-color: var(--nh-teal); box-shadow: var(--nh-shadow-md); }' +
'        .nh-card.selected { border-color: var(--nh-teal); background: #f0f9f8; box-shadow: 0 2px 10px rgba(0,133,125,0.18); }' +
'        .nh-card.selected .nh-card-label { color: var(--nh-teal-dark); }' +
'        .nh-card-icon { margin-bottom: 6px; display: flex; justify-content: center; align-items: center; height: 32px; }' +
'        .nh-card-icon svg {' +
'            width: 26px; height: 26px;' +
'            stroke: var(--nh-teal); fill: none;' +
'            stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;' +
'            transition: stroke 0.15s;' +
'        }' +
'        .nh-card.selected .nh-card-icon svg { stroke: var(--nh-teal); }' +
'        .nh-card-label { font-size: 11px; font-weight: 600; color: var(--nh-text-dark); line-height: 1.3; }' +
'        /* === Recommended badge === */' +
'        .nh-badge-recommended {' +
'            position: absolute; top: -1px; right: -1px;' +
'            background: var(--nh-magenta); color: var(--nh-white);' +
'            font-size: 9px; font-weight: 700; letter-spacing: 0.5px;' +
'            text-transform: uppercase; padding: 3px 7px;' +
'            border-radius: 0 6px 0 6px;' +
'        }' +
'        /* === Floors section === */' +
'        .nh-floors-actions-top { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }' +
'        .nh-floors-actions-bottom { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }' +
'        /* === Floor card === */' +
'        .floor-card {' +
'            background: var(--nh-grey-light);' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 8px;' +
'            margin-bottom: 12px;' +
'            overflow: hidden;' +
'            box-shadow: var(--nh-shadow-sm);' +
'        }' +
'        .floor-card-header {' +
'            background: #e9e9e7;' +
'            color: var(--nh-text-dark);' +
'            padding: 8px 14px;' +
'            display: flex;' +
'            align-items: center;' +
'            justify-content: space-between;' +
'            gap: 12px;' +
'            border-bottom: 1px solid var(--nh-grey-border);' +
'        }' +
'        .floor-card-header .floor-title { font-weight: 600; font-size: 13px; white-space: nowrap; color: var(--nh-text-dark); }' +
'        .floor-card-header .floor-type-select {' +
'            flex: 1;' +
'            max-width: 220px;' +
'            padding: 4px 8px;' +
'            font-size: 12px;' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 4px;' +
'            background: var(--nh-white);' +
'            color: var(--nh-text-dark);' +
'            font-family: var(--nh-font-family);' +
'        }' +
'        .floor-card-header .btn-danger { border-color: #bbb; color: #c0392b; padding: 3px 8px; font-size: 11px; flex-shrink: 0; }' +
'        .floor-card-header .btn-danger:hover { background: #fdf2f2; }' +
'        .floor-card-body { padding: 16px; }' +
'        /* === Manifold card === */' +
'        .manifold-card {' +
'            background: var(--nh-white);' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 6px;' +
'            margin-bottom: 10px;' +
'            overflow: hidden;' +
'            box-shadow: var(--nh-shadow-sm);' +
'        }' +
'        .manifold-card-header {' +
'            background: var(--nh-white);' +
'            padding: 10px 14px;' +
'            display: flex;' +
'            align-items: center;' +
'            justify-content: space-between;' +
'            gap: 10px;' +
'            border-bottom: 2px solid var(--nh-grey-border);' +
'        }' +
'        .manifold-card-header .manifold-title { font-weight: 600; font-size: 14px; color: var(--nh-text-dark); white-space: nowrap; }' +
'        .manifold-card-header .manifold-ports { font-size: 13px; font-weight: 600; color: var(--nh-text); white-space: nowrap; }' +
'        .manifold-card-header .btn-danger { padding: 4px 10px; font-size: 12px; font-weight: 700; flex-shrink: 0; }' +
'        .manifold-card-body { padding: 12px 14px; }' +
'        /* === Area rows === */' +
'        .area-row {' +
'            display: flex;' +
'            flex-wrap: wrap;' +
'            gap: 8px;' +
'            align-items: center;' +
'            padding: 8px 0;' +
'            border-bottom: 1px solid var(--nh-grey-border);' +
'        }' +
'        .area-row:last-child { border-bottom: none; }' +
'        /* === Form elements === */' +
'        label {' +
'            font-size: 12px;' +
'            font-weight: 500;' +
'            color: var(--nh-text);' +
'            display: block;' +
'            margin-bottom: 4px;' +
'            text-transform: uppercase;' +
'            letter-spacing: 0.4px;' +
'        }' +
'        input[type="number"], input[type="text"], select {' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 6px;' +
'            padding: 10px 14px;' +
'            font-family: var(--nh-font-family);' +
'            font-size: 14px;' +
'            color: var(--nh-text-dark);' +
'            background: var(--nh-white);' +
'            width: 100%;' +
'            transition: border-color 0.15s;' +
'        }' +
'        input[type="number"]:focus, input[type="text"]:focus, select:focus {' +
'            outline: none;' +
'            border-color: var(--nh-teal);' +
'            box-shadow: 0 0 0 3px rgba(0,133,125,0.15);' +
'        }' +
'        /* === Buttons === */' +
'        .btn {' +
'            display: inline-flex;' +
'            align-items: center;' +
'            gap: 6px;' +
'            padding: 12px 24px;' +
'            border-radius: var(--nh-radius-md);' +
'            font-family: var(--nh-font-family);' +
'            font-size: 13px;' +
'            font-weight: 600;' +
'            cursor: pointer;' +
'            border: none;' +
'            transition: background 0.15s, box-shadow 0.15s;' +
'            letter-spacing: 0.3px;' +
'        }' +
'        .btn:hover { transform: translateY(-1px); }' +
'        .btn-primary { background: var(--nh-teal); color: var(--nh-white); }' +
'        .btn-primary:hover { background: var(--nh-teal-dark); box-shadow: 0 2px 8px rgba(0,133,125,0.25); }' +
'        .btn-cta { background: var(--nh-magenta); color: var(--nh-white); font-weight: 600; padding: 14px 32px; font-size: 15px; border-radius: var(--nh-radius-md); letter-spacing: 0.3px; }' +
'        .btn-cta:hover { background: #8c0050; box-shadow: 0 4px 12px rgba(170,0,97,0.3); transform: translateY(-1px); }' +
'        .btn-secondary { background: var(--nh-white); color: var(--nh-teal); border: 1px solid var(--nh-teal); }' +
'        .btn-secondary:hover { background: #f0f9f8; }' +
'        .btn-danger { background: transparent; color: #c0392b; border: 1px solid #c0392b; padding: 5px 10px; font-size: 12px; }' +
'        .btn-danger:hover { background: #fdf2f2; transform: none; }' +
'        .btn-sm { padding: 6px 12px; font-size: 12px; }' +
'        /* === Calculate row === */' +
'        .nh-calculate-row {' +
'            display: flex;' +
'            align-items: flex-end;' +
'            gap: 16px;' +
'            flex-wrap: wrap;' +
'            background: var(--nh-white);' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 8px;' +
'            padding: 20px;' +
'            margin-bottom: 24px;' +
'        }' +
'        .nh-calculate-row .price-level-group { flex: 1; min-width: 180px; max-width: 260px; }' +
'        .nh-calculate-row .calc-btn-group { flex-shrink: 0; }' +
'        /* === Results === */' +
'        .nh-results { background: var(--nh-white); border: 1px solid var(--nh-grey-border); border-radius: 8px; overflow: hidden; box-shadow: var(--nh-shadow-md); }' +
'        .nh-results-header { background: var(--nh-teal); padding: 12px 20px; }' +
'        .nh-results-header h2 { color: var(--nh-white); font-size: 18px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }' +
'        .nh-results-body { padding: 24px 20px; }' +
'        .summary-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }' +
'        .summary-box { flex: 1; min-width: 160px; border: 1px solid var(--nh-grey-border); border-radius: 6px; padding: 14px 16px; text-align: center; }' +
'        .summary-box.highlight { border-color: var(--nh-teal); background: #f0f9f8; }' +
'        .summary-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; color: var(--nh-text); margin-bottom: 6px; }' +
'        .summary-box .value { font-size: 28px; font-weight: 700; color: var(--nh-purple); }' +
'        .summary-box.highlight .value { color: var(--nh-teal-dark); }' +
'        /* === BOM === */' +
'        .bom-collapsible { border: 1px solid var(--nh-grey-border); border-radius: 6px; overflow: hidden; }' +
'        .bom-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--nh-grey-light); cursor: pointer; font-weight: 600; font-size: 14px; color: var(--nh-text-dark); }' +
'        .bom-header:hover { background: #eeeeec; }' +
'        .bom-section-header { display: flex; justify-content: space-between; align-items: center; padding: 9px 14px; background: #fafafa; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--nh-text-dark); border-bottom: 1px solid var(--nh-grey-border); }' +
'        .bom-section-header:hover { background: #f0f0ee; }' +
'        /* .bom-content and .bom-section-content visibility is controlled by JS style.display only */' +
'        .results-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }' +
'        .results-table col.col-desc { width: 55%; }' +
'        .results-table col.col-qty { width: 10%; }' +
'        .results-table col.col-unit { width: 17%; }' +
'        .results-table col.col-total { width: 18%; }' +
'        .results-table th { background: var(--nh-grey-light); padding: 8px 10px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--nh-text); border-bottom: 1px solid var(--nh-grey-border); }' +
'        .results-table td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; color: var(--nh-text-dark); }' +
'        .results-table tr:last-child td { border-bottom: none; }' +
'        .item-count { font-size: 12px; color: var(--nh-text-light); margin-right: 8px; font-weight: 400; }' +
'        .chevron { font-size: 11px; color: var(--nh-teal); }' +
'        /* === Spinner / FC error === */' +
'        .fc-spinner { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--nh-text); padding: 7px 10px; border: 1px solid var(--nh-grey-border); border-radius: 4px; }' +
'        .fc-spinner::before { content: ""; width: 14px; height: 14px; border: 2px solid var(--nh-grey-border); border-top-color: var(--nh-teal); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }' +
'        .fc-error-inline { font-size: 12px; color: #c0392b; padding: 6px 10px; border: 1px solid #f5c6cb; border-radius: 4px; background: #fdf2f2; }' +
'        @keyframes spin { to { transform: rotate(360deg); } }' +
'        /* === Error messages === */' +
'        .error-message { background: #fdf2f2; border: 1px solid #f5c6cb; border-radius: 4px; padding: 10px 14px; margin-bottom: 8px; font-size: 13px; color: #721c24; }' +
'        /* === Quote description === */' +
'        .quote-description { background: var(--nh-grey-light); border: 1px solid var(--nh-grey-border); border-radius: 6px; padding: 16px; }' +
'        .price-line { font-size: 18px; font-weight: 700; color: var(--nh-teal-dark); margin-top: 12px; }' +
'        .disclaimer { font-size: 12px; color: var(--nh-text-light); margin-top: 8px; font-style: italic; }' +
'        .copy-btn { margin-top: 10px; background: var(--nh-white); border: 1px solid var(--nh-teal); color: var(--nh-teal); padding: 7px 14px; border-radius: var(--nh-radius-md); font-family: var(--nh-font-family); font-size: 12px; font-weight: 600; cursor: pointer; }' +
'        .copy-btn.copied { background: var(--nh-teal); color: var(--nh-white); }' +
'        /* === Utility === */' +
'        .hidden { display: none !important; }' +
'        .mt-8 { margin-top: 8px; }' +
'        .mt-12 { margin-top: 12px; }' +
'        /* === Responsive === */' +
'        @media (max-width: 768px) {' +
'            .nh-page { padding: 0 20px 40px; box-shadow: none; }' +
'            .nh-hero h1 { font-size: 28px; }' +
'            .nh-hero p { font-size: 14px; }' +
'            .nh-section-header { font-size: 16px; padding: 10px 16px; }' +
'            .nh-config-section { flex-direction: column; gap: 8px; }' +
'            .nh-config-label { flex: none; }' +
'            .nh-card { flex: 0 0 calc(33.33% - 8px); min-height: 80px; }' +
'            .nh-card-grid { gap: 8px; }' +
'            .summary-box { min-width: calc(50% - 8px); }' +
'            .nh-calculate-row { flex-direction: column; align-items: stretch; }' +
'            .nh-calculate-row .price-level-group { max-width: 100%; }' +
'        }' +
'        @media (max-width: 600px) {' +
'            .nh-page { padding: 0 12px 32px; }' +
'            .nh-hero h1 { font-size: 24px; }' +
'            .nh-section-header { font-size: 14px; padding: 10px 14px; }' +
'            .nh-card { flex: 0 0 calc(50% - 6px); }' +
'            .summary-box { min-width: 100%; }' +
'            .summary-box .value { font-size: 22px; }' +
'            .btn { padding: 10px 20px; font-size: 13px; }' +
'            .btn-cta { padding: 12px 24px; font-size: 14px; width: 100%; }' +
'            .area-row { flex-wrap: wrap; }' +
'            .nh-results-header h2 { font-size: 14px; }' +
'        }' +
'        @media (max-width: 320px) {' +
'            .nh-page { padding: 0 8px 24px; }' +
'            .nh-card { flex: 0 0 calc(50% - 4px); min-height: 70px; padding: 8px 6px; font-size: 11px; }' +
'            .nh-card-grid { gap: 6px; }' +
'            .nh-hero h1 { font-size: 20px; }' +
'            .btn-cta { font-size: 13px; padding: 10px 16px; }' +
'        }' +
'        .nh-epc-card {' +
'            background: var(--nh-white);' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: var(--nh-radius-md);' +
'            padding: 20px 24px;' +
'            margin-bottom: 16px;' +
'        }' +
'        .nh-epc-card-title {' +
'            font-size: 13px;' +
'            font-weight: 600;' +
'            color: var(--nh-text-dark);' +
'            text-transform: uppercase;' +
'            letter-spacing: 0.3px;' +
'            margin-bottom: 4px;' +
'        }' +
'        .nh-epc-card-hint {' +
'            font-size: 13px;' +
'            color: var(--nh-text-light);' +
'            margin-bottom: 16px;' +
'        }' +
'        .nh-epc-input-row {' +
'            display: flex;' +
'            align-items: center;' +
'            gap: 10px;' +
'            flex-wrap: wrap;' +
'        }' +
'        .nh-epc-postcode-input {' +
'            padding: 10px 14px;' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 6px;' +
'            font-size: 14px;' +
'            font-family: var(--nh-font-family);' +
'            width: 160px;' +
'            text-transform: uppercase;' +
'        }' +
'        .nh-epc-postcode-input:focus {' +
'            outline: none;' +
'            border-color: var(--nh-teal);' +
'            box-shadow: 0 0 0 3px rgba(0,133,125,0.15);' +
'        }' +
'        .nh-epc-address-select {' +
'            padding: 10px 14px;' +
'            border: 1px solid var(--nh-grey-border);' +
'            border-radius: 6px;' +
'            font-size: 14px;' +
'            font-family: var(--nh-font-family);' +
'            min-width: 280px;' +
'            max-width: 420px;' +
'        }' +
'        .nh-epc-status {' +
'            font-size: 13px;' +
'            color: var(--nh-text-light);' +
'            font-style: italic;' +
'        }' +
'        .nh-epc-data-strip {' +
'            margin-top: 14px;' +
'            padding: 12px 16px;' +
'            background: var(--nh-grey-light);' +
'            border-radius: 6px;' +
'            border: 1px solid var(--nh-grey-border);' +
'            display: flex;' +
'            flex-wrap: wrap;' +
'            gap: 16px;' +
'            align-items: center;' +
'        }' +
'        .nh-epc-data-item {' +
'            display: flex;' +
'            flex-direction: column;' +
'            gap: 2px;' +
'        }' +
'        .nh-epc-data-label {' +
'            font-size: 10px;' +
'            font-weight: 600;' +
'            text-transform: uppercase;' +
'            letter-spacing: 0.3px;' +
'            color: var(--nh-text-light);' +
'        }' +
'        .nh-epc-data-value {' +
'            font-size: 14px;' +
'            font-weight: 500;' +
'            color: var(--nh-text-dark);' +
'        }' +
'        .nh-epc-rating {' +
'            display: inline-block;' +
'            padding: 2px 10px;' +
'            border-radius: 4px;' +
'            font-weight: 700;' +
'            font-size: 14px;' +
'            color: white;' +
'        }' +
'        .nh-epc-rating-a { background: #009a44; }' +
'        .nh-epc-rating-b { background: #4daf23; }' +
'        .nh-epc-rating-c { background: #8cc21b; }' +
'        .nh-epc-rating-d { background: #f0b800; }' +
'        .nh-epc-rating-e { background: #f07800; }' +
'        .nh-epc-rating-f { background: #e02020; }' +
'        .nh-epc-rating-g { background: #a00000; }' +
'        .nh-epc-badge {' +
'            display: inline-block;' +
'            padding: 2px 8px;' +
'            background: var(--nh-teal);' +
'            color: white;' +
'            border-radius: 4px;' +
'            font-size: 11px;' +
'            font-weight: 600;' +
'            margin-left: 6px;' +
'            vertical-align: middle;' +
'        }' +
'    </style>' +
'</head>' +
'<body>' +
'<div class="nh-hero">' +
'    <h1>Instant Estimate Builder</h1>' +
'    <p>Configure your underfloor heating system and get an instant materials estimate.</p>' +
'</div>' +
'<div class="nh-page">' +
'    <div class="nh-section" id="propertyInfoPanel">' +
'        <div class="nh-section-header" onclick="window.togglePropertyInfo()" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">' +
'            <h2>Property &amp; System Configuration</h2>' +
'            <span class="nh-collapse-chevron open" id="propertyInfoChevron">&#9660;</span>' +
'        </div>' +
'        <div class="nh-collapsible-body" id="propertyInfoBody">' +
'            <div class="nh-section-body">' +
'<div class="nh-epc-card">' +
'  <div class="nh-epc-card-title">Postcode / EPC Lookup</div>' +
'  <div class="nh-epc-card-hint">Enter your postcode to automatically populate your estimate from your EPC certificate, or leave blank and continue entering details manually.</div>' +
'  <div class="nh-epc-input-row">' +
'    <input type="text" id="epcPostcodeInput" class="nh-epc-postcode-input" placeholder="e.g. EX5 1AB" maxlength="8" />' +
'    <button type="button" class="btn btn-secondary" onclick="window.lookupEpc()">Look Up</button>' +
'    <select id="epcAddressSelect" class="nh-epc-address-select" style="display:none;" onchange="window.selectEpcAddress()">' +
'      <option value="">- Select your address -</option>' +
'    </select>' +
'    <span id="epcStatus" class="nh-epc-status"></span>' +
'  </div>' +
'  <div id="epcDataStrip" class="nh-epc-data-strip" style="display:none;">' +
'    <div class="nh-epc-data-item">' +
'      <span class="nh-epc-data-label">Address</span>' +
'      <span class="nh-epc-data-value" id="epcDisplayAddress">-</span>' +
'    </div>' +
'    <div class="nh-epc-data-item">' +
'      <span class="nh-epc-data-label">Property Type</span>' +
'      <span class="nh-epc-data-value" id="epcDisplayPropertyType">-</span>' +
'    </div>' +
'    <div class="nh-epc-data-item">' +
'      <span class="nh-epc-data-label">Floor Area</span>' +
'      <span class="nh-epc-data-value" id="epcDisplayFloorArea">-</span>' +
'    </div>' +
'    <div class="nh-epc-data-item">' +
'      <span class="nh-epc-data-label">EPC Rating</span>' +
'      <span class="nh-epc-data-value" id="epcDisplayRating">-</span>' +
'    </div>' +
'    <div class="nh-epc-data-item">' +
'      <span class="nh-epc-data-label">Floor Type</span>' +
'      <span class="nh-epc-data-value" id="epcDisplayFloor">-</span>' +
'    </div>' +
'    <div class="nh-epc-data-item">' +
'      <span class="nh-epc-data-label">Construction</span>' +
'      <span class="nh-epc-data-value" id="epcDisplayConstruction">-</span>' +
'    </div>' +
'  </div>' +
'</div>' +
'                <div class="nh-config-section">' +
'                    <div class="nh-config-label">' +
'                        <div class="nh-config-label-title">1. Project Type</div>' +
'                        <div class="nh-config-label-hint">Select the type of project you are quoting for</div>' +
'                    </div>' +
'                    <div class="nh-config-cards">' +
'                        <div class="nh-card-grid" id="projectTypeGrid">' +
'                            <div class="nh-card" id="proj-newbuild" onclick="window.selectProjectType(\'New Build\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg></div>' +
'                                <div class="nh-card-label">New Build</div>' +
'                            </div>' +
'                            <div class="nh-card" id="proj-backbrick" onclick="window.selectProjectType(\'Renovation (Back to Brick)\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M4 21V8l8-5 8 5v13"/><path d="M9 21v-5h6v5"/><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg></div>' +
'                                <div class="nh-card-label">Renovation (Back to Brick)</div>' +
'                            </div>' +
'                            <div class="nh-card" id="proj-lighttouch" onclick="window.selectProjectType(\'Renovation (Light Touch)\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 00-7 7c0 3 1.5 5 4 6.5V17h6v-1.5C17.5 14 19 12 19 9a7 7 0 00-7-7z"/><path d="M9 17v1a3 3 0 006 0v-1"/></svg></div>' +
'                                <div class="nh-card-label">Renovation (Lighter Touch)</div>' +
'                            </div>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'                <div class="nh-config-section">' +
'                    <div class="nh-config-label">' +
'                        <div class="nh-config-label-title">2. Property Type</div>' +
'                        <div class="nh-config-label-hint">Select one property type to get started</div>' +
'                    </div>' +
'                    <div class="nh-config-cards">' +
'                        <div class="nh-card-grid" id="propertyTypeGrid">' +
'                            <div class="nh-card" id="pt-house" onclick="window.selectPropertyType(\'house\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg></div>' +
'                                <div class="nh-card-label">House</div>' +
'                            </div>' +
'                            <div class="nh-card" id="pt-bungalow" onclick="window.selectPropertyType(\'bungalow\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11L12 4l9 7v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8z"/><path d="M9 21v-6h6v6"/></svg></div>' +
'                                <div class="nh-card-label">Bungalow</div>' +
'                            </div>' +
'                            <div class="nh-card" id="pt-flat" onclick="window.selectPropertyType(\'flat\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg></div>' +
'                                <div class="nh-card-label">Flat / Apartment</div>' +
'                            </div>' +
'                            <div class="nh-card" id="pt-maisonette" onclick="window.selectPropertyType(\'maisonette\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/><path d="M9 21v-5h6v5"/><path d="M3 13h18"/></svg></div>' +
'                                <div class="nh-card-label">Maisonette</div>' +
'                            </div>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'                <div class="nh-config-section">' +
'                    <div class="nh-config-label">' +
'                        <div class="nh-config-label-title">3. Heating System</div>' +
'                        <div class="nh-config-label-hint">Select the heat source for this installation</div>' +
'                    </div>' +
'                    <div class="nh-config-cards">' +
'                        <div class="nh-card-grid" id="heatSourceGrid">' +
'                            <div class="nh-card" id="hs-boiler" onclick="window.selectHeatSource(\'Boiler\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 7v2M12 15v2M7 12h2M15 12h2"/></svg></div>' +
'                                <div class="nh-card-label">UFH &amp; Boiler</div>' +
'                            </div>' +
'                            <div class="nh-card" id="hs-heatpump" onclick="window.selectHeatSource(\'Heat Pump\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h4"/></svg></div>' +
'                                <div class="nh-card-label">UFH &amp; Heat Pump</div>' +
'                            </div>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'                <div class="nh-config-section">' +
'                    <div class="nh-config-label">' +
'                        <div class="nh-config-label-title">4. Thermostat Package</div>' +
'                        <div class="nh-config-label-hint">Select the thermostat type for this installation</div>' +
'                    </div>' +
'                    <div class="nh-config-cards">' +
'                        <div class="nh-card-grid" id="thermostatGrid">' +
'                            <div class="nh-card" id="th-dial" onclick="window.selectThermostat(\'Dial\')">' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 7v1M12 16v1M7 12h1M16 12h1"/></svg></div>' +
'                                <div class="nh-card-label">Dial</div>' +
'                            </div>' +
'                            <div class="nh-card" id="th-wired" onclick="window.selectThermostat(\'Wired Programmable\')">' +
'                                <span class="nh-badge-recommended" id="badge-wired" style="display:none">Recommended</span>' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg></div>' +
'                                <div class="nh-card-label">Wired Programmable</div>' +
'                            </div>' +
'                            <div class="nh-card" id="th-wireless" onclick="window.selectThermostat(\'Wireless\')">' +
'                                <span class="nh-badge-recommended" id="badge-wireless" style="display:none">Recommended</span>' +
'                                <div class="nh-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5a9.5 9.5 0 0114 0"/><path d="M8 16a5 5 0 018 0"/><circle cx="12" cy="19" r="1"/></svg></div>' +
'                                <div class="nh-card-label">Wireless</div>' +
'                            </div>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'            </div>' +
'        </div>' +
'    </div>' +
'    <div class="nh-section">' +
'        <div class="nh-section-header"><span class="nh-step-num">5</span> Floors &amp; Manifolds</div>' +
'        <div class="nh-section-body">' +
'            <div class="nh-floors-actions-top">' +
'                <button type="button" class="btn btn-secondary btn-sm" onclick="window.addFloor(\'basement\')">+ Add Basement</button>' +
'                <button type="button" class="btn btn-secondary btn-sm" onclick="window.addFloor(\'lowerground\')">+ Add Lower Ground</button>' +
'            </div>' +
'            <div id="floorList"></div>' +
'            <div class="nh-floors-actions-bottom">' +
'                <button type="button" class="btn btn-secondary btn-sm" onclick="window.addFloor(\'upper\')">+ Add Upper Floor</button>' +
'            </div>' +
'        </div>' +
'    </div>' +
'    <div class="nh-calculate-row">' +
'        <div class="price-level-group">' +
'            <label for="priceLevel">Price Level</label>' +
'            <select id="priceLevel">' +
'                <option value="13" selected>Homeowner</option>' +
'                <option value="14">Installer</option>' +
'                <option value="15">Developer</option>' +
'                <option value="16">Merchant</option>' +
'            </select>' +
'        </div>' +
'        <div class="calc-btn-group">' +
'            <button type="button" class="btn btn-cta" onclick="window.calculateQuote()">Calculate Estimate</button>' +
'        </div>' +
'    </div>' +
'    <div id="resultsSection" class="nh-results hidden">' +
'        <div class="nh-results-header"><h2>Estimate Results</h2></div>' +
'        <div class="nh-results-body">' +
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
'/* the Suitelet is running in - no environment URL is hardcoded here. */' +
'var RESTLET_BASE_URL = ' + JSON.stringify(restletUrl) + ';' +
'' +
'/* Floor constructions - populated at runtime from the RESTlet (action=getFloorConstructions). */' +
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
'/* Thermostats */' +
'var THERMOSTAT_DIAL     = { itemCode: "DSSB5-C",      description: "Dial stat thermostat", cost: 0, price: 0 };' +
'var THERMOSTAT_WIRED    = { itemCode: "neoStatWv3-C", description: "White neoStat V3 thermostat, Mains Voltage (240V) wired connection", cost: 0, price: 0 };' +
'var THERMOSTAT_WIRELESS = { itemCode: "neoAirWv3-C",  description: "neoAir V3 wireless thermostat", cost: 0, price: 0 };' +
'/* Wiring centres */' +
'var WIRING_CENTRE_WIRED    = { itemCode: "UH8-C",   description: "UH8, 8 zone 230V Wiring Centre", cost: 0, price: 0 };' +
'var WIRING_CENTRE_WIRELESS = { itemCode: "UH8RF-C", description: "UH8-RF, 8 zone wireless wiring centre", cost: 0, price: 0 };' +
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
'    16: { itemCode: "UMFP0116-C",  description: "16mm pipe connectors (placeholder - confirm item code)" }' +
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
'var selectedPropertyType = null;' +
'var selectedProjectType = null;' +
'var selectedHeatSource = null;' +
'var selectedThermostat = null;' +
'var epcData = null;' +
'var epcAddressRows = [];' +
'var floors = [];' +
'var floorCounters = { ground: 0, upper: 0, lowerground: 0, basement: 0 };' +
'var FLOOR_ORDER = { basement: 1, lowerground: 2, ground: 3, upper: 4 };' +
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
'window.togglePropertyInfo = function() {' +
'    var body = document.getElementById(\'propertyInfoBody\');' +
'    var chevron = document.getElementById(\'propertyInfoChevron\');' +
'    if (body.classList.contains(\'collapsed\')) {' +
'        body.classList.remove(\'collapsed\');' +
'        chevron.classList.add(\'open\');' +
'    } else {' +
'        body.classList.add(\'collapsed\');' +
'        chevron.classList.remove(\'open\');' +
'    }' +
'};' +
'window.selectPropertyType = function(type) {' +
'    selectedPropertyType = type;' +
'    var cards = document.querySelectorAll(\'#propertyTypeGrid .nh-card\');' +
'    for (var i = 0; i < cards.length; i++) {' +
'        cards[i].classList.remove(\'selected\');' +
'    }' +
'    document.getElementById(\'pt-\' + type).classList.add(\'selected\');' +
'    window.applyPropertyTypeFloors(type);' +
'};' +
'window.applyPropertyTypeFloors = function(type) {' +
'    floors = [];' +
'    floorCounters = { ground: 0, upper: 0, lowerground: 0, basement: 0 };' +
'    if (type === \'house\') {' +
'        window.addFloor(\'ground\');' +
'        window.addFloor(\'upper\');' +
'    } else if (type === \'bungalow\') {' +
'        window.addFloor(\'ground\');' +
'    } else if (type === \'flat\') {' +
'        window.addFloor(\'ground\');' +
'    } else if (type === \'maisonette\') {' +
'        window.addFloor(\'ground\');' +
'        window.addFloor(\'upper\');' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.selectProjectType = function(type) {' +
'    selectedProjectType = type;' +
'    var cards = document.querySelectorAll(\'#projectTypeGrid .nh-card\');' +
'    for (var i = 0; i < cards.length; i++) {' +
'        cards[i].classList.remove(\'selected\');' +
'    }' +
'    var idMap = {' +
'        \'New Build\': \'proj-newbuild\',' +
'        \'Renovation (Back to Brick)\': \'proj-backbrick\',' +
'        \'Renovation (Light Touch)\': \'proj-lighttouch\'' +
'    };' +
'    document.getElementById(idMap[type]).classList.add(\'selected\');' +
'    window.updateRecommendedBadge();' +
'};' +
'window.selectHeatSource = function(src) {' +
'    selectedHeatSource = src;' +
'    var cards = document.querySelectorAll(\'#heatSourceGrid .nh-card\');' +
'    for (var i = 0; i < cards.length; i++) {' +
'        cards[i].classList.remove(\'selected\');' +
'    }' +
'    var idMap = { \'Boiler\': \'hs-boiler\', \'Heat Pump\': \'hs-heatpump\' };' +
'    document.getElementById(idMap[src]).classList.add(\'selected\');' +
'};' +
'window.selectThermostat = function(type) {' +
'    selectedThermostat = type;' +
'    var cards = document.querySelectorAll(\'#thermostatGrid .nh-card\');' +
'    for (var i = 0; i < cards.length; i++) {' +
'        cards[i].classList.remove(\'selected\');' +
'    }' +
'    var idMap = {' +
'        \'Dial\': \'th-dial\',' +
'        \'Wired Programmable\': \'th-wired\',' +
'        \'Wireless\': \'th-wireless\'' +
'    };' +
'    document.getElementById(idMap[type]).classList.add(\'selected\');' +
'};' +
'window.updateRecommendedBadge = function() {' +
'    var wired = document.getElementById(\'badge-wired\');' +
'    var wireless = document.getElementById(\'badge-wireless\');' +
'    if (selectedProjectType === \'New Build\' || selectedProjectType === \'Renovation (Back to Brick)\') {' +
'        wired.style.display = \'\';' +
'        wireless.style.display = \'none\';' +
'    } else if (selectedProjectType === \'Renovation (Light Touch)\') {' +
'        wired.style.display = \'none\';' +
'        wireless.style.display = \'\';' +
'    } else {' +
'        wired.style.display = \'none\';' +
'        wireless.style.display = \'none\';' +
'    }' +
'};' +
'window.renderFloors = function() {' +
'    try {' +
'    var container = document.getElementById("floorList");' +
'    var workType = selectedProjectType || "New Build";' +
'    var html = "";' +
'    for (var fIdx = 0; fIdx < floors.length; fIdx++) {' +
'        var floor = floors[fIdx];' +
'        html += "<div class=\\"floor-card\\">";' +
'        html += "<div class=\\"floor-card-header\\">";' +
'        html += "<span class=\\"floor-title\\">" + floor.name + "</span>";' +
'        html += "<select class=\\"floor-type-select\\" onchange=\\"window.updateFloorType(\'" + floor.id + "\', this.value)\\">";' +
'        html += "<option value=\\"solid\\"" + (floor.floorType === "solid" ? " selected" : "") + ">Solid (concrete)</option>";' +
'        html += "<option value=\\"joisted\\"" + (floor.floorType === "joisted" ? " selected" : "") + ">Joisted (suspended timber)</option>";' +
'        html += "</select>";' +
'        html += "<button class=\\"btn btn-danger\\" onclick=\\"window.removeFloor(\'" + floor.id + "\')\\">" + (floors.length <= 1 ? "<span style=\\"opacity:0.4;\\">Remove</span>" : "Remove") + "</button>";' +
'        html += "</div>";' +
'        html += "<div class=\\"floor-card-body\\">";' +
'        for (var mIdx = 0; mIdx < floor.manifolds.length; mIdx++) {' +
'            var manifold = floor.manifolds[mIdx];' +
'            var ports = calculateManifoldPorts(manifold.areas, workType);' +
'            var hasError = ports > 12;' +
'            html += "<div class=\\"manifold-card\\">";' +
'            html += "<div class=\\"manifold-card-header\\">";' +
'            html += "<span class=\\"manifold-title\\">" + manifold.name + "</span>";' +
'            html += "<span class=\\"manifold-ports" + (hasError ? " error" : "") + "\\">" + ports + " Ports</span>";' +
'            html += "<button class=\\"btn btn-danger\\" onclick=\\"window.removeManifold(\'" + floor.id + "\', \'" + manifold.id + "\')\\">" + (floor.manifolds.length <= 1 ? "<span style=\\"opacity:0.4;\\">Remove</span>" : "Remove") + "</button>";' +
'            html += "</div>";' +
'            html += "<div class=\\"manifold-card-body\\">";' +
'            if (hasError) {' +
'                html += "<div class=\\"error-message\\">Warning: More than 12 ports are being used on this manifold - please adjust</div>";' +
'            }' +
'            for (var aIdx = 0; aIdx < manifold.areas.length; aIdx++) {' +
'                var area = manifold.areas[aIdx];' +
'                html += "<div class=\\"area-row\\">";' +
'                html += "<div style=\\"display:flex;flex-direction:column;gap:4px;flex:0 0 150px;\\">";' +
'                html += "<label style=\\"font-size:11px;color:#64748b;font-weight:500;\\">Floor Type</label>";' +
'                html += "<select style=\\"height:36px;padding:0 8px;box-sizing:border-box;\\" onchange=\\"window.updateAreaFloorType(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', this.value)\\">";' +
'                html += "<option value=\\"solid\\"" + (area.floorType === "solid" ? " selected" : "") + ">Solid (concrete)</option>";' +
'                html += "<option value=\\"joisted\\"" + (area.floorType === "joisted" ? " selected" : "") + ">Joisted (suspended timber)</option>";' +
'                html += "</select></div>";' +
'                html += "<div style=\\"display:flex;flex-direction:column;gap:4px;flex:1 1 100px;min-width:80px;\\">";' +
'                html += "<label style=\\"font-size:11px;color:#64748b;font-weight:500;\\">Room Name (optional)</label>";' +
'                html += "<input type=\\"text\\" style=\\"height:36px;padding:0 8px;box-sizing:border-box;\\" value=\\"" + (area.roomName || "") + "\\" placeholder=\\"e.g. Kitchen\\" onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'roomName\', this.value); window.renderFloors();\\">";' +
'                html += "</div>";' +
'                html += "<div style=\\"display:flex;flex-direction:column;gap:4px;flex:0 0 240px;\\">";' +
'                html += "<label style=\\"font-size:11px;color:#64748b;font-weight:500;\\">Floor Construction</label>";' +
'                if (!floorConstructionsLoaded) {' +
'                    html += "<div class=\\"fc-spinner\\">Loading floor constructions...</div>";' +
'                } else if (FLOOR_CONSTRUCTIONS.length === 0) {' +
'                    html += "<div class=\\"fc-error-inline\\">Floor construction data unavailable - please contact support</div>";' +
'                } else {' +
'                    html += "<select style=\\"height:36px;padding:0 8px;box-sizing:border-box;\\" onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'floorConstruction\', this.value); window.renderFloors();\\">";' +
'                    for (var fcIdx = 0; fcIdx < FLOOR_CONSTRUCTIONS.length; fcIdx++) {' +
'                        var fc = FLOOR_CONSTRUCTIONS[fcIdx];' +
'                        html += "<option value=\\"" + fc.itemid + "\\"" + (area.floorConstruction === fc.itemid ? " selected" : "") + ">" + (fc.label || fc.itemid) + " (" + fc.itemid + ")</option>";' +
'                    }' +
'                    html += "</select>";' +
'                }' +
'                html += "</div>";' +
'                html += "<div style=\\"display:flex;flex-direction:column;gap:4px;flex:0 0 60px;\\">";' +
'                html += "<label style=\\"font-size:11px;color:#64748b;font-weight:500;\\">Area m2</label>";' +
'                html += "<input type=\\"number\\" style=\\"height:36px;padding:0 8px;box-sizing:border-box;width:100%;\\" value=\\"" + area.areaSqm + "\\" min=\\"0\\" onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'areaSqm\', parseFloat(this.value) || 0);\\">";' +
'                html += "</div>";' +
'                html += "<div style=\\"display:flex;flex-direction:column;gap:4px;flex:0 0 60px;\\">";' +
'                html += "<label style=\\"font-size:11px;color:#64748b;font-weight:500;\\">Thermostats</label>";' +
'                html += "<input type=\\"number\\" style=\\"height:36px;padding:0 8px;box-sizing:border-box;width:100%;\\" value=\\"" + area.thermostats + "\\" min=\\"0\\" onchange=\\"window.updateArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\', \'thermostats\', parseInt(this.value) || 0);\\">";' +
'                html += "</div>";' +
'                if (manifold.areas.length > 1) {' +
'                    html += "<button type=\\"button\\" class=\\"btn btn-danger\\" style=\\"align-self:flex-end;flex:0 0 36px;min-width:36px;width:36px;\\" onclick=\\"window.removeArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\')\\">[X]</button>";' +
'                } else {' +
'                    html += "<button type=\\"button\\" class=\\"btn btn-danger\\" style=\\"align-self:flex-end;flex:0 0 36px;min-width:36px;width:36px;opacity:0.3;cursor:not-allowed;\\" disabled onclick=\\"window.removeArea(\'" + floor.id + "\', \'" + manifold.id + "\', \'" + area.id + "\')\\">[X]</button>";' +
'                }' +
'                html += "</div>";' +
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
'    /* Default floor construction based on project type and floor type */' +
'    var defaultFC;' +
'    if (selectedProjectType === "Renovation (Light Touch)") {' +
'        defaultFC = (floorType === "joisted") ? "OT2(120)12" : "LPM(150)10";' +
'    } else {' +
'        defaultFC = (floorType === "joisted") ? "ND(150)14" : "SC(150)14";' +
'    }' +
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
'            areas: [{ id: generateId(), roomName: "", floorConstruction: defaultFC, floorType: floorType, areaSqm: 20, thermostats: 1 }]' +
'        }]' +
'    };' +
'    /* Insert floor at correct sorted position based on FLOOR_ORDER */' +
'    var inserted = false;' +
'    for (var fi = 0; fi < floors.length; fi++) {' +
'        if (FLOOR_ORDER[floors[fi].type] > FLOOR_ORDER[newFloor.type]) {' +
'            floors.splice(fi, 0, newFloor);' +
'            inserted = true;' +
'            break;' +
'        }' +
'    }' +
'    if (!inserted) {' +
'        floors.push(newFloor);' +
'    }' +
'    window.renderFloors();' +
'};' +
'window.autoCalcZones = function() {' +
'    if (!epcData || !epcData.totalFloorArea) { return; }' +
'    var tfa = parseFloat(epcData.totalFloorArea);' +
'    if (isNaN(tfa) || tfa <= 0) { return; }' +
'    var pt = (epcData.propertyType || "").toLowerCase();' +
'    var isSingleStorey = (pt === "bungalow" || pt === "flat");' +
'    var MAX_PORTS = 12;' +
'    /* Determine default floor constructions from current project type */' +
'    var solidFC = (selectedProjectType === "Renovation (Light Touch)") ? "LPM(150)10" : "SC(150)14";' +
'    var joistedFC = (selectedProjectType === "Renovation (Light Touch)") ? "OT2(120)12" : "ND(150)14";' +
'    /* --- HABITABLE ROOMS PATH --- */' +
'    if (epcData.habitableRooms && epcData.habitableRooms > 0) {' +
'        var adjustedRooms = epcData.habitableRooms + 2;' +
'        /* Derive bedroom count using FRD scaling to estimate split */' +
'        var scaleFactor = Math.pow(tfa / 85, 0.6);' +
'        function scaledRoom(base, min, max) {' +
'            return Math.min(max, Math.max(min, base * scaleFactor));' +
'        }' +
'        var bedroomCount = 1;' +
'        var remainingBedArea = (isSingleStorey ? tfa : tfa * 0.5);' +
'        remainingBedArea -= scaledRoom(14, 10, 25);' +
'        remainingBedArea -= scaledRoom(5, 3.5, 10);' +
'        while (remainingBedArea > scaledRoom(12, 9, 20) && bedroomCount < 4) {' +
'            bedroomCount++;' +
'            remainingBedArea -= scaledRoom(12, 9, 20);' +
'        }' +
'        /* Reset floors and counters */' +
'        floors = [];' +
'        floorCounters = { ground: 0, upper: 0, lowerground: 0, basement: 0 };' +
'        function makeManifolds(areaSqm, thermostats, floorType, fc) {' +
'            var manifoldList = [];' +
'            if (thermostats <= MAX_PORTS) {' +
'                manifoldList.push({' +
'                    id: generateId(),' +
'                    name: "Manifold 1",' +
'                    floorType: floorType,' +
'                    expanded: true,' +
'                    areas: [{ id: generateId(), roomName: "", floorConstruction: fc, floorType: floorType, areaSqm: Math.round(areaSqm), thermostats: thermostats }]' +
'                });' +
'            } else {' +
'                var t1 = Math.round(thermostats / 2);' +
'                var t2 = thermostats - t1;' +
'                var a1 = Math.round(areaSqm / 2);' +
'                var a2 = Math.round(areaSqm - a1);' +
'                manifoldList.push({' +
'                    id: generateId(),' +
'                    name: "Manifold 1",' +
'                    floorType: floorType,' +
'                    expanded: true,' +
'                    areas: [{ id: generateId(), roomName: "", floorConstruction: fc, floorType: floorType, areaSqm: a1, thermostats: t1 }]' +
'                });' +
'                manifoldList.push({' +
'                    id: generateId(),' +
'                    name: "Manifold 2",' +
'                    floorType: floorType,' +
'                    expanded: true,' +
'                    areas: [{ id: generateId(), roomName: "", floorConstruction: fc, floorType: floorType, areaSqm: a2, thermostats: t2 }]' +
'                });' +
'            }' +
'            return manifoldList;' +
'        }' +
'        if (isSingleStorey) {' +
'            /* Single storey: all rooms on ground floor */' +
'            floorCounters.ground++;' +
'            floors.push({' +
'                id: generateId(),' +
'                type: "ground",' +
'                name: "Ground Floor",' +
'                floorType: "solid",' +
'                expanded: true,' +
'                manifolds: makeManifolds(tfa, adjustedRooms, "solid", solidFC)' +
'            });' +
'        } else {' +
'            /* Multi-storey: split ground and upper */' +
'            var groundThermostats = Math.max(1, adjustedRooms - bedroomCount);' +
'            var upperThermostats = bedroomCount + 1;' +
'            var groundArea = Math.round(tfa * 0.5);' +
'            var upperArea = Math.round(tfa * 0.5);' +
'            floorCounters.ground++;' +
'            floors.push({' +
'                id: generateId(),' +
'                type: "ground",' +
'                name: "Ground Floor",' +
'                floorType: "solid",' +
'                expanded: true,' +
'                manifolds: makeManifolds(groundArea, groundThermostats, "solid", solidFC)' +
'            });' +
'            floorCounters.upper++;' +
'            floors.push({' +
'                id: generateId(),' +
'                type: "upper",' +
'                name: "Upper Floor",' +
'                floorType: "joisted",' +
'                expanded: true,' +
'                manifolds: makeManifolds(upperArea, upperThermostats, "joisted", joistedFC)' +
'            });' +
'        }' +
'        window.renderFloors();' +
'        return;' +
'    }' +
'    /* --- FALLBACK: FRD 12.3 scaled room algorithm --- */' +
'    var scaleFactor = Math.pow(tfa / 85, 0.6);' +
'    function scaledRoom(base, min, max) {' +
'        return Math.min(max, Math.max(min, Math.round(base * scaleFactor)));' +
'    }' +
'    floors = [];' +
'    floorCounters = { ground: 0, upper: 0, lowerground: 0, basement: 0 };' +
'    function makeAreaRow(roomName, areaSqm, floorType, fc) {' +
'        return { id: generateId(), roomName: roomName, floorConstruction: fc, floorType: floorType, areaSqm: areaSqm, thermostats: 1 };' +
'    }' +
'    function packIntoManifolds(areas, floorType) {' +
'        var manifoldList = [];' +
'        var current = [];' +
'        for (var ai = 0; ai < areas.length; ai++) {' +
'            current.push(areas[ai]);' +
'            if (current.length >= MAX_PORTS) {' +
'                manifoldList.push({ id: generateId(), name: "Manifold " + (manifoldList.length + 1), floorType: floorType, expanded: true, areas: current });' +
'                current = [];' +
'            }' +
'        }' +
'        if (current.length > 0) {' +
'            manifoldList.push({ id: generateId(), name: "Manifold " + (manifoldList.length + 1), floorType: floorType, expanded: true, areas: current });' +
'        }' +
'        return manifoldList;' +
'    }' +
'    /* Ground floor rooms */' +
'    var groundAreas = [];' +
'    groundAreas.push(makeAreaRow("Living Room", scaledRoom(18, 12, 35), "solid", solidFC));' +
'    groundAreas.push(makeAreaRow("Kitchen/Dining", scaledRoom(14, 10, 30), "solid", solidFC));' +
'    groundAreas.push(makeAreaRow("Hallway", scaledRoom(6, 4, 12), "solid", solidFC));' +
'    if (tfa > 70) { groundAreas.push(makeAreaRow("WC", scaledRoom(2.5, 1.5, 5), "solid", solidFC)); }' +
'    if (tfa > 100) { groundAreas.push(makeAreaRow("Utility Room", scaledRoom(4, 3, 8), "solid", solidFC)); }' +
'    floorCounters.ground++;' +
'    floors.push({ id: generateId(), type: "ground", name: "Ground Floor", floorType: "solid", expanded: true, manifolds: packIntoManifolds(groundAreas, "solid") });' +
'    if (!isSingleStorey) {' +
'        /* Upper floor rooms */' +
'        var upperAreas = [];' +
'        var remUpper = tfa * 0.5;' +
'        var masterSize = scaledRoom(14, 10, 25);' +
'        upperAreas.push(makeAreaRow("Master Bedroom", masterSize, "joisted", joistedFC));' +
'        remUpper -= masterSize;' +
'        var bathSize = scaledRoom(5, 3.5, 10);' +
'        upperAreas.push(makeAreaRow("Bathroom", bathSize, "joisted", joistedFC));' +
'        remUpper -= bathSize;' +
'        var bedCount = 1;' +
'        while (remUpper > scaledRoom(12, 9, 20) && bedCount < 4) {' +
'            var dblSize = scaledRoom(12, 9, 20);' +
'            upperAreas.push(makeAreaRow("Bedroom " + (bedCount + 1), dblSize, "joisted", joistedFC));' +
'            remUpper -= dblSize;' +
'            bedCount++;' +
'            if (bedCount === 2 && tfa > 120) {' +
'                var enSize = scaledRoom(3.5, 2, 7);' +
'                upperAreas.push(makeAreaRow("En-Suite", enSize, "joisted", joistedFC));' +
'                remUpper -= enSize;' +
'            }' +
'        }' +
'        floorCounters.upper++;' +
'        floors.push({ id: generateId(), type: "upper", name: "Upper Floor", floorType: "joisted", expanded: true, manifolds: packIntoManifolds(upperAreas, "joisted") });' +
'    }' +
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
'                areas: [{ id: generateId(), roomName: "", floorConstruction: defaultFCForFloorType(floors[i].floorType), floorType: floors[i].floorType, areaSqm: 20, thermostats: 1 }]' +
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
'                    /* Default floor construction based on project type and floor type */' +
'                    var defaultFC;' +
'                    if (selectedProjectType === "Renovation (Light Touch)") {' +
'                        defaultFC = (ft === "joisted") ? "OT2(120)12" : "LPM(150)10";' +
'                    } else {' +
'                        defaultFC = (ft === "joisted") ? "ND(150)14" : "SC(150)14";' +
'                    }' +
'                    floors[i].manifolds[j].areas.push({ id: generateId(), roomName: "", floorConstruction: defaultFC, floorType: ft, areaSqm: 20, thermostats: 1 });' +
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
'    var content = document.getElementById("bomContent");' +
'    var chevron = document.getElementById("bomChevron");' +
'    if (content.style.display === "block") {' +
'        content.style.display = "none";' +
'        chevron.textContent = ">";' +
'    } else {' +
'        content.style.display = "block";' +
'        chevron.textContent = "v";' +
'    }' +
'};' +
'window.toggleBomSection = function(section) {' +
'    var sectionId = section.replace(/ /g, "_");' +
'    var content = document.getElementById("bomSection_" + sectionId);' +
'    var chevron = document.getElementById("bomSectionChevron_" + sectionId);' +
'    if (content.style.display === "block") {' +
'        content.style.display = "none";' +
'        chevron.textContent = ">";' +
'    } else {' +
'        content.style.display = "block";' +
'        chevron.textContent = "v";' +
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
'    var heatSource = selectedHeatSource || "Boiler";' +
'    var workType = selectedProjectType || "New Build";' +
'    var targetMargin = 0;' +
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
'                totalThermostats += area.thermostats;' +
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
'    var areaKey = workType === "New Build" ? "newBuildArea" : "renovationArea";' +
'    var selectedPump;' +
'    var pumpQuantity = 1;' +
'    if (heatSource === "Boiler") {' +
'        /* Option C: use PM1W/2-A per manifold if area-per-manifold fits, else single larger pump */' +
'        var areaPerManifold = totalManifolds > 0 ? totalArea / totalManifolds : totalArea;' +
'        var pm1Pump = BOILER_PUMPS[0];' +
'        if (areaPerManifold <= pm1Pump[areaKey]) {' +
'            selectedPump = pm1Pump;' +
'            pumpQuantity = totalManifolds;' +
'        } else {' +
'            selectedPump = BOILER_PUMPS[BOILER_PUMPS.length - 1];' +
'            for (var pIdx = 0; pIdx < BOILER_PUMPS.length; pIdx++) {' +
'                if (totalArea <= BOILER_PUMPS[pIdx][areaKey]) {' +
'                    selectedPump = BOILER_PUMPS[pIdx];' +
'                    break;' +
'                }' +
'            }' +
'        }' +
'    } else {' +
'        /* Heat Pump: select smallest pump that fits total area */' +
'        selectedPump = HEAT_PUMP_PUMPS[HEAT_PUMP_PUMPS.length - 1];' +
'        for (var pIdx = 0; pIdx < HEAT_PUMP_PUMPS.length; pIdx++) {' +
'            if (totalArea <= HEAT_PUMP_PUMPS[pIdx][areaKey]) {' +
'                selectedPump = HEAT_PUMP_PUMPS[pIdx];' +
'                break;' +
'            }' +
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
'    var activeThermostat = selectedThermostat === "Dial" ? THERMOSTAT_DIAL : (selectedThermostat === "Wireless" ? THERMOSTAT_WIRELESS : THERMOSTAT_WIRED);' +
'    var activeWiringCentre = selectedThermostat === "Wireless" ? WIRING_CENTRE_WIRELESS : WIRING_CENTRE_WIRED;' +
'    /* Wiring centre quantity = max(ceil(thermostats/8), number of manifolds) */' +
'    var wiringCentres = Math.max(Math.ceil(totalThermostats / 8), totalManifolds);' +
'    var junctionBoxes = (heatSource !== "Heat Pump" && totalPorts > 0) ? Math.ceil(totalPorts / 12) : 0;' +
'    var selectedPipeCoils = {};' +
'    for (var diam in pipeDiameterTotals) {' +
'        if (pipeDiameterTotals.hasOwnProperty(diam)) {' +
'            var d = parseInt(diam);' +
'            var diamPre = pipeDiameterTotals[diam];' +
'            if (diamPre.ports === 0) { continue; }' +
'            var coilList = PIPE_COILS[d].coils;' +
'            var lengthPerCircuit = diamPre.length / diamPre.ports;' +
'            var selectedCoil = null;' +
'            for (var ci = 0; ci < coilList.length; ci++) {' +
'                if (coilList[ci].length >= lengthPerCircuit) {' +
'                    selectedCoil = coilList[ci];' +
'                    break;' +
'                }' +
'            }' +
'            if (!selectedCoil) {' +
'                selectedCoil = coilList[coilList.length - 1];' +
'                errors.push("Warning: a pipe circuit requires more than the largest available coil for " + d + "mm pipe. Largest coil used - manual review required.");' +
'            }' +
'            selectedPipeCoils[d] = selectedCoil;' +
'        }' +
'    }' +
'    var itemCodesObj = {};' +
'    itemCodesObj[selectedPump.itemCode] = true;' +
'    for (var smi = 0; smi < selectedManifoldData.length; smi++) { itemCodesObj[selectedManifoldData[smi].itemCode] = true; }' +
'    itemCodesObj[MANIFOLD_CONNECTION.itemCode] = true;' +
'    itemCodesObj[THERMOSTAT_DIAL.itemCode] = true;' +
'    itemCodesObj[THERMOSTAT_WIRED.itemCode] = true;' +
'    itemCodesObj[THERMOSTAT_WIRELESS.itemCode] = true;' +
'    itemCodesObj[WIRING_CENTRE_WIRED.itemCode] = true;' +
'    itemCodesObj[WIRING_CENTRE_WIRELESS.itemCode] = true;' +
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
'    itemCodesObj["DEL/C"] = true;' +
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
'        lineItems.push({ section: "Pump", description: selectedPump.description + " (" + selectedPump.itemCode + ")", quantity: pumpQuantity, price: pumpPrice, totalPrice: pumpPrice * pumpQuantity });' +
'        for (var mi = 0; mi < selectedManifoldData.length; mi++) {' +
'            var md = selectedManifoldData[mi];' +
'            var mdPrice = getPrice(md.itemCode);' +
'            lineItems.push({ section: "Manifold", description: md.description + " (" + md.itemCode + ")", quantity: 1, price: mdPrice, totalPrice: mdPrice });' +
'        }' +
'        var mcPrice = getPrice(MANIFOLD_CONNECTION.itemCode);' +
'        lineItems.push({ section: "Manifold", description: MANIFOLD_CONNECTION.description + " (" + MANIFOLD_CONNECTION.itemCode + ")", quantity: totalManifolds, price: mcPrice, totalPrice: mcPrice * totalManifolds });' +
'        if (totalThermostats > 0) {' +
'            var thPrice = getPrice(activeThermostat.itemCode);' +
'            lineItems.push({ section: "Controls", description: activeThermostat.description + " (" + activeThermostat.itemCode + ")", quantity: totalThermostats, price: thPrice, totalPrice: thPrice * totalThermostats });' +
'        }' +
'        if (wiringCentres > 0) {' +
'            var wcPrice = getPrice(activeWiringCentre.itemCode);' +
'            lineItems.push({ section: "Controls", description: activeWiringCentre.description + " (" + activeWiringCentre.itemCode + ")", quantity: wiringCentres, price: wcPrice, totalPrice: wcPrice * wiringCentres });' +
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
'                if (!coil || diamData.ports === 0) { continue; }' +
'                var coilPrice = getPrice(coil.itemCode);' +
'                lineItems.push({ section: "Pipe", description: coil.description + " (" + coil.itemCode + ")", quantity: diamData.ports, price: coilPrice, totalPrice: coilPrice * diamData.ports, cost: 0, totalCost: 0 });' +
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
'        /* Design line - included in project scope, price 0 */' +
'        lineItems.push({ section: "Design and Delivery", description: "UFH Design", quantity: 1, price: 0, totalPrice: 0 });' +
'        /* Calculate total FC pallets from floor construction totals */' +
'        var totalFCPallets = 0;' +
'        for (var delFcKey in floorConstructionTotals) {' +
'            if (floorConstructionTotals.hasOwnProperty(delFcKey)) {' +
'                var delFcDat = floorConstructionTotals[delFcKey];' +
'                totalFCPallets += (delFcDat.fc.palletsPerSqm || 0) * delFcDat.area;' +
'            }' +
'        }' +
'        /* Property area pallet allowance: 0.5 for properties under 100 m2, 1.0 otherwise */' +
'        var propertyAreaPallets = totalArea < 100 ? 0.5 : 1.0;' +
'        var totalPallets = totalFCPallets + propertyAreaPallets;' +
'        /* Look up DEL/C unit price from fetched price level prices */' +
'        var delcUnitPrice = getPrice("DEL/C");' +
'        if (!delcUnitPrice) {' +
'            errors.push("Delivery item DEL/C price not found - delivery charge excluded");' +
'        } else {' +
'            var deliveryPrice = totalPallets * delcUnitPrice;' +
'            lineItems.push({ section: "Design and Delivery", description: "Delivery (DEL/C) - " + totalPallets.toFixed(2) + " pallets", quantity: 1, price: deliveryPrice, totalPrice: deliveryPrice, cost: 0, totalCost: 0 });' +
'        }' +
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
'    bomHtml += "<div><span class=\\"item-count\\">" + lineItems.length + " items</span><span id=\\"bomChevron\\" class=\\"chevron\\">&gt;</span></div>";' +
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
'            bomHtml += "<div class=\\"bom-section-header\\" onclick=\\"window.toggleBomSection(\'" + section + "\')\\"><span><span id=\\"bomSectionChevron_" + sectionId + "\\" class=\\"chevron\\">&gt;</span> " + section + "</span><span>" + items.length + " items</span></div>";' +
'            bomHtml += "<div id=\\"bomSection_" + sectionId + "\\" class=\\"bom-section-content\\">";' +
'            bomHtml += "<table class=\\"results-table\\"><colgroup><col class=\\"col-desc\\"><col class=\\"col-qty\\"><col class=\\"col-unit\\"><col class=\\"col-total\\"></colgroup><thead><tr><th>Description</th><th style=\\"text-align:center\\">Qty</th><th style=\\"text-align:right\\">Unit Price</th><th style=\\"text-align:right\\">Total</th></tr></thead><tbody>";' +
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
'window.lookupEpc = function() {' +
'  var postcode = document.getElementById("epcPostcodeInput").value.trim().toUpperCase();' +
'  if (!postcode) {' +
'    document.getElementById("epcStatus").textContent = "Please enter a postcode.";' +
'    return;' +
'  }' +
'  var statusEl = document.getElementById("epcStatus");' +
'  var selectEl = document.getElementById("epcAddressSelect");' +
'  var stripEl = document.getElementById("epcDataStrip");' +
'  statusEl.textContent = "Looking up...";' +
'  selectEl.style.display = "none";' +
'  stripEl.style.display = "none";' +
'  epcAddressRows = [];' +
'  epcData = null;' +
'  fetch(RESTLET_BASE_URL + "&action=getEpcData&postcode=" + encodeURIComponent(postcode), {' +
'    method: "GET",' +
'    headers: { "Content-Type": "application/json" }' +
'  })' +
'  .then(function(r) { return r.json(); })' +
'  .then(function(data) {' +
'    if (!data || !data.success) {' +
'      statusEl.textContent = "No EPC record found for this postcode. Please enter your property details manually.";' +
'      return;' +
'    }' +
'    if (!data.rows || data.rows.length === 0) {' +
'      statusEl.textContent = "No EPC certificates found for this postcode. Please enter details manually.";' +
'      return;' +
'    }' +
'    epcAddressRows = data.rows;' +
'    selectEl.innerHTML = "<option value=\\\"\\\">" + "-- Select your address --</option>";' +
'    data.rows.forEach(function(row, idx) {' +
'      var opt = document.createElement("option");' +
'      opt.value = idx;' +
'      opt.textContent = row.address + " (" + row.lodgementDate + ")";' +
'      selectEl.appendChild(opt);' +
'    });' +
'    selectEl.style.display = "inline-block";' +
'    statusEl.textContent = data.rows.length + " certificate(s) found.";' +
'  })' +
'  .catch(function(err) {' +
'    statusEl.textContent = "No EPC record found for this postcode. Please enter your property details manually.";' +
'  });' +
'};' +
'window.selectEpcAddress = function() {' +
'  var selectEl = document.getElementById("epcAddressSelect");' +
'  var idx = selectEl.value;' +
'  if (idx === "" || idx === null) return;' +
'  var row = epcAddressRows[parseInt(idx)];' +
'  if (!row) return;' +
'  var statusEl = document.getElementById("epcStatus");' +
'  statusEl.textContent = "Loading certificate...";' +
'  fetch(RESTLET_BASE_URL + "&action=getEpcData&lmkKey=" + encodeURIComponent(row.lmkKey), {' +
'    method: "GET",' +
'    headers: { "Content-Type": "application/json" }' +
'  })' +
'  .then(function(r) { return r.json(); })' +
'  .then(function(data) {' +
'    if (!data.success || !data.data) {' +
'      statusEl.textContent = "Could not load certificate. Please enter details manually.";' +
'      return;' +
'    }' +
'    epcData = data.data;' +
'    statusEl.textContent = "";' +
'    /* --- Pre-populate property type --- */' +
'    var pt = (epcData.propertyType || "").toLowerCase();' +
'    var ptMap = { "house": "house", "bungalow": "bungalow", "flat": "flat", "maisonette": "maisonette" };' +
'    var mappedPt = ptMap[pt] || null;' +
'    if (mappedPt) {' +
'      window.selectPropertyType(mappedPt);' +
'    }' +
'    /* --- Pre-populate project type --- */' +
'    window.selectProjectType("Renovation (Light Touch)");' +
'    window.autoCalcZones();' +
'    /* --- Update EPC data strip --- */' +
'    var rating = (epcData.currentEnergyRating || "").toLowerCase();' +
'    var ratingHtml = epcData.currentEnergyRating' +
'      ? "<span class=\\\"nh-epc-rating nh-epc-rating-" + rating + "\\\">" + epcData.currentEnergyRating + "</span>"' +
'      : "--";' +
'    document.getElementById("epcDisplayAddress").innerHTML = epcData.address || "--";' +
'    document.getElementById("epcDisplayPropertyType").innerHTML = (epcData.propertyType || "--") + (epcData.builtForm ? " \u2014 " + epcData.builtForm : "") + "<span class=\\\"nh-epc-badge\\\">From EPC</span>";' +
'    document.getElementById("epcDisplayFloorArea").innerHTML = epcData.totalFloorArea ? epcData.totalFloorArea + " m2" + "<span class=\\\"nh-epc-badge\\\">From EPC</span>" : "--";' +
'    document.getElementById("epcDisplayRating").innerHTML = ratingHtml;' +
'    document.getElementById("epcDisplayFloor").innerHTML = epcData.floorDescription || "--";' +
'    document.getElementById("epcDisplayConstruction").innerHTML = epcData.constructionAgeBand || "--";' +
'    document.getElementById("epcDataStrip").style.display = "flex";' +
'  })' +
'  .catch(function(err) {' +
'    document.getElementById("epcStatus").textContent = "Certificate load error. Please enter details manually.";' +
'  });' +
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
'    /* Floors start empty; property type selection populates them */' +
'    window.renderFloors();' +
'    window.selectProjectType(\'New Build\');' +
'    window.selectHeatSource(\'Boiler\');' +
'    window.selectThermostat(\'Wired Programmable\');' +
'})();' +
'</script>' +
'</body>' +
'</html>';
    }

    return {
        onRequest: onRequest
    };
});
