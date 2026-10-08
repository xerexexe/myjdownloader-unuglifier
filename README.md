# MyJDownloader UnUglifier

Light and dark themes, resizable columns, readable ETA and extraction status for [MyJDownloader](https://my.jdownloader.org/).

**Version 1.0.5 · Holger Teichmann · MIT License**

[![Greasy Fork installs](https://img.shields.io/greasyfork/dt/598605?label=Greasy%20Fork%20installs)](https://greasyfork.org/en/scripts/598605-myjdownloader-unuglifier/stats)
[![GitHub release downloads](https://img.shields.io/github/downloads/xerexexe/myjdownloader-unuglifier/total?label=GitHub%20release%20downloads)](https://github.com/xerexexe/myjdownloader-unuglifier/releases)

## Install

1. Install Tampermonkey.
2. [Install the script from Greasy Fork](https://greasyfork.org/en/scripts/598605-myjdownloader-unuglifier).
3. Disable older copies or overlapping theme scripts, then reload MyJDownloader.

The script runs only on `https://my.jdownloader.org/*` and requires `GM_addStyle`.

Source and updates are maintained on [GitHub](https://github.com/xerexexe/myjdownloader-unuglifier). Greasy Fork checks the `main` branch for updates. Installations from GitHub keep their GitHub update source.

## Features

- Light/dark toggle with a saved preference.
- Responsive tables and saved column widths. Drag a divider to resize, use arrow keys for fine adjustments, or double-click to reset.
- Readable headers, progress bars, ETA and extraction status.
- Layout fixes for dialogs, accounts, settings, system information and the loading screen.
- Automatic LinkGrabber refresh after adding links or containers through the native dialog.

## LinkGrabber refresh

An amber countdown replaces “No Packages”, or appears above an existing list. The first refresh starts about two seconds after adding links. Container selection and drag-and-drop are supported in the native add-links dialog.

Refresh stays on the selected device and LinkGrabber view. If the list is unchanged, it retries up to three times. Once package names or link counts change, checking and the notice stop immediately.

Open dialogs, text entry and background tabs pause the refresh. Leaving LinkGrabber cancels it. The script does not reload the page, resubmit links or start downloads.

Links added by other apps are not detected. Visible list changes do not confirm completed link analysis, and footer totals may remain stale.

## Limitations

ETA and extraction information come from the web interface. The script cannot correct missing or stale backend values; elapsed time is not an ETA. A finished download is not treated as active extraction.

MyJDownloader uses generated GWT selectors. Site updates can break styling, and some narrow-window layouts may still need adjustments.

Existing MyJDownloader labels keep their original language. Added status labels are currently German; German listing metadata is included, but the script is not a full translation.

## Privacy and statistics

Theme and column preferences use browser storage. Temporary extraction display state uses session storage. The script adds no telemetry, clipboard access, credential collection or download-management API calls.

The badges count Greasy Fork installs and GitHub release-asset downloads separately. They are not unique-user counts; GitHub Raw downloads are not included. Badges are served by Shields.io.

## Contributing

For bug reports, include the script version, browser, affected page and reproduction steps. Remove private details from screenshots and logs.

## License

Copyright © 2026 Holger Teichmann. [MIT License](LICENSE). Keep the copyright and license notices when distributing the script.

Unofficial community project, not affiliated with JDownloader or AppWork. Their names, logos and original interface assets remain theirs.
