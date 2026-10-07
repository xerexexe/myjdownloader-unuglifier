# MyJDownloader UnUglifier 1.0.4

The countdown now temporarily replaces the empty “No Packages” panel with a prominent amber panel and large, high-contrast text. If packages already exist, it appears above the list without covering rows. It reports waiting or interruption, disappears automatically, and restores the native empty state. The notice does not claim that a package has arrived or that link analysis is complete.

Refresh LinkGrabber once about two seconds after submitting text links through the native add-links dialog. The workaround briefly switches native views, without a page reload, resubmitting links or starting downloads. It waits for dialogs and text entry, cancels when the user leaves LinkGrabber, and expires after 15 seconds. Container-file drops and submissions from other apps are not detected. Slow link analysis and stale footer totals may still need a manual refresh.

## Install

[Install the userscript from Greasy Fork](https://greasyfork.org/en/scripts/598605-myjdownloader-unuglifier) with Tampermonkey, then reload MyJDownloader.

Disable earlier development versions before installing this release. The old private 3.x version numbers do not represent newer public releases.

## Included

- Responsive tables, saved column widths and readable table headers.
- Light/dark themes and clearer download/extraction information.
- Account-table alignment fixes.
- Contained system-information layouts and better-positioned account actions.

Read the README for ETA limitations, language behavior and known responsive edge cases. This release has not been verified against every live backend state.

Copyright © 2026 Holger Teichmann · MIT License · Unofficial community project.
