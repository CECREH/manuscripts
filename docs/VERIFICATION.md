# Verification record

## Local release checks — October 29, 2026

`npm run check` passed with Node 22.20.0 and the pinned dependencies:

- Schema compilation; 6 synthetic fixtures and 19 public records validated.
- **14 data/build tests passed**: strict fields/dates, ID uniqueness, confirmation coupling, deadline basis, append-only history, scope separation, author search, public-link review and private/public build boundaries.
- **19 browser tests passed** against both generated artifacts: filters, sort, scope/archive separation, keyboard controls, empty/no-match/error/timeout/retry states, safe text, no external requests or browser persistence, noindex, public author filters and source-history distinctions.
- Actual public metadata rendered at 320px and 390px without horizontal overflow. Axe WCAG 2 A/AA, 2.1 AA and 2.2 AA scans found zero violations in tested states. This is not a full manual screen-reader or cross-browser audit.
- Public desktop/details and mobile screenshots were visually inspected. The generated artifact contains only the static allowlist and public JSON; no manuscript documents, source receipts or protected links.
- The separate confidential dataset validated against the original five-record file with IDs and link/submission history preserved. It is not a deployment input.

An initial local test caught a missing public-data option in the preview server; it was corrected before the successful full run. No remote publication occurred during that failure.

Local screenshots are Git-ignored: `artifacts/public-desktop.png`, `public-details.png`, `public-mobile-320-top.png`, `public-mobile-390-top.png`, and mobile details captures. Synthetic regression screenshots are also retained locally. No screenshots or traces are uploaded by CI.

## Deployment evidence

The destination repository was absent at the prepublication check. Existing public CECREH repository heads were recorded before any mutation. Remote commit, Pages deployment, live HTML/JSON verification and unchanged-repository comparison will be recorded here after publication succeeds.
