// ==UserScript==
// @name         MyJDownloader UnUglifier
// @name:de      MyJDownloader UnUglifier
// @namespace    https://github.com/xerexexe/myjdownloader-unuglifier
// @author       Holger Teichmann
// @license      MIT
// @homepageURL  https://github.com/xerexexe/myjdownloader-unuglifier
// @supportURL   https://github.com/xerexexe/myjdownloader-unuglifier/issues
// @updateURL    https://raw.githubusercontent.com/xerexexe/myjdownloader-unuglifier/main/myjdownloader-unuglifier.user.js
// @downloadURL  https://raw.githubusercontent.com/xerexexe/myjdownloader-unuglifier/main/myjdownloader-unuglifier.user.js
// @version      1.0.1
// @description  A cleaner MyJDownloader interface with light and dark themes, resizable columns, and easier-to-read download and extraction status.
// @description:de Eine übersichtlichere MyJDownloader-Oberfläche mit Hell- und Dunkelmodus, anpassbaren Spaltenbreiten und besser lesbaren Download- und Entpackanzeigen.
// @match        https://my.jdownloader.org/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

// Copyright (c) 2026 Holger Teichmann. Released under the MIT License.

(function boot() {
    'use strict';

    // Bei document-start kann selbst das HTML-Wurzelelement noch fehlen.
    if (!document.documentElement) {
        const observer = new MutationObserver(() => {
            if (!document.documentElement) return;
            observer.disconnect();
            boot();
        });
        observer.observe(document, { childList: true });
        return;
    }

    document.documentElement.dataset.mjdUserscriptVersion = '1.0.1';

    const THEME_KEY = 'mjd-layout-theme';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    let themePreference = readThemePreference();
    applyTheme();

    function readThemePreference() {
        try {
            const saved = localStorage.getItem(THEME_KEY);
            return ['light', 'dark', 'system'].includes(saved) ? saved : 'dark';
        } catch (_) {
            return 'dark';
        }
    }

    function applyTheme() {
        const resolved = themePreference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : themePreference;
        document.documentElement.dataset.mjdTheme = resolved;
        const toggle = document.getElementById('mjd-theme-toggle');
        if (toggle) {
            const isDark = resolved === 'dark';
            const label = isDark ? 'Zur hellen Ansicht wechseln' : 'Zur dunklen Ansicht wechseln';
            toggle.title = label;
            toggle.setAttribute('aria-label', label);
            toggle.setAttribute('aria-pressed', String(isDark));
            toggle.innerHTML = isDark
                ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
                : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14A8.6 8.6 0 0 1 10 3.5 8.7 8.7 0 1 0 20.5 14Z"/></svg>';
        }
    }

    systemTheme.addEventListener('change', () => {
        if (themePreference === 'system') applyTheme();
    });
    window.addEventListener('storage', event => {
        if (event.key === THEME_KEY) {
            themePreference = readThemePreference();
            applyTheme();
        }
    });

    GM_addStyle(`
        /* Nativer Startbildschirm: verschwindet mit dem Originalelement. */
        #gwtContent .mainLoadingSpinner {
            box-sizing: border-box !important;
            display: grid !important;
            place-items: center !important;
            gap: 20px !important;
            width: min(440px, 100%) !important;
            height: auto !important;
            min-height: 180px !important;
            margin: clamp(32px, 12vh, 110px) auto !important;
            padding: 32px 24px !important;
            color: var(--mjd-text) !important;
            background: var(--mjd-surface) !important;
            border: 1px solid var(--mjd-border) !important;
            border-radius: 14px !important;
            box-shadow: var(--mjd-shadow) !important;
            text-align: center !important;
            font: 500 14px/1.6 var(--mjd-font) !important;
        }
        #gwtContent .mainLoadingSpinner > div {
            display: none !important;
        }
        #gwtContent .mainLoadingSpinner::before {
            content: "";
            box-sizing: border-box;
            width: 42px;
            height: 42px;
            border: 3px solid var(--mjd-track);
            border-top-color: var(--mjd-accent);
            border-radius: 50%;
            animation: mjd-loader-turn 0.9s linear infinite;
        }
        #gwtContent .mainLoadingSpinner::after {
            content: "MyJDownloader wird geladen …";
            max-width: 100%;
            color: var(--mjd-text);
            overflow-wrap: anywhere;
        }
        #gwtContent .mainLoadingSpinner[hidden],
        #gwtContent .mainLoadingSpinner[style*="display: none"],
        #gwtContent .mainLoadingSpinner[style*="display:none"] {
            display: none !important;
        }
        @keyframes mjd-loader-turn {
            to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
            #gwtContent .mainLoadingSpinner::before {
                animation: none !important;
            }
        }

        :root {
            --mjd-bg: #edf6f7;
            --mjd-surface: rgba(255, 255, 255, 0.94);
            --mjd-surface-soft: #f5fafb;
            --mjd-border: #c7dde0;
            --mjd-border-strong: #9fc1c6;
            --mjd-text: #263b3e;
            --mjd-muted: #607b80;
            --mjd-accent: #e3a411;
            --mjd-accent-dark: #bd7e00;
            --mjd-teal: #174f56;
            --mjd-teal-2: #22646c;
            --mjd-success: #65b84b;
            --mjd-shadow: 0 8px 28px rgba(25, 73, 79, 0.13);
            --mjd-radius: 10px;
            --mjd-page: linear-gradient(145deg, #eef8f9, #e7f2f4 55%, #f5fafb);
            --mjd-hover: #ffffff;
            --mjd-selected: #dfeff1;
            --mjd-heading: #eef8f9;
            --mjd-track: #dcebed;
            --mjd-link: #174f56;
            --mjd-extract-row: #fffaf0;
            --mjd-extract-bg: #fff3d6;
            --mjd-extract-border: #efcf83;
            --mjd-extract-text: #8f5c00;
            --mjd-input: #ffffff;
            --mjd-success-text: #237d40;
            --mjd-error: #bd353f;
            --mjd-font: Inter, "Segoe UI", Roboto, Arial, sans-serif;
            color-scheme: light;
        }

        :root[data-mjd-theme="dark"] {
            --mjd-bg: #10191f;
            --mjd-page: linear-gradient(145deg, #10191f, #122128);
            --mjd-surface: #18262e;
            --mjd-surface-soft: #1d2e37;
            --mjd-border: #2c424d;
            --mjd-border-strong: #3f5c68;
            --mjd-text: #dfebee;
            --mjd-muted: #a0b6bf;
            --mjd-hover: #213640;
            --mjd-selected: #294652;
            --mjd-heading: #1a2c35;
            --mjd-track: #30454e;
            --mjd-link: #8cdbda;
            --mjd-teal: #102b33;
            --mjd-teal-2: #193c46;
            --mjd-accent: #efb934;
            --mjd-accent-dark: #f0bc49;
            --mjd-success: #79c667;
            --mjd-success-text: #9cdcaa;
            --mjd-error: #ff929b;
            --mjd-extract-row: #302c20;
            --mjd-extract-bg: #39311f;
            --mjd-extract-border: #786337;
            --mjd-extract-text: #f4cf79;
            --mjd-input: #132129;
            --mjd-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
            color-scheme: dark;
        }

        html,
        body {
            background: var(--mjd-page) fixed !important;
            color: var(--mjd-text) !important;
            font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif !important;
        }

        body {
            padding-bottom: 142px !important;
        }

        /* Einheitliche Seitenbreite */
        .contentContainer {
            box-sizing: border-box !important;
            width: calc(100% - 32px) !important;
            max-width: none !important;
            margin-inline: auto !important;
        }

        header {
            z-index: 100 !important;
            background: linear-gradient(90deg, var(--mjd-teal), var(--mjd-teal-2)) !important;
            box-shadow: 0 3px 14px rgba(10, 49, 54, 0.24) !important;
        }

        #mainnav,
        #mainnav > div,
        #mainnav .mainnav {
            width: auto !important;
            max-width: none !important;
        }

        .mainNavButton {
            transition: background-color 140ms ease, color 140ms ease !important;
        }

        .mainNavButton:hover,
        .mainNavButton.current {
            background-color: rgba(255, 255, 255, 0.10) !important;
        }

        /* Tabellenkopf: gleiche Spalten wie die Downloadzeilen */
        .listHeadingWrapper {
            box-sizing: border-box !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            z-index: 90 !important;
            overflow-x: auto !important;
            background: var(--mjd-heading) !important;
            backdrop-filter: blur(9px) !important;
            border-bottom: 1px solid var(--mjd-border-strong) !important;
            scrollbar-width: thin;
        }

        body:has(.downloadshub.current) .listHeader,
        body:has(.linkcollectorhub.current) .listHeader {
            box-sizing: border-box !important;
            display: grid !important;
            grid-template-columns:
                60px minmax(260px, 2.4fr) 110px 160px
                minmax(180px, 1.2fr) minmax(190px, 1fr) !important;
            align-items: center !important;
            width: 100% !important;
            min-width: 960px !important;
            padding-inline: 8px !important;
            background: transparent !important;
        }

        body:has(.downloadshub.current) .listHeader > div,
        body:has(.linkcollectorhub.current) .listHeader > div {
            box-sizing: border-box !important;
            float: none !important;
            width: auto !important;
            min-width: 0 !important;
            padding-inline: 10px !important;
        }

        body:has(.downloadshub.current) .listHeader > div > p,
        body:has(.linkcollectorhub.current) .listHeader > div > p {
            color: var(--mjd-muted) !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            letter-spacing: 0.055em !important;
            text-transform: uppercase !important;
        }

        body:has(.downloadshub.current) .listHeader > br,
        body:has(.linkcollectorhub.current) .listHeader > br,
        body:has(.downloadshub.current) .listRow > div:first-of-type > br,
        body:has(.linkcollectorhub.current) .listRow > div:first-of-type > br {
            display: none !important;
        }

        /* Downloadzeilen */
        body:has(.downloadshub.current) .listRow,
        body:has(.linkcollectorhub.current) .listRow {
            box-sizing: border-box !important;
            min-width: 960px !important;
            min-height: 58px !important;
            background: var(--mjd-surface) !important;
            border-bottom: 1px solid var(--mjd-border) !important;
            transition: background-color 130ms ease, box-shadow 130ms ease !important;
        }

        body:has(.downloadshub.current) .listRow:hover,
        body:has(.downloadshub.current) .listRow:focus-within,
        body:has(.linkcollectorhub.current) .listRow:hover,
        body:has(.linkcollectorhub.current) .listRow:focus-within {
            background: var(--mjd-hover) !important;
            box-shadow: inset 4px 0 0 var(--mjd-accent) !important;
        }

        body:has(.downloadshub.current) .listRow.rowSelected,
        body:has(.linkcollectorhub.current) .listRow.rowSelected {
            color: var(--mjd-text) !important;
            background: var(--mjd-selected) !important;
            box-shadow: inset 4px 0 0 var(--mjd-accent) !important;
        }

        body:has(.downloadshub.current) .listRow.rowSelected > div:first-of-type > div,
        body:has(.downloadshub.current) .listRow.rowSelected .gwt-InlineLabel,
        body:has(.downloadshub.current) .listRow.rowSelected .GHS0TFHL2,
        body:has(.linkcollectorhub.current) .listRow.rowSelected > div:first-of-type > div,
        body:has(.linkcollectorhub.current) .listRow.rowSelected .gwt-InlineLabel,
        body:has(.linkcollectorhub.current) .listRow.rowSelected .GHS0TFHL2 {
            color: var(--mjd-text) !important;
        }

        body:has(.downloadshub.current) .listRow > div:first-of-type,
        body:has(.linkcollectorhub.current) .listRow > div:first-of-type {
            box-sizing: border-box !important;
            display: grid !important;
            grid-template-columns:
                60px minmax(260px, 2.4fr) 110px 60px 100px
                minmax(180px, 1.2fr) minmax(154px, 1fr) 18px 18px !important;
            align-items: center !important;
            width: 100% !important;
            min-height: 48px !important;
            overflow: visible !important;
        }

        body:has(.downloadshub.current) .listRow > div:first-of-type > div,
        body:has(.linkcollectorhub.current) .listRow > div:first-of-type > div {
            box-sizing: border-box !important;
            float: none !important;
            width: auto !important;
            min-width: 0 !important;
            padding-inline: 8px !important;
        }

        body:has(.downloadshub.current) .listRow .gwt-InlineLabel,
        body:has(.downloadshub.current) .listRow .GHS0TFHL2,
        body:has(.linkcollectorhub.current) .listRow .gwt-InlineLabel,
        body:has(.linkcollectorhub.current) .listRow .GHS0TFHL2 {
            display: block !important;
            max-width: 100% !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }

        .expandButton {
            box-sizing: border-box !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            width: 44px !important;
            height: 30px !important;
            margin: 1px 0 !important;
            padding: 0 28px 0 6px !important;
            overflow: hidden !important;
            color: var(--mjd-link) !important;
            background-color: var(--mjd-surface-soft) !important;
            background-position: calc(100% - 3px) 50% !important;
            background-repeat: no-repeat !important;
            background-size: 24px 24px !important;
            border: 1px solid var(--mjd-border) !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: 800 !important;
            line-height: 1 !important;
            text-align: left !important;
            text-decoration: none !important;
            cursor: pointer !important;
            transition: background-color 140ms ease, border-color 140ms ease, transform 140ms ease !important;
        }

        .expandButton:hover {
            background-color: var(--mjd-hover) !important;
            border-color: var(--mjd-border-strong) !important;
            transform: translateY(-1px) !important;
        }

        .expandButton:focus-visible {
            outline: 2px solid var(--mjd-accent) !important;
            outline-offset: 2px !important;
        }

        /* Fortschritt und ETA bilden eine saubere, gemeinsame Komponente */
        .listRow .GHS0TFHM2,
        .listRow progress + .progressBarLabel {
            box-sizing: border-box !important;
        }

        body:has(.downloadshub.current) .listRow div:has(> progress):has(> .progressBarLabel) {
            box-sizing: border-box !important;
            display: grid !important;
            grid-template-columns: minmax(70px, 1fr) auto !important;
            grid-template-areas: "bar value" !important;
            align-items: center !important;
            gap: 2px 8px !important;
            width: 100% !important;
            height: auto !important;
            min-height: 18px !important;
            padding: 3px 0 !important;
            overflow: visible !important;
        }

        .listRow .GHS0TFHM2 {
            display: grid !important;
            grid-template-columns: minmax(70px, 1fr) auto !important;
            grid-template-areas:
                "bar value"
                "eta eta" !important;
            align-items: center !important;
            gap: 2px 8px !important;
            width: 100% !important;
            height: auto !important;
            min-height: 38px !important;
            padding: 3px 0 !important;
            overflow: visible !important;
        }

        .listRow .GHS0TFHM2 progress,
        .listRow progress {
            grid-area: bar !important;
            width: 100% !important;
            height: 10px !important;
            margin: 0 !important;
            overflow: hidden !important;
            border: 0 !important;
            border-radius: 999px !important;
            background: var(--mjd-track) !important;
        }

        .listRow progress::-webkit-progress-bar {
            background: var(--mjd-track) !important;
            border-radius: 999px !important;
        }

        .listRow progress::-webkit-progress-value {
            background: linear-gradient(90deg, #7fce61, var(--mjd-success)) !important;
            border-radius: 999px !important;
        }

        .progressBarLabel {
            grid-area: value !important;
            position: static !important;
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            color: var(--mjd-muted) !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            line-height: 1 !important;
            white-space: nowrap !important;
        }

        .eta-label {
            grid-area: eta !important;
            display: flex !important;
            align-items: center !important;
            min-width: 0 !important;
            margin: 0 !important;
            color: var(--mjd-accent-dark) !important;
            font-size: 11px !important;
            font-weight: 750 !important;
            line-height: 15px !important;
            letter-spacing: 0.015em !important;
            white-space: nowrap !important;
        }

        .eta-label::before {
            content: "ETA";
            margin-right: 6px;
            padding: 1px 5px;
            color: var(--mjd-input);
            background: var(--mjd-accent-dark);
            border-radius: 999px;
            font-size: 9px;
            line-height: 13px;
            letter-spacing: 0.06em;
        }

        .eta-label--extract {
            color: var(--mjd-extract-text) !important;
            font-variant-numeric: tabular-nums !important;
        }

        .eta-label--extract::before {
            content: "ENTPACKEN";
            background: linear-gradient(90deg, #c98300, var(--mjd-accent)) !important;
        }

        .eta-label--waiting {
            color: var(--mjd-muted) !important;
        }
        .eta-label--uncertain { color: var(--mjd-muted) !important; font-weight: 500 !important; }
        .eta-label--uncertain::before { content: "STATUS"; background: var(--mjd-track) !important; color: var(--mjd-muted) !important; }

        body:has(.downloadshub.current) .listRow:has(.eta-label--extract) {
            background: var(--mjd-extract-row) !important;
            box-shadow: inset 4px 0 0 var(--mjd-accent) !important;
        }

        body:has(.downloadshub.current) .listRow:has(.eta-label--extract) .GHS0TFHM2 {
            grid-template-columns: minmax(0, 1fr) !important;
            grid-template-areas: "eta" !important;
            min-height: 30px !important;
            padding: 0 !important;
        }

        body:has(.downloadshub.current) .listRow:has(.eta-label--extract) .GHS0TFHM2 > progress,
        body:has(.downloadshub.current) .listRow:has(.eta-label--extract) .GHS0TFHM2 > .progressBarLabel {
            display: none !important;
        }

        body:has(.downloadshub.current) .eta-label--extract {
            box-sizing: border-box !important;
            width: 100% !important;
            padding: 4px 7px !important;
            background: var(--mjd-extract-bg) !important;
            border: 1px solid var(--mjd-extract-border) !important;
            border-radius: 7px !important;
            line-height: 18px !important;
        }

        /* Linksammler: eigenes Raster und kompakte, relevante Statistik */
        body:has(.linkcollectorhub.current) .listHeader {
            grid-template-columns:
                60px minmax(280px, 2.4fr) minmax(170px, 0.8fr) 130px
                minmax(170px, 1.15fr) minmax(190px, 1fr) !important;
        }

        body:has(.linkcollectorhub.current) .listRow > div:first-of-type {
            grid-template-columns:
                60px minmax(280px, 2.4fr) minmax(170px, 0.8fr) 130px
                minmax(170px, 1.15fr) minmax(190px, 1fr) 18px 18px !important;
        }

        body:has(.linkcollectorhub.current) .downloadStats.statsWrapper {
            display: none !important;
        }

        body:has(.linkcollectorhub.current) .linkStats.statsWrapper {
            box-sizing: border-box !important;
            display: grid !important;
            grid-template-columns: repeat(6, minmax(105px, 1fr)) !important;
            align-content: center !important;
            gap: 5px 8px !important;
            width: auto !important;
            min-width: 0 !important;
            flex: 1 1 auto !important;
        }

        body:has(.linkcollectorhub.current) .footerbarActions {
            flex-basis: 250px !important;
            width: 250px !important;
        }

        body:has(.linkcollectorhub.current) .footerbarButtons {
            box-sizing: border-box !important;
            display: flex !important;
            justify-content: flex-end !important;
            gap: 8px !important;
            width: 100% !important;
            min-width: 0 !important;
        }

        .emptyListMessage {
            box-sizing: border-box !important;
            width: min(520px, calc(100% - 32px)) !important;
            margin: 42px auto !important;
            padding: 28px !important;
            color: var(--mjd-muted) !important;
            background: var(--mjd-surface) !important;
            border: 1px dashed var(--mjd-border-strong) !important;
            border-radius: var(--mjd-radius) !important;
            box-shadow: 0 5px 18px rgba(25, 73, 79, 0.08) !important;
            text-align: center !important;
        }

        /* Einstellungen: flexible Navigation und Formulare über die ganze Breite */
        .GHS0TFHMT {
            box-sizing: border-box !important;
            display: grid !important;
            grid-template-columns: 230px minmax(0, 1fr) !important;
            align-items: start !important;
            gap: 18px !important;
            width: 100% !important;
            padding: 18px 0 150px !important;
        }

        .GHS0TFHKT,
        .GHS0TFHHT {
            box-sizing: border-box !important;
            float: none !important;
            width: auto !important;
            min-width: 0 !important;
        }

        .GHS0TFHKT {
            position: sticky !important;
            top: 82px !important;
            max-height: calc(100vh - 140px) !important;
            padding: 10px !important;
            overflow-y: auto !important;
            background: var(--mjd-surface) !important;
            border: 1px solid var(--mjd-border) !important;
            border-radius: var(--mjd-radius) !important;
            box-shadow: var(--mjd-shadow) !important;
            scrollbar-width: thin !important;
        }

        .GHS0TFHKT a,
        .GHS0TFHKT .gwt-Label,
        .GHS0TFHKT .gwt-HTML {
            box-sizing: border-box !important;
            border-radius: 7px !important;
        }

        .GHS0TFHKT a:hover,
        .GHS0TFHKT .current {
            background: var(--mjd-selected) !important;
            color: var(--mjd-link) !important;
        }

        .GHS0TFHHT {
            padding: 0 2px !important;
        }

        .GHS0TFHC4,
        .GHS0TFHG3 {
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
        }

        .GHS0TFHG3 {
            overflow: hidden !important;
            background: var(--mjd-surface) !important;
            border: 1px solid var(--mjd-border) !important;
            border-radius: var(--mjd-radius) !important;
            box-shadow: var(--mjd-shadow) !important;
        }

        .GHS0TFHM3 {
            box-sizing: border-box !important;
            width: 100% !important;
            min-height: 52px !important;
            padding-block: 6px !important;
            background: transparent !important;
            border-bottom: 1px solid var(--mjd-border) !important;
            transition: background-color 130ms ease !important;
        }

        .GHS0TFHM3:hover,
        .GHS0TFHM3:focus-within {
            background: var(--mjd-surface-soft) !important;
        }

        .GHS0TFHM3 input,
        .GHS0TFHM3 select,
        .GHS0TFHM3 textarea,
        .GHS0TFHM3 button,
        .GHS0TFHM3 .gwt-TextBox,
        .GHS0TFHM3 .gwt-ListBox {
            box-sizing: border-box !important;
            max-width: 100% !important;
            border-radius: 7px !important;
        }

        /* Die Download-Statistik gehört nicht in die Einstellungsseiten. */
        body:has(.settingshub.current) {
            padding-bottom: 44px !important;
        }

        body:has(.settingshub.current) .listFooter,
        body:has(.settingshub.current) .listFooterBumper {
            display: none !important;
        }

        body:has(.settingshub.current) .GHS0TFHMT {
            padding-bottom: 58px !important;
        }

        body:has(.settingshub.current) .GHS0TFHHT > div,
        body:has(.settingshub.current) .GHS0TFHHT .GHS0TFHPT,
        body:has(.settingshub.current) .GHS0TFHHT .GHS0TFHAU,
        body:has(.settingshub.current) .GHS0TFHHT .listHeader,
        body:has(.settingshub.current) .GHS0TFHHT .listRow {
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
        }

        /* Untere Statusleiste */
        .listFooterBumper {
            height: 128px !important;
        }

        .listFooter {
            box-sizing: border-box !important;
            left: 16px !important;
            right: 16px !important;
            bottom: 42px !important;
            top: auto !important;
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            z-index: 80 !important;
        }

        .footerBar {
            box-sizing: border-box !important;
            width: 100% !important;
            min-height: 72px !important;
            padding: 8px 10px !important;
            background: var(--mjd-surface) !important;
            border: 1px solid var(--mjd-border-strong) !important;
            border-radius: var(--mjd-radius) !important;
            box-shadow: var(--mjd-shadow) !important;
            backdrop-filter: blur(10px) !important;
        }

        .downloadStats.statsWrapper {
            display: grid !important;
            grid-template-columns: repeat(4, minmax(145px, 1fr)) !important;
            align-content: center !important;
            gap: 4px 10px !important;
            width: auto !important;
            min-width: 0 !important;
        }

        .statsEntry {
            box-sizing: border-box !important;
            width: auto !important;
            min-width: 0 !important;
            padding: 3px 7px !important;
            border-radius: 6px !important;
            background: var(--mjd-surface-soft) !important;
        }

        .statsLabel,
        .statsValue {
            width: auto !important;
            min-width: 0 !important;
        }

        .statsLabel {
            flex: 1 1 auto !important;
            color: var(--mjd-muted) !important;
        }

        .statsValue {
            flex: 0 0 auto !important;
            color: var(--mjd-text) !important;
            font-variant-numeric: tabular-nums !important;
            text-align: right !important;
        }

        .footerbarActions {
            flex: 0 0 165px !important;
            width: 165px !important;
            padding-left: 12px !important;
        }

        .footerbarActions .gwt-Button {
            border-radius: 7px !important;
            box-shadow: 0 3px 9px rgba(189, 126, 0, 0.22) !important;
        }

        footer {
            z-index: 95 !important;
            height: 36px !important;
            background: var(--mjd-teal) !important;
            box-shadow: 0 -2px 10px rgba(10, 49, 54, 0.16) !important;
        }

        footer .contentContainer {
            display: flex !important;
            align-items: center !important;
            height: 100% !important;
        }

        /* 3.0: gemeinsame Farben und aktuelle, strukturell markierte Komponenten. */
        :root {
            --mjd-download-grid: 52px minmax(260px, 1.6fr) 105px 72px 24px minmax(220px, 1.1fr) minmax(220px, 1fr) 18px 18px;
            --mjd-link-grid: 52px minmax(260px, 1.6fr) minmax(180px, 1fr) 105px 72px minmax(160px, 0.8fr) 18px 18px;
        }

        #gwtContent, .container, .GHS0TFHMT, .GHS0TFHHT {
            color: var(--mjd-text) !important;
            background-color: transparent !important;
            background-image: none !important;
        }

        #gwtContent, #gwtContent input, #gwtContent select, #gwtContent textarea,
        #gwtContent button, .mainNavButton, .gwt-Button, #dropDownMenu,
        .gwt-PopupPanel, .gwt-DialogBox, .contextMenu, footer, footer a {
            font-family: var(--mjd-font) !important;
            text-shadow: none !important;
        }

        #gwtContent h1, .gwt-PopupPanel h1, .gwt-DialogBox h1 {
            color: var(--mjd-text) !important;
            font-family: var(--mjd-font) !important;
            font-size: 19px !important;
            letter-spacing: 0 !important;
            text-transform: none !important;
            line-height: 1.4 !important;
        }

        .mainNavButton { font-size: 12px !important; letter-spacing: 0.035em !important; }
        .mainNavButton.current { box-shadow: inset 0 -3px 0 var(--mjd-accent) !important; }

        #mjd-theme-control {
            display: flex !important;
            float: left !important;
            align-items: center !important;
            height: 70px !important;
            margin-left: 20px !important;
        }
        #mjd-theme-toggle {
            box-sizing: border-box !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 34px !important;
            height: 34px !important;
            padding: 6px !important;
            color: #f0c55b !important;
            background: transparent !important;
            border: 1px solid transparent !important;
            border-radius: 8px !important;
            cursor: pointer !important;
        }
        #mjd-theme-toggle:hover { background: #234c57 !important; border-color: #537a85 !important; }
        #mjd-theme-toggle svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        #mjd-theme-control.mjd-theme--floating { position: fixed !important; top: 16px !important; right: 22px !important; height: 34px !important; z-index: 140 !important; }
        #mainnav li:has(> .settingshub):has(> #mjd-theme-control) {
            display: flex !important;
            align-items: center !important;
        }
        #mjd-theme-control.mjd-theme--settings {
            display: inline-flex !important;
            position: static !important;
            float: none !important;
            height: auto !important;
            margin: 0 6px !important;
            flex: 0 0 auto !important;
            vertical-align: middle !important;
        }

        body:has(.downloadshub.current) .listHeader,
        body:has(.downloadshub.current) .listRow > div:first-of-type {
            grid-template-columns: var(--mjd-download-grid) !important;
        }
        body:has(.linkcollectorhub.current) .listHeader,
        body:has(.linkcollectorhub.current) .listRow > div:first-of-type {
            grid-template-columns: var(--mjd-link-grid) !important;
        }
        body:has(.downloadshub.current) .listHeader > div:nth-of-type(5) { grid-column: 5 / 7 !important; }
        body:has(.downloadshub.current) .listHeader > div:nth-of-type(6) { grid-column: 7 / 10 !important; }
        body:has(.linkcollectorhub.current) .listHeader > div:nth-of-type(6) { grid-column: 6 / 9 !important; }

        body:has(.downloadshub.current) .listHeader,
        body:has(.linkcollectorhub.current) .listHeader {
            min-width: 1010px !important;
            padding-inline: 6px !important;
            border: 0 !important;
            box-shadow: none !important;
        }
        /* GWT blendet die Überschrift bei einer Auswahl absichtlich aus. */
        body:has(.downloadshub.current) .listHeader[style*="display: none"],
        body:has(.downloadshub.current) .listHeader[aria-hidden="true"],
        body:has(.linkcollectorhub.current) .listHeader[style*="display: none"],
        body:has(.linkcollectorhub.current) .listHeader[aria-hidden="true"] { display: none !important; }
        .selectionHeader {
            box-sizing: border-box !important;
            width: 100% !important;
            min-height: 32px !important;
            background: var(--mjd-selected) !important;
            color: var(--mjd-text) !important;
            border: 0 !important;
            box-shadow: none !important;
        }
        .selectionHeader p, .selectionHeader a { color: var(--mjd-text) !important; }
        .selectionHeader a:hover { color: var(--mjd-link) !important; }
        .selectionHeader > div:last-of-type { float: right !important; }
        .selectionHeader a[title="Auswahl aufheben"]:empty { display: inline-flex !important; align-items: center !important; justify-content: center !important; min-width: 28px !important; min-height: 26px !important; vertical-align: middle !important; }
        .selectionHeader a[title="Auswahl aufheben"]:empty::before { content: "×"; font-size: 18px; line-height: 1; }
        .listHeadingWrapper {
            background-image: none !important;
            top: var(--mjd-header-height, 72px) !important;
            margin-top: 0 !important;
            margin-left: 0 !important;
        }

        body:has(.downloadshub.current) .listRow,
        body:has(.linkcollectorhub.current) .listRow {
            min-width: 1010px !important;
            min-height: 54px !important;
            padding: 5px 6px !important;
            margin-top: 0 !important;
            border-top: 0 !important;
            font-weight: 400 !important;
            line-height: 30px !important;
            color: var(--mjd-text) !important;
            text-shadow: none !important;
        }
        body:has(.downloadshub.current) .listRow > div:first-of-type,
        body:has(.linkcollectorhub.current) .listRow > div:first-of-type { min-height: 42px !important; }
        .listRow .mjd-row-shell > div[style*="clear"] { display: none !important; }
        .listRow.mjd-row--package .mjd-cell-name { font-weight: 600 !important; }
        body:has(.downloadshub.current) .listRow.mjd-row--child,
        body:has(.linkcollectorhub.current) .listRow.mjd-row--child {
            min-height: 44px !important;
            background: var(--mjd-surface-soft) !important;
        }
        .listRow.mjd-row--child .mjd-row-shell { min-height: 34px !important; }
        .listRow .mjd-cell-name { display: flex !important; align-items: center !important; gap: 7px !important; }
        .listRow .mjd-cell-name > img { flex: 0 0 16px !important; width: 16px !important; height: 16px !important; }
        .listRow .mjd-cell-name > span { min-width: 0 !important; }
        .listRow .mjd-cell-status { min-width: 0 !important; color: var(--mjd-text) !important; }
        .listRow .mjd-cell-status > div { overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }
        .listRow .mjd-status-short { font-size: 0 !important; }
        .listRow .mjd-status-short::before {
            content: attr(data-mjd-status);
            font-size: 12px;
            font-weight: 600;
            color: var(--mjd-muted);
        }
        .listRow[data-mjd-state="extracted"] .mjd-status-short::before { color: var(--mjd-success-text); }
        .listRow[data-mjd-state="error"] .mjd-cell-status { color: var(--mjd-error) !important; }
        body:has(.downloadshub.current) .listRow.mjd-row--child.rowSelected,
        body:has(.linkcollectorhub.current) .listRow.mjd-row--child.rowSelected { background: var(--mjd-selected) !important; }
        .listRow.listRowDisabled, .listRow.listRowDisabled .expandButton {
            color: var(--mjd-muted) !important;
            text-shadow: none !important;
            opacity: 0.65;
        }

        /* Auch Datei-Unterzeilen nutzen dasselbe Fortschrittslayout. */
        body:has(.downloadshub.current) .listRow .mjd-progress {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            grid-template-areas: "bar value" !important;
            min-height: 26px !important;
            height: auto !important;
            padding: 2px 0 !important;
            gap: 3px 8px !important;
            overflow: visible !important;
        }
        body:has(.downloadshub.current) .listRow .mjd-progress:has(.eta-label) {
            grid-template-areas: "bar value" "eta eta" !important;
        }
        body:has(.downloadshub.current) .listRow .mjd-progress:has(.eta-label--extract) {
            grid-template-columns: minmax(0, 1fr) !important;
            grid-template-areas: "eta" !important;
        }
        .eta-label { white-space: normal !important; font-variant-numeric: tabular-nums; }
        .eta-label::before { flex-shrink: 0; }
        .eta-label--extract::before { color: #182027 !important; }

        /* Formulare, Datentabellen, Dropdowns und Dialoge in beiden Themes. */
        #gwtContent a:not(.gwt-Button):not(.expandButton), .gwt-PopupPanel a { color: var(--mjd-link) !important; }
        #gwtContent input:not([type="checkbox"]):not([type="radio"]):not([role="presentation"]),
        #gwtContent select, #gwtContent textarea,
        .gwt-PopupPanel input:not([type="checkbox"]):not([type="radio"]):not([role="presentation"]), .gwt-PopupPanel select, .gwt-PopupPanel textarea,
        .gwt-DialogBox input:not([type="checkbox"]):not([type="radio"]):not([role="presentation"]), .gwt-DialogBox select, .gwt-DialogBox textarea {
            box-sizing: border-box !important;
            color: var(--mjd-text) !important;
            background: var(--mjd-input) !important;
            border: 1px solid var(--mjd-border-strong) !important;
            border-radius: 7px !important;
            padding: 7px 9px !important;
            min-height: 32px !important;
            max-width: 100% !important;
            font: 13px var(--mjd-font) !important;
            box-shadow: none !important;
        }
        input::placeholder, textarea::placeholder { color: var(--mjd-muted) !important; opacity: 1 !important; }
        input[type="checkbox"], input[type="radio"] { accent-color: var(--mjd-accent); }
        input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible, a:focus-visible {
            outline: 2px solid var(--mjd-accent) !important;
            outline-offset: 2px !important;
        }
        .gwt-Button {
            background: var(--mjd-accent) !important;
            color: #27301f !important;
            border: 1px solid transparent !important;
            border-radius: 7px !important;
            font: 600 12px var(--mjd-font) !important;
            line-height: 20px !important;
            text-shadow: none !important;
        }
        .gwt-Button:hover { filter: brightness(1.08); }
        .gwt-Button[disabled] { opacity: 0.5; cursor: default; }
        body:has(.settingshub.current) .GHS0TFHMT { padding-top: 14px !important; overflow: visible !important; }
        body:has(.settingshub.current) .GHS0TFHHT .listHeadingWrapper {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 58px !important;
            margin: 0 0 12px !important;
            padding: 12px 16px !important;
            border: 1px solid var(--mjd-border) !important;
            border-radius: 10px !important;
            overflow: visible !important;
        }
        body:has(.settingshub.current) .GHS0TFHHT .listHeadingBumper { display: none !important; }
        .GHS0TFHHT h1 { margin: 0 0 12px !important; }
        .GHS0TFHHT .listHeadingWrapper h1 { margin: 0 !important; }
        .GHS0TFHKT a {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            min-height: 42px !important;
            padding: 7px 9px !important;
            text-align: left !important;
            text-decoration: none !important;
            color: var(--mjd-text) !important;
        }
        .GHS0TFHKT a > br { display: none !important; }
        .GHS0TFHKT a > img { width: 24px !important; height: 24px !important; margin: 0 !important; }
        .GHS0TFHKT a.GHS0TFHDT { background: var(--mjd-selected) !important; font-weight: 650 !important; }
        .GHS0TFHKT .GHS0TFHJT { color: var(--mjd-muted) !important; border-color: var(--mjd-border) !important; }
        .GHS0TFHM3 { padding-inline: 12px !important; }
        .GHS0TFHHT table { color: var(--mjd-text) !important; border-color: var(--mjd-border) !important; }
        .GHS0TFHHT th {
            background: var(--mjd-heading) !important;
            color: var(--mjd-muted) !important;
            border-color: var(--mjd-border) !important;
            text-shadow: none !important;
            padding: 9px 12px !important;
        }
        .GHS0TFHHT td {
            color: var(--mjd-text) !important;
            background: var(--mjd-surface) !important;
            border-color: var(--mjd-border) !important;
            padding: 9px 12px !important;
            overflow-wrap: anywhere !important;
        }
        .GHS0TFHHT tr:nth-child(even) td { background: var(--mjd-surface-soft) !important; }
        .GHS0TFHHT td:hover { background: var(--mjd-hover) !important; }
        .GHS0TFHHT small { color: var(--mjd-muted) !important; line-height: 1.5 !important; }
        #dropDownMenu, .mainnavMobileDropDownContent, .contextMenu, .gwt-PopupPanel, .gwt-DialogBox {
            background: var(--mjd-surface) !important;
            color: var(--mjd-text) !important;
            border: 1px solid var(--mjd-border-strong) !important;
            border-radius: 10px !important;
            box-shadow: var(--mjd-shadow) !important;
            background-image: none !important;
        }
        #dropDownMenu .dropDownButton, .contextMenu a, .gwt-MenuItem, .gwt-PopupPanel .gwt-Label {
            color: var(--mjd-text) !important;
            background: transparent !important;
            text-shadow: none !important;
        }
        #dropDownMenu .dropDownButton:hover, .contextMenu a:hover, .gwt-MenuItem-selected {
            background: var(--mjd-selected) !important;
            color: var(--mjd-link) !important;
        }
        .gwt-PopupPanel :is(p, span, label, h2, h3, td), .gwt-DialogBox :is(p, span, label, h2, h3, td) { color: var(--mjd-text) !important; }
        .gwt-PopupPanel :is(table, td, .dialogContent), .gwt-DialogBox :is(table, td, .dialogContent) { background: var(--mjd-surface) !important; }
        .gwt-PopupPanelGlass { background: #050b0f !important; }
        footer, footer a { color: #c6d9df !important; font-size: 10px !important; }
        footer .contentContainer { gap: 10px !important; }

        /* 3.1: Dashboard und echte GWT-Dialoge, nicht nur deren äußere Hülle. */
        body:has(.dashboardContainer), body:has(#mainContainer) { padding-bottom: 56px !important; }
        .dashboardContainer.row {
            display: grid !important;
            grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr) !important;
            gap: 22px !important;
            width: 100% !important;
            max-width: 1360px !important;
            margin: 0 auto !important;
            padding: 26px 20px !important;
            box-sizing: border-box !important;
        }
        .dashboardContainer > div:empty, .dashboardContainer > .clearfix { display: none !important; }
        .dashboardContainer :is(.jdownloaderIconsContainer, .servicesContainerWrapper) {
            width: auto !important; min-width: 0 !important; float: none !important;
        }
        .dashboardContainer .notification.info {
            box-sizing: border-box !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            color: var(--mjd-text) !important;
            background: var(--mjd-surface) !important;
            background-image: none !important;
            border: 1px solid var(--mjd-border) !important;
            border-radius: 12px !important;
            box-shadow: var(--mjd-shadow) !important;
        }
        .dashboardContainer :is(h1, p, a, .title, .titleElementContainer) {
            color: var(--mjd-text) !important; font-family: var(--mjd-font) !important; text-shadow: none !important;
        }
        .dashboardContainer h1 { font-size: 20px !important; line-height: 1.5 !important; margin: 0 0 16px !important; }
        .dashboardContainer h1 > img { width: 32px !important; height: 32px !important; margin-right: 10px !important; vertical-align: middle !important; }
        .jdownloaderHeaderContainer { display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 8px 20px !important; }
        .jdownloaderHeaderActions { width: auto !important; height: auto !important; float: none !important; margin: 0 0 16px !important; line-height: 1.7 !important; }
        .dashboardContainer a, .jdownloaderHeaderActions a { color: var(--mjd-link) !important; }
        .dashboardContainer p { line-height: 1.7 !important; }
        #gwtContent .dashboardContainer h1 { text-transform: none !important; }
        #gwtContent .dashboardContainer .jdownloaderIcons { display: flex !important; flex-wrap: wrap !important; justify-content: flex-start !important; width: 100% !important; gap: 14px !important; margin: 18px 0 0 !important; }
        #gwtContent .dashboardContainer .jdownloaderIconWrapper { width: auto !important; height: auto !important; margin: 0 !important; padding: 0 !important; background: transparent !important; float: none !important; }
        .dashboardContainer .serviceIcon {
            box-sizing: border-box !important;
            display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important;
            width: 220px !important; max-width: 100% !important; min-height: 170px !important; height: auto !important;
            padding: 16px !important; gap: 12px !important; overflow: visible !important;
            background: var(--mjd-surface-soft) !important; border: 1px solid var(--mjd-border) !important; border-radius: 10px !important;
        }
        .dashboardContainer .serviceIcon:hover { background: var(--mjd-hover) !important; border-color: var(--mjd-link) !important; }
        .dashboardContainer .titleElementContainer { width: 100% !important; height: auto !important; overflow: visible !important; text-align: center !important; }
        #gwtContent .dashboardContainer .titleElementContainer a { display: block !important; width: 100% !important; font: 600 13px/1.5 var(--mjd-font) !important; letter-spacing: 0 !important; text-transform: none !important; white-space: normal !important; overflow-wrap: anywhere !important; }
        .dashboardContainer .services { margin: 18px 0 0 !important; padding: 0 !important; list-style: none !important; }
        .dashboardContainer .serviceEntry { box-sizing: border-box !important; width: 100% !important; height: auto !important; padding: 14px !important; margin: 0 !important; background: var(--mjd-selected) !important; border-radius: 8px !important; }
        .dashboardContainer .appsDecoContainer { margin: 18px 0 !important; }
        #mainContainer :is(.bg-gray-50, .bg-gray-100, .bg-gray-200), .modal :is(.bg-gray-50, .bg-gray-100, .bg-yellow-200) {
            background-color: var(--mjd-surface) !important; color: var(--mjd-text) !important; border-color: var(--mjd-border) !important;
        }
        #mainContainer :is(.bg-yellow-300, .bg-yellow-500) { background: var(--mjd-accent) !important; color: #27301f !important; }
        #mainContainer :is(.text-gray-500, .text-gray-600, .text-gray-700, .text-gray-800) { color: var(--mjd-muted) !important; }
        #mainContainer a { color: var(--mjd-link); }

        body:has(.settingshub.current) .GHS0TFHHT :is(.GHS0TFHPT, .listHeadingWrapper) {
            position: relative !important; top: auto !important; left: auto !important; right: auto !important;
            width: 100% !important; height: auto !important; min-height: 58px !important;
            margin: 0 0 12px !important; padding: 12px 16px !important;
            background: var(--mjd-heading) !important; background-image: none !important;
            border: 1px solid var(--mjd-border) !important; border-radius: 10px !important;
        }
        body:has(.settingshub.current) .GHS0TFHHT .listHeadingBumper { display: none !important; }
        body:has(.settingshub.current) .GHS0TFHHT .listHeader {
            background: var(--mjd-heading) !important; color: var(--mjd-muted) !important;
            border-color: var(--mjd-border) !important; background-image: none !important; text-shadow: none !important;
        }
        body:has(.settingshub.current) .GHS0TFHHT .listHeader p { color: var(--mjd-muted) !important; }
        body:has(.settingshub.current) .GHS0TFHHT .listRow { background: var(--mjd-surface) !important; color: var(--mjd-text) !important; border-color: var(--mjd-border) !important; }
        body:has(.settingshub.current) .GHS0TFHHT .listRow.rowSelected { background: var(--mjd-selected) !important; }
        .GHS0TFHHT hr { border: 0 !important; border-top: 1px solid var(--mjd-border) !important; }
        .GHS0TFHHT table { width: 100% !important; table-layout: fixed !important; }
        .GHS0TFHHT td > div { max-width: 100% !important; white-space: normal !important; overflow-wrap: anywhere !important; }
        .GHS0TFHHT :is(input, textarea, select) { max-width: 100% !important; }
        .GHS0TFHHT textarea { width: 100% !important; min-height: 100px !important; resize: vertical !important; }
        .listFooter { background: transparent !important; background-image: none !important; border: 0 !important; box-shadow: none !important; }
        .mjd-row-shell > .mjd-cell-size { display: flex !important; align-items: center !important; gap: 5px !important; white-space: nowrap !important; }
        .mjd-cell-size > :is(span, div) { width: auto !important; float: none !important; white-space: nowrap !important; }

        .gwt-PopupPanelGlass { z-index: 1000 !important; opacity: 0.7 !important; }
        .gwt-PopupPanel, .gwt-DialogBox { z-index: 1010 !important; }
        .gwt-PopupPanel:has(.GHS0TFHLI) {
            box-sizing: border-box !important; position: fixed !important; left: 50% !important; top: 50% !important;
            transform: translate(-50%, -50%) !important; width: min(720px, calc(100vw - 32px)) !important;
            max-height: calc(100vh - 32px) !important; overflow: auto !important; padding: 0 !important;
        }
        .gwt-PopupPanel:has(.GHS0TFHLI) .popupContent, .gwt-PopupPanel .GHS0TFHLI { width: 100% !important; box-sizing: border-box !important; padding: 0 !important; margin: 0 !important; }
        .gwt-PopupPanel .GHS0TFHLI > div { width: 100% !important; min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important; padding: 24px !important; }
        .gwt-PopupPanel .GHS0TFHLI table { width: 100% !important; }
        .gwt-PopupPanel .GHS0TFHC1 table { width: 100% !important; }
        .gwt-PopupPanel .GHS0TFHC1 :is(input:not([role="presentation"]), select) { width: 100% !important; }
        .gwt-PopupPanel :is(.popupContent, .GHS0TFHLI, .dialogContent, .dialogMiddleCenter),
        .gwt-DialogBox :is(.dialogContent, .dialogMiddleCenter) {
            background: var(--mjd-surface) !important; background-image: none !important; color: var(--mjd-text) !important;
        }
        .gwt-PopupPanel :is(div, p, span, label, h1, h2, h3, b, strong, small, td, th, li),
        .gwt-DialogBox :is(div, p, span, label, h1, h2, h3, b, strong, small, td, th, li) {
            color: var(--mjd-text) !important; font-family: var(--mjd-font) !important; text-shadow: none !important;
        }
        .gwt-PopupPanel :is(.gwt-Button, button) { color: #27301f !important; }
        .gwt-PopupPanel :is([style*="color: red"], [style*="color:red"], .error),
        .gwt-DialogBox :is([style*="color: red"], [style*="color:red"], .error) { color: var(--mjd-error) !important; }
        .gwt-PopupPanel :is(input[type="checkbox"], input[type="radio"]),
        .gwt-DialogBox :is(input[type="checkbox"], input[type="radio"]) { display: inline-block !important; width: auto !important; min-height: 0 !important; padding: 0 !important; margin: 0 !important; vertical-align: middle !important; }
        .gwt-PopupPanel .gwt-CheckBox, .gwt-DialogBox .gwt-CheckBox { display: inline-flex !important; align-items: center !important; gap: 6px !important; margin: 5px 12px 5px 0 !important; vertical-align: middle !important; white-space: normal !important; }
        .gwt-PopupPanel .gwt-CheckBox label, .gwt-DialogBox .gwt-CheckBox label { margin: 0 !important; font-size: 12px !important; cursor: pointer !important; }
        .gwt-PopupPanel :is(h1, h2), .gwt-DialogBox :is(h1, h2) { text-transform: none !important; }
        input[role="presentation"] { width: 1px !important; height: 1px !important; min-height: 0 !important; padding: 0 !important; border: 0 !important; background: transparent !important; margin: 0 !important; }
        .gwt-PopupPanel:has(.GHS0TFHJ0) {
            box-sizing: border-box !important; position: fixed !important; left: 50% !important; top: 50% !important;
            transform: translate(-50%, -50%) !important; width: min(720px, calc(100vw - 32px)) !important;
            max-height: calc(100vh - 32px) !important; overflow: auto !important; padding: 0 !important;
        }
        .gwt-PopupPanel:has(.GHS0TFHJ0) :is(.popupContent, .GHS0TFHLI) { width: 100% !important; margin: 0 !important; padding: 0 !important; border: 0 !important; box-sizing: border-box !important; }
        .gwt-PopupPanel .GHS0TFHJ0 { box-sizing: border-box !important; width: 100% !important; min-width: 0 !important; padding: 24px !important; }
        .gwt-PopupPanel .GHS0TFHJ0 table { table-layout: fixed !important; width: 100% !important; }
        .gwt-PopupPanel .GHS0TFHJ0 tr > td:first-child:not([colspan]) { width: 44px !important; }
        .gwt-PopupPanel .GHS0TFHJ0 :is(input:not([type="checkbox"]):not([type="radio"]):not([role="presentation"]), textarea, select) { width: 100% !important; margin-left: 0 !important; }
        .gwt-PopupPanel .GHS0TFHJ0 textarea { min-height: 120px !important; resize: vertical !important; }
        .gwt-PopupPanel .GHS0TFHJ0 h2 { font-size: 14px !important; line-height: 1.5 !important; margin: 16px 0 8px !important; }
        .gwt-PopupPanel .GHS0TFHJ0 hr { border: 0 !important; border-top: 1px solid var(--mjd-border) !important; }
        .gwt-PopupPanel .GHS0TFHE0 { display: flex !important; flex-wrap: wrap !important; align-items: center !important; justify-content: flex-end !important; gap: 10px !important; }
        .gwt-PopupPanel .GHS0TFHE0 > span { margin-right: auto !important; }
        .gwt-PopupPanel .GHS0TFHE0 > br { display: none !important; }
        .gwt-PopupPanel .GHS0TFHKI { position: absolute !important; right: 10px !important; top: 10px !important; cursor: pointer !important; }
        .gwt-PopupPanel:has(.GHS0TFHK4) { position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; width: min(600px, calc(100vw - 32px)) !important; padding: 0 !important; max-height: calc(100vh - 32px) !important; overflow: auto !important; }
        .gwt-PopupPanel:has(.GHS0TFHK4) :is(.popupContent, .GHS0TFHLI) { width: 100% !important; padding: 0 !important; margin: 0 !important; box-sizing: border-box !important; }
        .gwt-PopupPanel .GHS0TFHK4 { width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; padding: 24px !important; }
        .gwt-PopupPanel .GHS0TFHK4 input:not([role="presentation"]) { width: 100% !important; margin-block: 16px !important; }
        .gwt-PopupPanel .GHS0TFHJ4 { display: flex !important; justify-content: flex-end !important; gap: 10px !important; }
        .gwt-SuggestBoxPopup :is(.suggestPopupTop, .suggestPopupBottom, .suggestPopupMiddleLeft, .suggestPopupMiddleRight),
        .gwt-DecoratedPopupPanel :is(.popupTop, .popupBottom, .popupMiddleLeft, .popupMiddleRight) { background: transparent !important; background-image: none !important; }
        .gwt-MenuBar, .gwt-SuggestBoxPopup .item { background: var(--mjd-surface) !important; color: var(--mjd-text) !important; }
        .gwt-SuggestBoxPopup .item-selected { background: var(--mjd-selected) !important; color: var(--mjd-link) !important; }
        .GHS0TFHDY { background: var(--mjd-surface) !important; color: var(--mjd-text) !important; border: 1px solid var(--mjd-border-strong) !important; border-radius: 8px !important; box-shadow: var(--mjd-shadow) !important; z-index: 1020 !important; }
        .GHS0TFHDY .item { background: var(--mjd-surface) !important; color: var(--mjd-text) !important; font: 13px var(--mjd-font) !important; }
        .GHS0TFHDY .item-selected { background: var(--mjd-selected) !important; color: var(--mjd-link) !important; }
        .GHS0TFHDY :is(.suggestPopupTop, .suggestPopupBottom, .suggestPopupMiddleLeft, .suggestPopupMiddleRight) { background: transparent !important; background-image: none !important; }
        @media (max-width: 760px) {
            .dashboardContainer.row { grid-template-columns: minmax(0, 1fr) !important; padding: 16px 0 !important; }
            .dashboardContainer .notification.info { padding: 18px !important; }
            .GHS0TFHM3 > div { width: 100% !important; float: none !important; }
            .GHS0TFHM3 > div:first-child, .GHS0TFHM3 > div:nth-child(3) { display: none !important; }
            .gwt-PopupPanel .GHS0TFHJ0 { padding: 18px !important; }
            .gwt-PopupPanel .GHS0TFHJ0 tr > td:first-child:not([colspan]) { width: 28px !important; }
        }

        @media (max-width: 1100px) {
            #mjd-theme-control { margin-left: 8px !important; }
        }
        @media (max-width: 900px) {
            #mjd-theme-control {
                position: fixed !important;
                float: none !important;
                bottom: 3px !important;
                right: 12px !important;
                height: 30px !important;
                z-index: 120 !important;
                margin: 0 !important;
            }
            #mjd-theme-toggle { width: 28px !important; height: 28px !important; padding: 4px !important; }
            footer .contentContainer { padding-right: 44px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
            .listRow, .expandButton, .mainNavButton { transition: none !important; }
        }

        @media (max-width: 1180px) {
            .downloadStats.statsWrapper {
                grid-template-columns: repeat(2, minmax(145px, 1fr)) !important;
            }

            .footerBar {
                min-height: 96px !important;
            }

            .listFooterBumper {
                height: 150px !important;
            }

            body:has(.linkcollectorhub.current) .linkStats.statsWrapper {
                grid-template-columns: repeat(3, minmax(105px, 1fr)) !important;
            }
        }

        @media (max-width: 760px) {
            .contentContainer {
                width: calc(100% - 16px) !important;
            }

            .listHeadingWrapper,
            .listFooter {
                left: 8px !important;
                right: 8px !important;
            }

            .downloadStats.statsWrapper {
                grid-template-columns: 1fr !important;
            }

            .footerbarActions {
                flex-basis: 150px !important;
                width: 150px !important;
            }

            .GHS0TFHMT {
                grid-template-columns: 1fr !important;
            }

            .GHS0TFHKT {
                position: static !important;
                max-height: none !important;
            }

            body:has(.linkcollectorhub.current) .linkStats.statsWrapper {
                grid-template-columns: repeat(2, minmax(100px, 1fr)) !important;
            }

            body:has(.linkcollectorhub.current) .footerbarActions {
                flex-basis: 180px !important;
                width: 180px !important;
            }
        }
    `);

    const ETA_PATTERN = /(?:\bETA\b|Restzeit|verbleib(?:end|ende\s+Zeit)?|remaining(?:\s+time)?|time\s+left)\s*[:=\-–]?\s*([0-9][^|)\]\n]*)/i;
    const EXTRACT_PATTERN = /(?:\bextracting\b|\bextraction\s*[:\-]?\s*(?:in\s*progress|running|active)\b|\bentpacken\b|\bentpackung\s*(?:läuft|aktiv)\b)/i;
    const EXTRACT_FINISHED_PATTERN = /(?:extract(?:ing|ion)\s*[:\-]?\s*(?:ok|finished|complete(?:d)?|successful|failed|error)|\bextracted\b|\bentpackt\b|entpack\w*\s*(?:ok|fertig|abgeschlossen|erfolgreich|fehlgeschlagen|fehler))/i;
    const EXTRACTION_CACHE_KEY = 'mjd-active-extractions-v1';
    const rowTimers = new WeakMap();
    const activeExtractions = loadExtractionMemory();
    let scheduledFrame = 0;

    function ensureThemeControl() {
        const settings = document.querySelector('#mainnav .settingshub');
        const controls = settings || document.getElementById('gwtControlButtonWrapper');
        const existing = document.getElementById('mjd-theme-control');
        if (existing) {
            existing.classList.toggle('mjd-theme--settings', Boolean(settings));
            if (controls?.parentElement && (existing.parentElement !== controls.parentElement || existing.previousElementSibling !== controls)) {
                controls.after(existing);
                existing.classList.remove('mjd-theme--floating');
            } else if (!controls?.parentElement && existing.parentElement !== document.body) {
                existing.classList.add('mjd-theme--floating');
                document.body.appendChild(existing);
            }
            return;
        }
        const wrapper = document.createElement('div');
        wrapper.id = 'mjd-theme-control';
        wrapper.classList.toggle('mjd-theme--settings', Boolean(settings));
        const toggle = document.createElement('button');
        toggle.id = 'mjd-theme-toggle';
        toggle.type = 'button';
        toggle.addEventListener('click', () => {
            themePreference = document.documentElement.dataset.mjdTheme === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem(THEME_KEY, themePreference); } catch (_) { /* Ohne Speicher bleibt die Auswahl für diesen Tab aktiv. */ }
            applyTheme();
        });
        wrapper.appendChild(toggle);
        if (controls?.parentElement) controls.after(wrapper);
        else {
            wrapper.classList.add('mjd-theme--floating');
            document.body.appendChild(wrapper);
        }
        applyTheme();
    }

    function decorateRows() {
        if (!document.querySelector('.downloadshub.current, .linkcollectorhub.current')) return;
        for (const row of document.querySelectorAll('.listRow:not(.listLoadMoreAnchor)')) {
            const columns = getRowColumns(row);
            if (columns.length < 6) continue;
            const isPackage = Boolean(row.querySelector('.expandButton'));
            row.classList.toggle('mjd-row--package', isPackage);
            row.classList.toggle('mjd-row--child', !isPackage);
            columns[0].parentElement.classList.add('mjd-row-shell');
            columns[1].classList.add('mjd-cell-name');
            columns[document.querySelector('.downloadshub.current') ? 2 : 3]?.classList.add('mjd-cell-size');
            if (!document.querySelector('.downloadshub.current')) continue;
            columns[5].classList.add('mjd-cell-status');
            const nativeStatus = columns[5].firstElementChild;
            const status = collectStatus(row);
            const state = status.extracting ? 'extracting'
                : /(?:extraction\s*(?:ok|successful|complete(?:d)?)|erfolgreich\s*entpackt)/i.test(status.statusText) ? 'extracted'
                : /(?:error|failed|fehler|fehlgeschlagen)/i.test(status.statusText) ? 'error'
                : /^\s*(?:finished|fertig)\s*(?:\||$)/i.test(status.statusText) ? 'finished'
                : 'other';
            if (row.dataset.mjdState !== state) row.dataset.mjdState = state;
            if (nativeStatus) {
                const shortText = state === 'extracted' ? 'Entpackt' : state === 'finished' ? 'Download fertig' : '';
                nativeStatus.classList.toggle('mjd-status-short', Boolean(shortText));
                if (nativeStatus.dataset.mjdStatus !== shortText) nativeStatus.dataset.mjdStatus = shortText;
            }
            findProgressContainer(row)?.classList.add('mjd-progress');
        }
    }

    function syncChromeGeometry() {
        const header = document.querySelector('header');
        const height = header?.getBoundingClientRect().bottom;
        if (!Number.isFinite(height) || height < 0 || height > 240) return;
        const roundedHeight = `${Math.ceil(height)}px`;
        if (document.documentElement.style.getPropertyValue('--mjd-header-height') !== roundedHeight) {
            document.documentElement.style.setProperty('--mjd-header-height', roundedHeight);
        }
        if (!document.querySelector('.downloadshub.current, .linkcollectorhub.current')) return;
        const heading = document.querySelector('#gwtContent .listHeadingWrapper');
        const bumper = document.querySelector('#gwtContent .listHeadingBumper');
        if (!heading || !bumper) return;
        const desired = Math.max(0, Math.ceil(height + heading.getBoundingClientRect().height
            - bumper.getBoundingClientRect().top - window.scrollY));
        if (bumper.style.height !== `${desired}px`) bumper.style.setProperty('height', `${desired}px`, 'important');
    }

    function loadExtractionMemory() {
        try {
            const saved = JSON.parse(sessionStorage.getItem(EXTRACTION_CACHE_KEY) || '[]');
            const now = Date.now();
            return new Map(saved
                .filter(([, value]) => value?.expires > now)
                .map(([key, value]) => [key, {
                    ...value,
                    startedAt: Number.isFinite(value.startedAt) ? value.startedAt : now
                }]));
        } catch (_) {
            return new Map();
        }
    }

    function saveExtractionMemory() {
        try {
            sessionStorage.setItem(EXTRACTION_CACHE_KEY, JSON.stringify(Array.from(activeExtractions.entries())));
        } catch (_) {
            // Die Anzeige funktioniert auch, wenn der Browser Session Storage blockiert.
        }
    }

    function cleanEta(value) {
        return value.trim().replace(/^[~<>\s]+/, '').replace(/[.,;\s]+$/, '');
    }

    function parseDuration(value) {
        if (!value) return null;
        const normalized = value.toLowerCase().replace(/,/g, '.');
        const units = [
            { re: /(\d+(?:\.\d+)?)\s*(?:d|tag(?:e|en)?)(?!\w)/i, factor: 86400 },
            { re: /(\d+(?:\.\d+)?)\s*(?:h|std\.?|stunde(?:n)?)(?!\w)/i, factor: 3600 },
            { re: /(\d+(?:\.\d+)?)\s*(?:m|min\.?|minute(?:n)?)(?!\w)/i, factor: 60 },
            { re: /(\d+(?:\.\d+)?)\s*(?:s|sek\.?|sekunde(?:n)?)(?!\w)/i, factor: 1 }
        ];
        let seconds = 0;
        let foundUnit = false;

        for (const unit of units) {
            const match = normalized.match(unit.re);
            if (!match) continue;
            seconds += Number(match[1]) * unit.factor;
            foundUnit = true;
        }

        if (foundUnit) return Math.max(0, Math.round(seconds));

        const colonValue = normalized.match(/\b(\d{1,3}(?::\d{1,2}){1,3})\b/)?.[1];
        if (colonValue) {
            const parts = colonValue.split(':').map(Number);
            if (parts.every(Number.isFinite)) {
                const factors = parts.length === 4 ? [86400, 3600, 60, 1]
                    : parts.length === 3 ? [3600, 60, 1]
                    : [60, 1];
                return parts.reduce((sum, part, index) => sum + part * factors[index], 0);
            }
        }

        return /^\d+$/.test(normalized.trim()) ? Number(normalized.trim()) : null;
    }

    function formatDuration(totalSeconds) {
        const total = Math.max(0, Math.round(totalSeconds));
        const days = Math.floor(total / 86400);
        const hours = Math.floor((total % 86400) / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        const seconds = total % 60;
        const parts = [];

        if (days) parts.push(`${days} T`);
        if (hours || days) parts.push(`${hours} Std`);
        if (minutes || hours || days) parts.push(`${String(minutes).padStart(hours || days ? 2 : 1, '0')} Min`);
        if (!days) parts.push(`${String(seconds).padStart(2, '0')} Sek`);
        return parts.join(' ') || '0 Sek';
    }

    function updateTimer(timer, parsedSeconds, rawEta, extracting) {
        const now = Date.now();

        if (!timer || timer.extracting !== extracting) {
            return {
                raw: rawEta,
                extracting,
                deadline: now + parsedSeconds * 1000
            };
        }

        if (timer.raw === rawEta) return timer;

        const current = Math.max(0, (timer.deadline - now) / 1000);
        let corrected = parsedSeconds;

        if (extracting) {
            const difference = parsedSeconds - current;
            const largeDownwardCorrection = difference < -Math.max(90, current * 0.45);

            if (largeDownwardCorrection) {
                // Anfangs meldet JDownloader gelegentlich Stunden statt Minuten.
                corrected = parsedSeconds;
            } else if (difference < 0) {
                // Sinkende Werte dürfen sich zügig, aber ohne sichtbare Sprünge annähern.
                corrected = current + difference * 0.65;
            } else {
                // Kurzzeitige Geschwindigkeitsabfälle lassen die native ETA stark hochspringen.
                corrected = current + Math.min(difference * 0.20, 20);
            }
        }

        timer.raw = rawEta;
        timer.deadline = now + Math.max(0, corrected) * 1000;
        return timer;
    }

    function collectStatus(row) {
        const columns = getRowColumns(row);
        // Datei- und Paketnamen dürfen nicht als Entpackstatus interpretiert werden.
        const statusCells = [columns[4], columns[5], columns[6]].filter(Boolean);
        const sources = statusCells.flatMap(cell => Array.from(cell.querySelectorAll('[title]:not(.eta-label)')))
            .map(element => element.getAttribute('title') || '')
            .filter(Boolean);
        const statusText = [columns[5]?.textContent || '', ...sources].join(' | ');
        let rawEta = null;

        for (const source of [statusText, ...sources]) {
            const match = source.match(ETA_PATTERN);
            if (match) {
                rawEta = cleanEta(match[1]);
                break;
            }
        }

        // Die neue WebUI zeigt Download-ETA als zweite Zeile statt im Tooltip.
        if (!rawEta && /\bdownload\b/i.test(sources.join(' ')) && !EXTRACT_PATTERN.test(statusText)) {
            const statusElement = columns[5]?.firstElementChild;
            const lines = Array.from(statusElement?.childNodes || [])
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .filter(Boolean);
            const duration = lines.find(text => /^(?:\d+\s*(?:d|h|m|min|s|sek|std)\s*:?\s*)+$/i.test(text));
            if (duration) rawEta = duration;
        }

        return {
            extracting: EXTRACT_PATTERN.test(statusText) && !EXTRACT_FINISHED_PATTERN.test(statusText),
            extractionFinished: EXTRACT_FINISHED_PATTERN.test(statusText),
            rawEta,
            statusText
        };
    }

    function getRowColumns(row) {
        const shell = Array.from(row.children).find(element => element.tagName === 'DIV');
        return shell ? Array.from(shell.children).filter(element => element.tagName === 'DIV') : [];
    }

    function getRowName(row) {
        return (getRowColumns(row)[1]?.textContent || '').trim();
    }

    function removeEtaFromRow(row) {
        row.querySelector('.eta-label')?.remove();
        rowTimers.delete(row);
    }

    function groupDownloadRows() {
        const groups = [];
        let currentGroup = null;

        for (const row of document.querySelectorAll('.listRow:not(.listLoadMoreAnchor)')) {
            const isPackage = Boolean(row.querySelector('.expandButton'));

            if (isPackage || !currentGroup) {
                currentGroup = { packageRow: row, childRows: [] };
                groups.push(currentGroup);
            } else {
                currentGroup.childRows.push(row);
            }
        }

        return groups;
    }

    function rememberExtraction(packageKey, status) {
        const parsedSeconds = parseDuration(status.rawEta);
        const lifetime = parsedSeconds === null
            ? 60 * 60 * 1000
            : Math.min(4 * 60 * 60 * 1000, Math.max(30 * 60 * 1000, parsedSeconds * 2000));
        const previous = activeExtractions.get(packageKey);

        activeExtractions.set(packageKey, {
            rawEta: status.rawEta,
            partCount: status.partCount,
            startedAt: Number.isFinite(previous?.startedAt)
                ? previous.startedAt
                : (Number.isFinite(status.startedAt) ? status.startedAt : Date.now()),
            expires: Date.now() + lifetime
        });
        saveExtractionMemory();
    }

    function forgetExtraction(packageKey) {
        if (!activeExtractions.delete(packageKey)) return;
        saveExtractionMemory();
    }

    function findProgressContainer(row) {
        return row.querySelector('.GHS0TFHM2') || row.querySelector('progress')?.parentElement || null;
    }

    function syncEtaForRow(row, statusOverride) {
        const status = statusOverride || collectStatus(row);
        const progressContainer = findProgressContainer(row);
        let label = row.querySelector('.eta-label');

        // Bei eingeklappten Paketen bestätigt die WebUI den Archivstatus oft nicht.
        // Ein alter Cache-Eintrag ist kein Beleg für einen aktuell laufenden Vorgang.
        if (status.uncertain && progressContainer) {
            if (!label) {
                label = document.createElement('div');
                label.setAttribute('aria-live', 'polite');
                progressContainer.appendChild(label);
            }
            label.className = 'eta-label eta-label--uncertain';
            const message = 'Status prüfen · Paket aufklappen';
            if (label.textContent !== message) label.textContent = message;
            label.title = 'Zuletzt wurde ein Entpackvorgang beobachtet. Das eingeklappte Paket liefert aktuell keine Bestätigung. Bitte aufklappen, um den Status zu prüfen.';
            rowTimers.delete(row);
            return;
        }
        label?.classList.remove('eta-label--uncertain');

        if ((!status.rawEta && !status.extracting) || !progressContainer) {
            label?.remove();
            rowTimers.delete(row);
            return;
        }

        if (status.extracting) {
            if (row.dataset.mjdState !== 'extracting') row.dataset.mjdState = 'extracting';
            const nativeStatus = getRowColumns(row)[5]?.firstElementChild;
            if (nativeStatus && row.querySelector('.expandButton')) {
                nativeStatus.classList.add('mjd-status-short');
                if (nativeStatus.dataset.mjdStatus !== 'Entpacken') nativeStatus.dataset.mjdStatus = 'Entpacken';
            }
        }

        if (!label) {
            label = document.createElement('div');
            label.className = 'eta-label';
            label.setAttribute('aria-live', 'polite');
            progressContainer.appendChild(label);
        }

        const parsedSeconds = parseDuration(status.rawEta);
        let timer = rowTimers.get(row);

        if (parsedSeconds !== null) {
            timer = updateTimer(timer, parsedSeconds, status.rawEta, status.extracting);
            rowTimers.set(row, timer);

            const remaining = Math.max(0, Math.ceil((timer.deadline - Date.now()) / 1000));
            var formattedTime = remaining ? formatDuration(remaining) : null;
            var etaDisplayText = formattedTime
                ? `${status.extracting ? 'ca. ' : ''}${formattedTime}`
                : 'Abschluss wird geprüft …';
            if (label.textContent !== etaDisplayText) label.textContent = etaDisplayText;
            label.title = `Verbleibende Zeit: ${etaDisplayText}`;
            label.classList.toggle('eta-label--waiting', remaining === 0);
        } else {
            rowTimers.delete(row);
            const startedAt = Number.isFinite(status.startedAt) ? status.startedAt : Date.now();
            const elapsed = formatDuration((Date.now() - startedAt) / 1000);
            const fallback = status.rawEta || [
                status.partCount ? `${status.partCount} ${status.partCount === 1 ? 'Teil' : 'Teile'}` : null,
                `läuft seit ${elapsed}`
            ].filter(Boolean).join(' · ');
            if (label.textContent !== fallback) label.textContent = fallback;
            label.title = status.rawEta
                ? status.statusText.trim()
                : 'JDownloader liefert für diesen Entpackvorgang keine Restzeit. Angezeigt wird deshalb die bisherige Laufzeit.';
            label.classList.toggle('eta-label--waiting', false);
        }

        label.classList.toggle('eta-label--extract', status.extracting);
    }

    function syncAllEtas() {
        if (!document.querySelector('.downloadshub.current')) {
            document.querySelectorAll('.eta-label').forEach(label => label.remove());
            return;
        }

        for (const group of groupDownloadRows()) {
            const packageStatus = collectStatus(group.packageRow);
            const childStatuses = group.childRows.map(row => ({ row, status: collectStatus(row) }));
            const extractingChildren = childStatuses.filter(item => item.status.extracting);
            const packageKey = getRowName(group.packageRow) || `package-${Array.from(document.querySelectorAll('.listRow')).indexOf(group.packageRow)}`;
            const remembered = activeExtractions.get(packageKey);
            const rememberedIsValid = remembered?.expires > Date.now();

            if (packageStatus.extractionFinished || /\b(?:error|failed|fehler|fehlgeschlagen)\b/i.test(packageStatus.statusText)) {
                forgetExtraction(packageKey);
                syncEtaForRow(group.packageRow, { ...packageStatus, extracting: false, rawEta: null });
                group.childRows.forEach(removeEtaFromRow);
                continue;
            }

            if (packageStatus.extracting || extractingChildren.length) {
                const etaSource = [packageStatus, ...extractingChildren.map(item => item.status)]
                    .find(status => status.rawEta);
                const aggregateStatus = {
                    extracting: true,
                    extractionFinished: false,
                    rawEta: etaSource?.rawEta || null,
                    partCount: extractingChildren.length || group.childRows.length || 1,
                    startedAt: Number.isFinite(remembered?.startedAt) ? remembered.startedAt : Date.now(),
                    statusText: `Entpacken läuft (${extractingChildren.length || group.childRows.length || 1} Archivteile)`
                };

                rememberExtraction(packageKey, aggregateStatus);
                syncEtaForRow(group.packageRow, aggregateStatus);
                group.childRows.forEach(removeEtaFromRow);
                continue;
            }

            if (group.childRows.length && rememberedIsValid) {
                // Aufgeklappt und kein Teil mehr aktiv: der Entpackvorgang ist beendet.
                forgetExtraction(packageKey);
            }

            const currentMemory = activeExtractions.get(packageKey);
            if (!group.childRows.length && currentMemory?.expires > Date.now() && !packageStatus.extractionFinished) {
                syncEtaForRow(group.packageRow, {
                    extracting: false,
                    uncertain: true,
                    extractionFinished: false,
                    rawEta: null,
                    partCount: currentMemory.partCount || 1,
                    startedAt: currentMemory.startedAt,
                    statusText: 'Entpacken läuft – Paket ist eingeklappt'
                });
                continue;
            }

            syncEtaForRow(group.packageRow, packageStatus);
            childStatuses.forEach(item => syncEtaForRow(item.row, item.status));
        }
    }

    function scheduleSync() {
        if (scheduledFrame) return;
        scheduledFrame = requestAnimationFrame(() => {
            scheduledFrame = 0;
            ensureThemeControl();
            decorateRows();
            syncAllEtas();
            syncChromeGeometry();
        });
    }

    function start() {
        ensureThemeControl();
        decorateRows();
        syncAllEtas();
        syncChromeGeometry();

        const observer = new MutationObserver(mutations => {
            const onlyOwnChanges = mutations.every(mutation => {
                const target = mutation.target.nodeType === Node.ELEMENT_NODE
                    ? mutation.target
                    : mutation.target.parentElement;
                return target?.closest?.('.eta-label, #mjd-theme-control')
                    || target?.classList?.contains('listHeadingBumper');
            });
            if (onlyOwnChanges) return;
            scheduleSync();
        });
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['title', 'style']
        });

        // Der Sekundentakt hält die Restzeit flüssig, auch wenn GWT stockend aktualisiert.
        window.setInterval(scheduleSync, 1000);
        window.addEventListener('resize', scheduleSync, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
    // Flexible Spalten und klare Schrift – am Ende des vorhandenen Scripts einfügen.
    (function installFlexibleColumns() {
        const root = document.documentElement;
        if (!root) {
            const wait = new MutationObserver(() => {
                if (!document.documentElement) return;
                wait.disconnect(); installFlexibleColumns();
            });
            wait.observe(document, { childList: true });
            return;
        }
        if (root.dataset.mjdFlexibleColumns === '1') return;
        root.dataset.mjdFlexibleColumns = '1';

        const storageKey = 'mjd-column-widths-v2';
        const layouts = {
            downloads: { minimum: [52, 160, 128, 76, 140, 156], weights: [6, 0, 0.2, 1.4, 2.4] },
            links: { minimum: [52, 140, 120, 128, 76, 140], weights: [5, 2.5, 0, 0.2, 1.3] }
        };
        const tableMinimum = { downloads: 0, links: 0 };
        const preferences = readPreferences();
        const watched = new WeakSet();
        const scrollBound = new WeakSet();
        let current = null;
        let drag = null;
        let pending = false;
        function scheduleSync() {
            if (pending) return;
            pending = true;
            requestAnimationFrame(() => { pending = false; updateFlexibleLayout(); });
        }
        const resizeObserver = typeof ResizeObserver === 'function'
            ? new ResizeObserver(() => scheduleSync()) : null;

        GM_addStyle(`
            header { height: auto !important; }
            header .navbarStatic { height: auto !important; min-height: 70px !important; display: flow-root !important; }
            header #logo { max-width: 100% !important; background-size: contain !important; background-position: left center !important; }
            #mainnav > ul, #mainnav .mainnav > ul {
                display: flex !important; flex-wrap: wrap !important; justify-content: flex-end !important;
                float: none !important; padding: 0 !important; margin: 0 !important;
            }
            #mainnav .mainnav > ul { flex-direction: row-reverse !important; }
            #mainnav > ul > li, #mainnav .mainnav > ul > li { float: none !important; }
            html[data-mjd-theme="dark"] body,
            html[data-mjd-theme="dark"] body *,
            html[data-mjd-theme="dark"] body *::before,
            html[data-mjd-theme="dark"] body *::after {
                text-shadow: none !important;
            }
            body:has(.downloadshub.current), body:has(.linkcollectorhub.current) {
                padding-bottom: calc(var(--mjd-native-footer-height, 36px) + 12px) !important;
            }
            body:has(.downloadshub.current) :is(.listHeader, .listRow),
            body:has(.linkcollectorhub.current) :is(.listHeader, .listRow) {
                box-sizing: border-box !important;
                min-width: 0 !important;
                width: var(--mjd-table-width, 100%) !important;
            }
            body:has(.downloadshub.current) .listHeadingWrapper,
            body:has(.linkcollectorhub.current) .listHeadingWrapper {
                left: var(--mjd-table-left, 16px) !important;
                right: var(--mjd-table-right, 16px) !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
                scrollbar-width: none !important;
            }
            /* Lesbarer Tabellenkopf statt einer nur 17px hohen Textzeile.
               Höhe bleibt automatisch, damit umgebrochene Titel Platz haben.
               Die vorhandene Geometrie-Synchronisierung misst diesen Container
               und hält Liste, Auswahlleiste und Spaltengriffe darunter frei. */
            body:has(.downloadshub.current) #gwtContent .listHeadingWrapper,
            body:has(.linkcollectorhub.current) #gwtContent .listHeadingWrapper {
                height: auto !important;
                min-height: 40px !important;
                max-height: none !important;
            }
            body:has(.downloadshub.current) #gwtContent .listHeader,
            body:has(.linkcollectorhub.current) #gwtContent .listHeader {
                height: auto !important;
                min-height: 40px !important;
                max-height: none !important;
                align-items: stretch !important;
                padding-block: 0 !important;
            }
            body:has(.downloadshub.current) #gwtContent .listHeader > div,
            body:has(.linkcollectorhub.current) #gwtContent .listHeader > div {
                display: flex !important;
                align-items: center !important;
                height: auto !important;
                min-height: 40px !important;
                padding-block: 8px !important;
            }
            body:has(.downloadshub.current) #gwtContent .listHeader > div > p,
            body:has(.linkcollectorhub.current) #gwtContent .listHeader > div > p {
                margin: 0 !important;
                font-size: 13px !important;
                line-height: 20px !important;
                letter-spacing: 0.035em !important;
            }
            body:has(.downloadshub.current) #gwtContent .selectionHeader,
            body:has(.linkcollectorhub.current) #gwtContent .selectionHeader {
                height: auto !important;
                min-height: 40px !important;
                padding-block: 4px !important;
                line-height: 24px !important;
            }
            .listHeadingWrapper::-webkit-scrollbar { display: none; }
            .mjd-table-scroll {
                box-sizing: border-box !important;
                min-width: 0 !important;
                max-width: 100% !important;
                max-height: var(--mjd-list-viewport-height, 70vh) !important;
                overflow: auto !important;
                overscroll-behavior: contain;
                scrollbar-width: thin;
                scrollbar-color: var(--mjd-border-strong) var(--mjd-surface-soft);
            }
            .listRow .mjd-cell-size { gap: 5px !important; padding-inline: 6px !important; }
            #gwtContent .eta-label--extract { flex-wrap: wrap !important; gap: 2px 4px !important; }
            #gwtContent .listRow .mjd-cell-size > :is(div, span) {
                flex: 0 0 auto !important;
                max-width: none !important;
                overflow: visible !important;
                text-overflow: clip !important;
            }
            #gwtContent .listRow .mjd-cell-name,
            #gwtContent .listRow .mjd-cell-status {
                height: auto !important; max-height: none !important; overflow: visible !important;
            }
            #gwtContent .listRow .mjd-cell-name > span,
            #gwtContent .listRow .mjd-cell-status > div,
            body:has(.linkcollectorhub.current) #gwtContent .mjd-row-shell > div:nth-of-type(3),
            body:has(.linkcollectorhub.current) #gwtContent .mjd-row-shell > div:nth-of-type(3) * {
                white-space: normal !important; overflow-wrap: anywhere !important;
                overflow: visible !important; text-overflow: clip !important;
                line-height: 1.5 !important; height: auto !important; max-height: none !important;
            }
            #gwtContent .listRow .mjd-cell-size > :is(div, span) { line-height: 1.5 !important; }
            #gwtContent .listRow .mjd-status-short::before { line-height: 1.5 !important; }
            #gwtContent .listRow { height: auto !important; max-height: none !important; }
            #gwtContent .mjd-row-shell { height: auto !important; max-height: none !important; padding-block: 5px !important; }
            .mjd-row-shell > div:first-of-type { padding-inline: 4px !important; }
            body:has(.downloadshub.current) .mjd-row-shell > div:nth-of-type(5) {
                padding-inline: 2px !important;
                text-align: center !important;
            }
            body:has(.downloadshub.current) .mjd-row-shell > div:nth-of-type(n+8),
            body:has(.linkcollectorhub.current) .mjd-row-shell > div:nth-of-type(n+7) {
                padding-inline: 0 !important;
            }
            .listHeader > div { position: relative !important; overflow: visible !important; }
            .listHeader > div > p {
                overflow: visible !important;
                white-space: normal !important;
                text-overflow: clip !important;
                line-height: 1.5 !important;
                padding-right: 6px !important;
            }
            .mjd-col-resize {
                display: block !important;
                position: absolute !important;
                top: 0 !important;
                bottom: 0 !important;
                right: -6px !important;
                width: 12px !important;
                z-index: 5;
                cursor: col-resize !important;
                touch-action: none;
                user-select: none;
            }
            .mjd-col-resize::before {
                content: "";
                position: absolute;
                left: 5px;
                top: 20%;
                bottom: 20%;
                width: 2px;
                border-radius: 2px;
                background: var(--mjd-muted);
            }
            .mjd-col-resize:hover::before, .mjd-col-resize:focus-visible::before {
                background: var(--mjd-accent);
                width: 3px;
            }
            body.mjd-column-dragging, body.mjd-column-dragging * {
                cursor: col-resize !important;
                user-select: none !important;
            }
            body:has(.downloadshub.current) .listFooter,
            body:has(.linkcollectorhub.current) .listFooter {
                bottom: calc(var(--mjd-native-footer-height, 36px) + 6px) !important;
                max-height: min(210px, 32dvh) !important;
                overflow: auto !important;
            }
            body:has(.downloadshub.current) .listFooterBumper,
            body:has(.linkcollectorhub.current) .listFooterBumper {
                height: calc(var(--mjd-stats-height, 82px) + 12px) !important;
            }
            .footerBar { display: flex !important; align-items: center !important; gap: 10px !important; min-height: 0 !important; }
            body:has(.downloadshub.current) .downloadStats.statsWrapper,
            body:has(.linkcollectorhub.current) .linkStats.statsWrapper {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(min(185px, 100%), 1fr)) !important;
                flex: 1 1 0 !important;
                gap: 4px 8px !important;
            }
            .statsEntry { display: flex !important; align-items: center !important; gap: 6px !important; font-size: 12px !important; }
            .statsLabel { overflow: visible !important; white-space: normal !important; line-height: 1.5 !important; }
            .statsLabel b { font-weight: 600 !important; }
            .footerbarActions { flex: 0 0 auto !important; width: auto !important; padding-left: 0 !important; }
            footer { height: auto !important; min-height: 36px !important; }
            footer .contentContainer { flex-wrap: wrap !important; gap: 2px 12px !important; padding-block: 4px !important; box-sizing: border-box !important; }
            footer :is(#footerLinks, #copyright) { min-width: 0 !important; line-height: 14px !important; }
            footer #copyright { margin-left: auto !important; }
            .GHS0TFHKT { top: calc(var(--mjd-header-height, 72px) + 12px) !important; max-height: calc(100dvh - var(--mjd-header-height, 72px) - var(--mjd-native-footer-height, 36px) - 24px) !important; }
            @media (max-width: 700px) {
                .footerBar { flex-wrap: wrap !important; gap: 6px !important; }
                body:has(.downloadshub.current) .downloadStats.statsWrapper,
                body:has(.linkcollectorhub.current) .linkStats.statsWrapper {
                    flex-basis: 100% !important;
                    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
                .footerbarActions { margin-left: auto !important; }
                .statsEntry { font-size: 11px !important; padding-inline: 4px !important; }
            }
            @media (max-width: 1100px) {
                #mainnav { clear: both !important; float: none !important; width: 100% !important; }
                #mainnav .mainNavButton { height: 42px !important; line-height: 42px !important; padding-block: 0 !important; }
                #mainnav .mainNavButton > img { margin-top: 12px !important; }
            }
            @media (max-height: 650px) {
                body:has(.downloadshub.current) .listRow,
                body:has(.linkcollectorhub.current) .listRow { min-height: 42px !important; padding-block: 3px !important; }
                body:has(.downloadshub.current) .listRow > div:first-of-type,
                body:has(.linkcollectorhub.current) .listRow > div:first-of-type { min-height: 34px !important; }
                .footerBar { padding-block: 5px !important; }
            }
        `);

        function normalizeWeights(value, fallback) {
            if (!Array.isArray(value) || value.length !== 5 ||
                value.some(n => !Number.isFinite(n) || n < 0)) return fallback.slice();
            const total = value.reduce((sum, n) => sum + n, 0);
            return Number.isFinite(total) && total > 0
                ? value.map(n => n / total) : fallback.slice();
        }

        function readPreferences() {
            try {
                const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
                for (const mode of Object.keys(layouts)) {
                    const width = saved?.[mode]?.tableMinimum;
                    tableMinimum[mode] = Number.isFinite(width) && width >= 0 && width <= 20000 ? width : 0;
                }
                return Object.fromEntries(Object.entries(layouts).map(([mode, config]) =>
                    [mode, normalizeWeights(saved?.[mode]?.weights, config.weights)]));
            } catch (_) {
                return Object.fromEntries(Object.entries(layouts).map(([mode, config]) => [mode, config.weights.slice()]));
            }
        }

        function savePreferences() {
            try { localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(
                Object.keys(layouts).map(mode => [mode, { weights: preferences[mode], tableMinimum: tableMinimum[mode] }])
            ))); } catch (_) {}
        }

        function fitColumns(available, config, weights) {
            const minimumTotal = config.minimum.reduce((sum, n) => sum + n, 0);
            const extra = Math.max(0, available - minimumTotal);
            const normalized = normalizeWeights(weights, config.weights);
            const weightTotal = normalized.reduce((sum, n) => sum + n, 0);
            return config.minimum.map((minimum, index) => index === 0
                ? minimum : minimum + extra * normalized[index - 1] / weightTotal);
        }

        function moveBoundary(widths, minimum, index, delta) {
            const result = widths.slice();
            if (delta < 0) {
                const allowed = Math.max(delta, minimum[index] - widths[index]);
                result[index] += allowed;
                result[index + 1 < result.length ? index + 1 : index - 1] -= allowed;
            } else {
                const capacity = widths.slice(index + 1).reduce((sum, width, offset) =>
                    sum + Math.max(0, width - minimum[index + 1 + offset]), 0);
                const growth = Math.min(delta, Math.max(0, 3000 - widths[index]));
                let remaining = Math.min(growth, capacity);
                result[index] += growth;
                for (let column = index + 1; column < result.length && remaining > 0; column++) {
                    const take = Math.min(remaining, Math.max(0, result[column] - minimum[column]));
                    result[column] -= take;
                    remaining -= take;
                }
            }
            return result;
        }

        function weightsFromWidths(widths, config) {
            return normalizeWeights(widths.slice(1).map((n, index) =>
                Math.max(0, n - config.minimum[index + 1])), config.weights);
        }

        function rememberWidths(widths) {
            const total = widths.reduce((sum, n) => sum + n, 0);
            tableMinimum[current.mode] = total > current.available + 1 ? total : 0;
            preferences[current.mode] = weightsFromWidths(widths, layouts[current.mode]);
            renderColumns(widths);
        }

        function setVariable(name, value) {
            if (root.style.getPropertyValue(name) !== value) root.style.setProperty(name, value);
        }

        function watch(element) {
            if (element && resizeObserver && !watched.has(element)) {
                watched.add(element);
                resizeObserver.observe(element);
            }
        }

        function renderColumns(widths) {
            if (!current) return;
            current.widths = widths;
            const [control, name, third, fourth, fifth, sixth] = widths;
            const tracks = current.mode === 'downloads'
                ? [control, name, third, fourth, 24, fifth - 24, sixth - 36, 18, 18]
                : [control, name, third, fourth, fifth, sixth - 36, 18, 18];
            setVariable(current.mode === 'downloads' ? '--mjd-download-grid' : '--mjd-link-grid',
                tracks.map(n => `${n.toFixed(2)}px`).join(' '));
            setVariable('--mjd-table-width', `${(widths.reduce((sum, n) => sum + n, 0) + 12).toFixed(2)}px`);
            current.heading.querySelectorAll('.mjd-col-resize').forEach(handle => {
                const index = Number(handle.dataset.column);
                handle.setAttribute('aria-valuenow', String(Math.round(widths[index])));
                handle.setAttribute('aria-valuemin', String(layouts[current.mode].minimum[index]));
                handle.setAttribute('aria-valuemax', String(Math.round(Math.max(3000, widths[index]))));
            });
        }

        function resetColumns(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!current) return;
            preferences[current.mode] = layouts[current.mode].weights.slice();
            tableMinimum[current.mode] = 0;
            savePreferences();
            updateFlexibleLayout();
        }

        function finishDrag(cancelled) {
            if (!drag) return;
            const previous = drag;
            drag = null;
            previous.controller.abort();
            document.body.classList.remove('mjd-column-dragging');
            if (cancelled) {
                preferences[previous.mode] = previous.originalWeights;
                tableMinimum[previous.mode] = previous.originalMinimum;
            }
            else savePreferences();
            try { previous.handle.releasePointerCapture(previous.pointerId); } catch (_) {}
            updateFlexibleLayout();
        }

        function startDrag(event, handle) {
            if (event.button !== 0 || !current || drag) return;
            event.preventDefault();
            event.stopPropagation();
            drag = { mode: current.mode, index: Number(handle.dataset.column),
                x: event.clientX, widths: current.widths.slice(), originalWeights: preferences[current.mode].slice(),
                originalMinimum: tableMinimum[current.mode],
                pointerId: event.pointerId, handle, controller: new AbortController() };
            const active = drag;
            document.body.classList.add('mjd-column-dragging');
            try { handle.setPointerCapture(event.pointerId); } catch (_) {}
            const options = { signal: active.controller.signal };
            document.addEventListener('pointermove', move => {
                if (move.pointerId !== active.pointerId) return;
                if (!active.handle.isConnected || current?.mode !== active.mode) { finishDrag(true); return; }
                const widths = moveBoundary(active.widths, layouts[active.mode].minimum, active.index, move.clientX - active.x);
                rememberWidths(widths);
            }, options);
            document.addEventListener('pointerup', end => { if (end.pointerId === active.pointerId) finishDrag(false); }, options);
            document.addEventListener('pointercancel', end => { if (end.pointerId === active.pointerId) finishDrag(true); }, options);
            handle.addEventListener('lostpointercapture', () => finishDrag(true), options);
            document.addEventListener('keydown', key => {
                if (key.key === 'Escape') { key.preventDefault(); finishDrag(true); }
            }, options);
        }

        function addHandles(heading) {
            const cells = Array.from(heading.children).filter(el => el.tagName === 'DIV');
            for (let index = 1; index < cells.length; index++) {
                const cell = cells[index];
                if (cell.querySelector('.mjd-col-resize')) continue;
                const handle = document.createElement('span');
                handle.className = 'mjd-col-resize';
                handle.dataset.column = String(index);
                handle.tabIndex = 0;
                handle.setAttribute('role', 'separator');
                handle.setAttribute('aria-orientation', 'vertical');
                handle.setAttribute('aria-label', `Spaltenbreite ${cell.textContent.trim() || index}`);
                handle.title = 'Ziehen: Breite ändern · Doppelklick: automatische Breiten · Pfeiltasten: fein einstellen';
                handle.addEventListener('pointerdown', event => startDrag(event, handle));
                handle.addEventListener('click', event => event.stopPropagation());
                handle.addEventListener('dblclick', resetColumns);
                handle.addEventListener('keydown', event => {
                    if (event.key === 'Enter') { resetColumns(event); return; }
                    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || !current) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const delta = (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 40 : 10);
                    const widths = moveBoundary(current.widths, layouts[current.mode].minimum, index, delta);
                    rememberWidths(widths);
                    savePreferences();
                });
                cell.appendChild(handle);
            }
        }

        function updateFlexibleLayout() {
            if (!document.body) return;
            const header = document.querySelector('header');
            const footer = document.querySelector('footer');
            const stats = document.querySelector('.listFooter');
            const content = document.querySelector('#gwtContent');
            [header, footer, stats, content].forEach(watch);
            const footerHeight = footer?.getBoundingClientRect().height || 0;
            const statsHeight = stats?.getBoundingClientRect().height || 0;
            const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom || 0);
            setVariable('--mjd-header-height', `${Math.ceil(headerBottom)}px`);
            setVariable('--mjd-native-footer-height', `${Math.ceil(footerHeight)}px`);
            setVariable('--mjd-stats-height', `${Math.ceil(statsHeight)}px`);
            const mode = document.querySelector('.downloadshub.current') ? 'downloads'
                : document.querySelector('.linkcollectorhub.current') ? 'links' : null;
            const heading = content?.querySelector('.listHeader');
            const headingWrapper = content?.querySelector('.listHeadingWrapper');
            if (!mode || !heading || !headingWrapper) {
                if (drag) finishDrag(true);
                current = null;
                return;
            }
            const firstRow = content.querySelector('.listRow:not(.listLoadMoreAnchor)');
            const scroller = firstRow?.parentElement || null;
            if (scroller && !scroller.classList.contains('mjd-table-scroll')) scroller.classList.add('mjd-table-scroll');
            const bumper = content.querySelector('.listHeadingBumper');
            if (bumper) {
                const height = Math.max(0, Math.ceil(headerBottom + headingWrapper.getBoundingClientRect().height
                    - bumper.getBoundingClientRect().top - window.scrollY));
                if (bumper.style.height !== `${height}px`) bumper.style.setProperty('height', `${height}px`, 'important');
            }
            const rect = (scroller || content).getBoundingClientRect();
            setVariable('--mjd-table-left', `${Math.max(0, rect.left)}px`);
            setVariable('--mjd-table-right', `${Math.max(0, root.clientWidth - rect.right)}px`);
            const viewportHeight = window.visualViewport?.height || innerHeight;
            const top = Math.max(header?.getBoundingClientRect().bottom || 0, 0) + headingWrapper.getBoundingClientRect().height;
            setVariable('--mjd-list-viewport-height', `${Math.max(24, viewportHeight - top - statsHeight - footerHeight - 24)}px`);
            const available = Math.max(0, (scroller || content).clientWidth - 12);
            current = { mode, heading, scroller, available, widths: current?.widths || null };
            addHandles(heading);
            if (drag && (drag.mode !== mode || !drag.handle.isConnected)) finishDrag(true);
            if (!drag) renderColumns(fitColumns(Math.max(available, tableMinimum[mode]), layouts[mode], preferences[mode]));
            if (scroller && !scrollBound.has(scroller)) {
                scrollBound.add(scroller);
                scroller.addEventListener('scroll', () => {
                    const target = content.querySelector('.listHeadingWrapper');
                    if (target && Math.abs(target.scrollLeft - scroller.scrollLeft) > 1) target.scrollLeft = scroller.scrollLeft;
                }, { passive: true });
            }
            if (!scrollBound.has(headingWrapper)) {
                scrollBound.add(headingWrapper);
                headingWrapper.addEventListener('scroll', () => {
                    const target = current?.scroller;
                    if (target && Math.abs(target.scrollLeft - headingWrapper.scrollLeft) > 1) target.scrollLeft = headingWrapper.scrollLeft;
                }, { passive: true });
            }
            if (scroller && Math.abs(headingWrapper.scrollLeft - scroller.scrollLeft) > 1) headingWrapper.scrollLeft = scroller.scrollLeft;
        }

        new MutationObserver(scheduleSync).observe(root, { childList: true, subtree: true });
        window.addEventListener('resize', scheduleSync, { passive: true });
        setInterval(scheduleSync, 1000);
        window.visualViewport?.addEventListener('resize', scheduleSync, { passive: true });
        window.addEventListener('storage', event => {
            if (event.key !== storageKey) return;
            Object.assign(preferences, readPreferences());
            scheduleSync();
        });
        scheduleSync();
    })();

    GM_addStyle(`
        /* Navigation rechts am Drei-Punkte-Menü; stabile Einstellungsnavigation. */
        html { scrollbar-gutter: stable !important; }
        header .navbarStatic { position: relative !important; }
        #dropDownMenuButton {
            position: absolute !important; top: auto !important; bottom: 0 !important; right: 0 !important;
            width: 48px !important; height: 70px !important;
        }
        #dropDownMenuButton > .moreButton {
            position: static !important; box-sizing: border-box !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            width: 100% !important; height: 100% !important; padding: 0 !important;
        }
        #dropDownMenuButton > .moreButton img { margin: 0 !important; }
        @media (max-width: 1100px) { #dropDownMenuButton { height: 42px !important; } }
        #mainnav .mainnav > ul {
            justify-content: flex-start !important;
            padding-right: 52px !important;
            box-sizing: border-box !important;
        }
        body:has(.settingshub.current) #gwtContent div:has(.GHS0TFHMT) {
            overflow: visible !important;
        }
        body:has(.settingshub.current) #gwtContent {
            padding-top: calc(var(--mjd-header-height, 72px) + 14px) !important;
        }
        body:has(.settingshub.current) .GHS0TFHMT {
            align-content: start !important;
        }
        body:has(.settingshub.current) .GHS0TFHMT > .clearfix {
            display: none !important;
        }
        .GHS0TFHKT {
            align-self: start !important;
            margin-top: 0 !important;
        }
        .GHS0TFHKT a, .GHS0TFHKT a.GHS0TFHDT {
            font-weight: 600 !important;
            line-height: 20px !important;
        }
        .GHS0TFHKT a > img { flex-shrink: 0 !important; }

        /* Einstellungsseiten: gemeinsame Titel-/Aktionszeile statt Float-Inseln. */
        body:has(.settingshub.current) #gwtContent .GHS0TFHHT .buttonWrapper:has(> h1) {
            display: flex !important; flex-wrap: wrap !important; align-items: center !important;
            justify-content: flex-start !important; gap: 12px 20px !important;
            width: 100% !important; box-sizing: border-box !important;
            padding: 16px !important; margin: 0 0 16px !important;
            background: var(--mjd-heading) !important; border: 1px solid var(--mjd-border) !important;
            border-radius: 10px !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHHT .buttonWrapper > h1 {
            float: none !important; width: auto !important; min-width: 0 !important;
            display: flex !important; align-items: center !important; gap: 10px !important;
            margin: 0 !important; padding: 0 !important; font-size: 20px !important; line-height: 26px !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHHT .buttonWrapper > .buttonWrapper {
            float: none !important; width: auto !important; min-width: 0 !important;
            display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 8px !important;
            margin: 0 !important; padding: 0 !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHHT .buttonWrapper > :is(br, div[style*="clear"]) {
            display: none !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHHT .listHeadingWrapper .buttonWrapper:has(> h1) {
            border: 0 !important; background: transparent !important;
            padding: 0 !important; margin: 0 !important;
        }
        /* Accountheader und Zeilen erhalten exakt dasselbe Raster und dieselben Insets. */
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .GHS0TFHPT {
            padding: 0 !important; overflow: hidden !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .GHS0TFHPT .buttonWrapper:has(> h1) {
            border: 0 !important; border-radius: 0 !important; margin: 0 !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .GHS0TFHAU {
            margin: 0 !important; padding: 0 !important; min-width: 0 !important;
            border: 1px solid var(--mjd-border) !important; border-radius: 10px !important;
            overflow: hidden !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .listRow {
            margin: 0 !important; padding: 0 !important; width: 100% !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .listHeader,
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .listRow > div:first-of-type {
            display: grid !important; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1.2fr) !important;
            box-sizing: border-box !important; width: 100% !important; min-width: 0 !important;
            align-items: stretch !important; padding: 0 !important; margin: 0 !important;
            height: auto !important; min-height: 44px !important; border: 0 !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .listHeader > div,
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .listRow > div:first-of-type > div {
            box-sizing: border-box !important; width: auto !important; min-width: 0 !important; float: none !important;
            display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 6px !important;
            padding: 10px 12px !important; line-height: 20px !important;
            white-space: normal !important; overflow-wrap: anywhere !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .listHeader p {
            margin: 0 !important; font-size: 13px !important; line-height: 20px !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU .listRow :is(span, .gwt-InlineLabel) {
            max-width: 100% !important; min-width: 0 !important; white-space: normal !important; overflow-wrap: anywhere !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHCU :is(.listHeader, .listRow > div:first-of-type) > br {
            display: none !important;
        }
        /* Allgemein: Grid enthält auch hohe Systeminformationen ohne Clearfix.
           Die Checkbox-Spalte bleibt sichtbar und alle Eingaben bleiben bedienbar. */
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 {
            display: grid !important; grid-template-columns: 36px minmax(160px, .9fr) 24px minmax(0, 1.8fr) !important;
            align-items: center !important; gap: 12px !important; padding: 12px !important; height: auto !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 > div {
            display: block !important; box-sizing: border-box !important;
            width: auto !important; min-width: 0 !important; float: none !important; padding: 0 !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 > br { display: none !important; }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 > div:first-child > img {
            display: block !important; width: 32px !important; height: 32px !important; margin: 0 !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 p {
            margin: 0 !important; line-height: 20px !important; padding: 0 !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 > div:nth-of-type(4):not(:has(.GHS0TFHC4)) {
            display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 8px !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 > div:nth-of-type(4) > * {
            float: none !important; margin: 0 !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3:has(.GHS0TFHC4) {
            align-items: start !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3:has(.GHS0TFHC4) > div:nth-of-type(4) {
            display: flex !important; flex-direction: column !important; gap: 14px !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3:has(.GHS0TFHC4) > div:nth-of-type(4) > div {
            width: 100% !important; min-width: 0 !important; float: none !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 .GHS0TFHC4 {
            float: none !important; width: 100% !important; min-width: 0 !important;
            white-space: normal !important; overflow-wrap: anywhere !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 .GHS0TFHC4 > div {
            width: 100% !important; box-sizing: border-box !important; padding-bottom: 12px !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 .GHS0TFHC4 table {
            width: 100% !important; table-layout: fixed !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 .GHS0TFHC4 :is(td, th) {
            white-space: normal !important; overflow-wrap: anywhere !important; vertical-align: top !important;
        }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 .GHS0TFHC4 :is(td, th):first-child { width: 45% !important; }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 .GHS0TFHC4 :is(td, th):nth-child(2) { width: 12% !important; }
        body:has(.settingshub.current) #gwtContent .GHS0TFHM3 .GHS0TFHC4 :is(td, th):nth-child(3) { width: 43% !important; }
        @media (max-width: 1100px) {
            body:has(.settingshub.current) #gwtContent .GHS0TFHM3 {
                grid-template-columns: 36px minmax(0, 1fr) 24px !important; gap: 10px !important;
            }
            body:has(.settingshub.current) #gwtContent .GHS0TFHM3 > div:nth-of-type(4) {
                grid-column: 2 / -1 !important;
            }
            body:has(.settingshub.current) #gwtContent .GHS0TFHM3 input:not([type="checkbox"]) { width: min(100%, 320px) !important; }
        }

`);

    GM_addStyle(`
    /* Fortschrittszellen dürfen den Inhalt nicht auf 12px Höhe abschneiden. */
    body:has(.downloadshub.current) #gwtContent .listRow
    .mjd-row-shell > div:has(> .mjd-progress) {
        display: flex !important;
        align-items: center !important;
        height: auto !important;
        min-height: 32px !important;
        max-height: none !important;
        min-width: 0 !important;
        overflow: visible !important;
    }
    #gwtContent .listRow .mjd-progress {
        box-sizing: border-box !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        height: auto !important;
        min-height: 26px !important;
        max-height: none !important;
        padding: 3px 0 !important;
        overflow: visible !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        grid-template-areas: "bar value" !important;
        align-items: center !important;
        gap: 4px 8px !important;
    }
    #gwtContent .listRow .mjd-progress:has(.eta-label) {
        grid-template-areas: "bar value" "eta eta" !important;
    }
    #gwtContent .listRow .mjd-progress:has(.eta-label--extract) {
        grid-template-columns: minmax(0, 1fr) !important;
        grid-template-areas: "eta" !important;
    }
    #gwtContent .listRow .mjd-progress progress {
        box-sizing: border-box !important;
        min-width: 0 !important;
        max-width: none !important;
        width: 100% !important;
        height: 12px !important;
        max-height: none !important;
        margin: 0 !important;
        vertical-align: middle !important;
    }
    #gwtContent .listRow .mjd-progress .progressBarLabel {
        overflow: visible !important;
        line-height: 16px !important;
        max-height: none !important;
    }
    #gwtContent .listRow .eta-label--extract {
        height: auto !important;
        max-height: none !important;
        max-width: none !important;
        overflow: visible !important;
        flex-wrap: wrap !important;
        line-height: 20px !important;
    }
    #gwtContent .listRow .eta-label--extract::before {
        box-sizing: border-box !important;
        display: inline-flex !important;
        align-items: center !important;
        min-height: 20px !important;
        line-height: 16px !important;
    }
    /* Das 18px-Archivsymbol bekommt tatsächlich 20px freien Platz. */
    body:has(.downloadshub.current) #gwtContent .listRow
    .mjd-row-shell > div:nth-of-type(5) {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 2px !important;
        min-height: 24px !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
    }
    body:has(.downloadshub.current) #gwtContent .listRow
    .mjd-row-shell > div:nth-of-type(5) > div {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        height: auto !important;
        overflow: visible !important;
        line-height: 1 !important;
    }
    body:has(.downloadshub.current) #gwtContent .listRow
    .mjd-row-shell > div:nth-of-type(5) img {
        display: block !important;
        flex: 0 0 18px !important;
        width: 18px !important;
        height: 18px !important;
        max-width: none !important;
        max-height: none !important;
        margin: 0 !important;
        object-fit: contain !important;
    }
`);
})();
