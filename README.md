# MyJDownloader UnUglifier

A cleaner MyJDownloader interface with light and dark themes, resizable columns, and easier-to-read download and extraction status.

**Version 1.0.3 · by Holger Teichmann · MIT License**

[![Greasy Fork installs](https://img.shields.io/greasyfork/dt/598605?label=Greasy%20Fork%20installs)](https://greasyfork.org/en/scripts/598605-myjdownloader-unuglifier/stats)
[![GitHub release downloads](https://img.shields.io/github/downloads/xerexexe/myjdownloader-unuglifier/total?label=GitHub%20release%20downloads)](https://github.com/xerexexe/myjdownloader-unuglifier/releases)

An unofficial, client-side userscript for [MyJDownloader](https://my.jdownloader.org/). It improves the existing interface rather than replacing JDownloader or changing how downloads are handled.

## Install

1. Use Tampermonkey in your browser.
2. Disable earlier development versions of this script and overlapping MyJDownloader theme scripts. Do not run both versions together.
3. Open [MyJDownloader UnUglifier on Greasy Fork](https://greasyfork.org/en/scripts/598605-myjdownloader-unuglifier), click the install button and confirm in Tampermonkey.
4. Reload MyJDownloader.

The script matches only `https://my.jdownloader.org/*` and requests only `GM_addStyle`.

The [source code](https://github.com/xerexexe/myjdownloader-unuglifier) is maintained on GitHub. Greasy Fork automatically checks the `main` branch for updates. Copies installed from Greasy Fork receive updates through Greasy Fork; existing GitHub installations retain their GitHub update source.

## Installation statistics

The badges above show Greasy Fork installation counts and GitHub release-asset downloads separately. They are not unique-user or active-user counts and should not be added together. GitHub Raw downloads are not included. Statistics and badges may update with a delay. No tracking code is added to the userscript; the README badges are served by Shields.io.

## Features

- Light and dark themes with a saved preference and a compact toggle.
- Responsive download and LinkGrabber columns, with saved manual widths.
- Drag a column divider to resize it; use arrow keys for fine adjustments. Double-click a divider to return to automatic sizing.
- Taller, readable table headers and clearer text without dark-mode text shadows.
- Improved dialogs, account-table alignment and settings layouts.
- General settings and system information that contain their content instead of overflowing their rows.
- Download ETA displayed without having to hover.
- Separate extraction information when the page actually reports extraction activity. A completed download alone is not treated as active extraction.
- Improved initial loading-screen styling.
- One automatic LinkGrabber view refresh about two seconds after submitting text links through the native add-links dialog. It waits for dialogs and text entry to finish, cancels if you leave LinkGrabber, and expires after 15 seconds. It does not reload the page or start downloads. Container-file drops and links submitted by other apps are not detected.

This refresh is a workaround for stale native lists, not a fix to MyJDownloader's backend. A slow link analysis may still finish after the single refresh. Footer totals may remain stale.

A small, theme-aware status notice counts down to the refresh, indicates when it is waiting for a free view, and disappears automatically. It reports view refresh activity, not confirmed package arrival or completed link analysis.

## ETA and extraction: important limitations

This script reads the status and timing information already exposed by the web interface. It does not request a more accurate ETA from JDownloader or accelerate backend updates.

If the upstream page supplies a stale or missing ETA, the script cannot manufacture a reliable remaining time. A “running since” value measures elapsed time, not estimated completion. Extraction memory is local display state, not an independent measurement of backend activity.

## Language

English remains the default project language. German script-name and description metadata are also provided for discovery in German-language userscript listings; the name stays the same in both languages.

The script is not a full translation layer. Existing German and English labels from MyJDownloader remain unchanged. The added status and timing labels are currently German. Changing the theme does not change language settings.

## Privacy and safety

- Theme and column preferences are stored in browser storage.
- Temporary extraction display state is stored in session storage.
- No additional download-management API calls, telemetry, clipboard access or credential collection are introduced by this script.
- Your userscript manager may check GitHub or Greasy Fork for script updates, depending on the installation source.
- This repository contains the script and documentation—not personal screenshots, account details, device IDs or logs.
- To undo the customization, disable the script and reload the page. Settings and downloads are not changed by removing it.

## Known limitations

- MyJDownloader uses generated GWT class names; upstream changes can break styling.
- The dashboard theme shortcut may be misplaced or hidden in narrow windows.
- The advanced-settings search toolbar can overflow in narrow windows.
- Not every backend state or viewport has been verified. Check the layout on the live site after installation.

## Contributing

Bug reports and improvements are welcome. Include the script version, browser, viewport size, affected page and a short reproduction. Remove names, account details, passwords, device IDs, addresses and other private information from screenshots or logs before posting them.

## License and attribution

Copyright © 2026 Holger Teichmann. Released under the [MIT License](https://github.com/xerexexe/myjdownloader-unuglifier/blob/main/LICENSE).

Keep the copyright and license notices when copying or distributing the script. A visible UI credit is appreciated but is not an additional license requirement.

This project is not affiliated with or endorsed by JDownloader or AppWork. Their names, logos and original interface assets belong to their respective owners; this license covers this project's code and documentation.
