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

## Deployment evidence — October 29, 2026

- Repository: `CECREH/manuscripts`, public, no homepage URL configured.
- Site: `https://cecreh.github.io/manuscripts/`; HTTPS enforced.
- Initial deployed commit: `87450e31aab119addd32a5b4df84f57b6705fa91`.
- [Validation and deployment run 40797452308](https://github.com/CECREH/manuscripts/actions/runs/40797452308) succeeded: check job 58 seconds, deploy job 11 seconds. The remote run passed the same 14 Node tests and 19 browser tests.
- Anonymous requests (no cookies or Authorization header) returned 200 for the HTML, CSS, JavaScript modules, favicon, public JSON and dependency notices. All eight bodies matched the tested local artifact byte-for-byte by SHA-256.
- The live HTML contains `<meta name="robots" content="noindex, nofollow">`. The page is public; this is a crawler request, not access control.
- Live browser inspection confirmed the interface renders 7 confirmed-scope records, 12 pending candidates and 19 unresolved draft links. The source/data dates and uncertainty labels render correctly.
- `.build.json`, `package.json`, `docs/HOSTING.md` and `private-data/manuscripts.json` returned 404 on the Pages site. No manuscript files or confidential source evidence are deployed.
- Existing repository heads and homepage values matched the prepublication snapshot: grants `448013742ffaa56c4df28a8fea840ae4c7b7f24d`; organization profile `c3b714f52712e719766a5d3f51eb38a0b798949c`; atlas `2eec068b9db2328a1c26963455e840006d3dde84`. No new inbound navigation links were added.

Raw local verification receipts and the complete source inventory are kept outside the public repository. The next documentation-only commit records this completed release; it does not change the site data or application assets. The workflow also validates and redeploys documentation-only pushes.

## Deferred work

The owner explicitly deferred completing manuscript links. All current-draft URLs remain null and visibly unresolved. Scope/identity confirmations, current bylines/statuses, owner assignments and agreed dates remain maintenance tasks as listed in `PROJECT_STATUS.md`. No OneDrive permissions were changed, and no publishing action is awaiting approval or has an uncertain outcome.
