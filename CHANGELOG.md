# Changelog

## 1.0.3 — 2026-10-07

- Added a light/dark-aware countdown and status notice for the automatic LinkGrabber refresh.
- Show when refresh waits for dialogs or editing, is interrupted, or has been requested; do not imply link analysis is complete.

## 1.0.2 — 2026-10-04

- Refresh LinkGrabber once after submitting text links, using native view navigation instead of reloading the page.
- Avoid interrupting open dialogs, editing, background tabs and user navigation; expire pending refreshes after 15 seconds.
- This is a display workaround only; no links are resubmitted and no downloads are started.

## 1.0.1 — 2026-10-03

- Added German name and description metadata for German-language userscript searches.
- English remains the default; the script name and interface behavior are unchanged.

## 1.0 — 2026-10-03

First public release of **MyJDownloader UnUglifier**.

- Light/dark styling, initial loading screen and responsive table layouts.
- Persistent manual column widths and a taller, readable column header.
- ETA and extraction display improvements.
- Aligned account-management headers and rows.
- Contained general-settings and system-information layouts.
- Moved account actions closer to their headings, including HTTP/FTP authentication.
- English project metadata, installation documentation and an MIT license with attribution to Holger Teichmann.

Earlier 3.x numbers were private development versions, not public releases. Disable the old development script before installing this release.
