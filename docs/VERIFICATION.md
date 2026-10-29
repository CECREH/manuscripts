# Verification record

## Single-list identity audit — October 29, 2026

All 19 selected manuscript copies were compared by substantive question, data/sample, methods, outcomes and documented lineage. All 33 unique original source/documentation files still match the earlier receipt hashes. Eighteen entries are retained publicly, no duplicate record relationship is asserted, and MS-0003 is retained privately unchanged until its independent identity from MS-0007 is established. The selected MS-0007 Word render remains unchanged. Exact private retention passes the previous-record/history validator; all source and OneDrive files are preserved.

Confirmed/pending tabs and scope badges are removed. All retained papers appear directly in one list. Build-derived version parameters cover CSS, application code, module imports, validator and data requests to avoid mixed cached releases. New tests cover stale unversioned modules, single-list behavior and private retention; existing filters, keyboard, empty/error, mobile, accessibility, protected-link and red-artwork checks remain. All 18 data/build and 28 browser test cases passed, with zero tested accessibility violations or horizontal overflow. The Mac runner stalled after its final case and was interrupted during cleanup, producing exit 130; this is not recorded as a clean full-command exit. CI remains the required successful deployment gate. Desktop and 320px screenshots were inspected. Three initial browser assertions depended on the former tab/disclosure state or the old attention count; the tests were corrected to verify the new list behavior. The push of the single-list revision was denied before execution. Remote main was rechecked and remains `349cda6aba3a1b780271182e72edaf622241c67e`. Local implementation commits are `f4cfcc8` and `fe2fe1f`; no alternate publishing route or retry was attempted. The owner subsequently explicitly approved publishing the 18-entry list and removing the scope tabs. One retry of the previously rejected push is authorized after clean checks.

## Clean local release check — October 29, 2026

The complete `npm run check` now exits **0**: schema compilation, both datasets, **18 data/build tests**, both builds and **28 browser tests** passed. The browser suite completed in 17.2 seconds. Local tests now use Playwright 1.56.1's pinned Chromium 141.0.7390.37 (build 1194), matching the CI browser selection, rather than the independently updated system Chrome. This resolved the observed cleanup hang; no forced termination, skipped case or relaxed deployment gate was used. The first browser download encountered a cache-lock timeout; the bounded completion attempt succeeded. The release asset hashes remain unchanged. Publication and live verification follow this clean result.

## Official branding and OneDrive links — October 29, 2026

Authoritative logo bytes match SHA-256 `a473da1cfcdef681f28b9228d47d07ce1db7a960cf8f2e9a949f0bdd732e4d8a`. The header and newly named favicon use identical unchanged PNG artwork. The earlier green SVG is removed from source and shipped assets. PNG has an explicit image/png preview MIME type under nosniff. No Library patch was applied.

Nineteen manuscript files were uploaded to the selected TTU OneDrive folder: 16 DOCX, two PDF and one Markdown. All source/staging hashes match, all signed-in destinations show the expected manuscript, and the initial 19 anonymous resource-URL checks redirected to Microsoft login. A subsequent unsigned check returned HTTP 403 at the SharePoint login transition for every file; it did not expose document content and was not bypassed or retried through another credential. The pre-existing benchmark and all source originals are preserved. No new sharing links, access grants or permission changes were made; inherited parent-folder membership is not fully enumerated.

Public records feature reviewed uploaded-copy links with version labels while retaining unresolved canonical/current-version confirmations. All IDs, abstracts, writing/journal/scope evidence and canonical/submission histories remain unchanged. Regression checks cover destination-review requirements, duplicate-copy rejection, safe resource URLs, privacy boundaries and no automatic external requests.

Local `npm run check` passed **17 data/build checks and 27 browser checks**, including axe WCAG 2 A/AA, 2.1 AA and 2.2 AA scans. The public artifact shows the exact red logo at 1440, 760, 380 and 320px with no horizontal overflow or tested accessibility violations. Desktop and 320px screenshots were visually inspected. An initial test used an ambiguous MS-0007 search selector because MS-0003 also cross-references that ID; narrowing the test to the stable record ID fixed the selector without changing application behavior. Local screenshots: `artifacts/official-brand-1440.png`, `artifacts/official-brand-760.png`, `artifacts/official-brand-380.png`, `artifacts/official-brand-320.png` and `artifacts/onedrive-copy-desktop.png`.

Commit `349cda6aba3a1b780271182e72edaf622241c67e` deployed through the explicitly approved Mac Git setup; [run 40814852032](https://github.com/CECREH/manuscripts/actions/runs/40814852032) succeeded. All nine served application assets matched the tested artifact by SHA-256; both PNG assets returned image/png. The `.nojekyll` build marker and old SVG returned 404, as did private/non-shipped paths. Live HTML retains noindex/nofollow and no-referrer, and its JSON contains the 19 exact reviewed resource URLs. Browser reload exposed a stale-module/new-data validation mismatch; the subsequent single-list update addresses that cache consistency issue. A later ordinary browser reload successfully rendered the currently deployed 19-entry release, consistent with the earlier cache mismatch expiring. The visible logo loaded with natural width 1445. The browser declares the new PNG favicon, but direct visual confirmation of the browser-tab icon remains outstanding: opening this hidden task’s browser panel was queued. This is not claimed as completed tab-chrome verification.

## MS-0007 selected Word abstract — October 29, 2026

The owner selected the audit-protocol Word render and explicitly authorized publication of its actual abstract. Only MS-0007's description and local-version label/date/note change; all other records, IDs, histories, scope/status confirmations and draft links are preserved. The Word source matches its previously inspected hash, and the excerpt is the exact paragraph immediately following Abstract. April 16, 2026 comes from embedded creation/modification metadata; June 6 is a later distribution-copy date. Current OneDrive authority and the relationship to MS-0003 remain unconfirmed.

The public dataset now contains 18 abstracts and one labeled summary. Schema validation, both builds, **15 data/build tests and 22 browser tests passed**. The expanded MS-0007 abstract was checked at 320px and 390px with no horizontal overflow or tested accessibility violations; desktop and mobile screenshots were inspected. Unresolved-description behavior remains covered using a deliberately unverified test fixture. The first browser-test launch could not bind its loopback server inside the sandbox; the permitted rerun passed.

Local screenshots: `artifacts/ms0007-word-desktop.png`, `artifacts/ms0007-word-mobile-320.png` and `artifacts/ms0007-word-mobile-390.png`. The private extraction receipt includes the source/document timestamps and exact published-text hash. No schema or application code change was necessary.

Published in commit `2847facc91e42f251ec0d53d64f3f680dff373db`. [Validation and deployment run 40803422001](https://github.com/CECREH/manuscripts/actions/runs/40803422001) succeeded (check 51 seconds; deploy 11 seconds), including all 15 data/build and 22 browser tests. Anonymous HTML/JSON/JS/CSS responses were HTTP 200 and matched the tested build by SHA-256. The live abstract matches the inspected Word paragraph exactly; the selected Word-render label says April 16, 2026, and the current OneDrive version and relationship to MS-0003 remain unconfirmed. A live browser check verified the expanded text and labels.

The other 18 records are unchanged, all 19 draft URLs remain null, and the live robots directive remains `noindex, nofollow`. Existing grants, organization-profile and atlas heads/homepage settings match the earlier snapshot; no inbound navigation links were added. OneDrive permissions and manuscript sources were not changed. This publication completed successfully with no uncertain action remaining.

## Initial abstract enhancement — October 29, 2026

Local `npm run check` passes **15 data/build tests and 21 browser tests**. The release adds 17 source abstracts, one explicitly labeled source-grounded summary, and one unresolved description. All prior record fields, IDs, histories, links and status confirmations are unchanged.

The new checks enforce the distinction between an inspected abstract, a summary supported by a checked source with no abstract, and unverified content that must remain null. They cover description keyword search, source/version/date labels, safe text rendering, keyboard disclosure, 320px/390px expanded abstracts and automated accessibility scans. No tested WCAG violations or horizontal overflow were found. Desktop and mobile abstract screenshots were inspected.

Private extraction receipts record source hashes and the exact published-text hashes. The benchmark abstract comes from the explicitly designated Word editorial master; the empty Abstract section in MS-0015 supports the body-grounded summary. MS-0007 remains unresolved because its manuscript title/framing differs across local versions. No internal author-review notes or other manuscript sections are copied into the site.

Screenshots: `artifacts/abstract-desktop.png`, `artifacts/summary-desktop.png`, and `artifacts/public-mobile-390-details.png` (also 320px). These remain local and Git-ignored.

The enhancement is published in commit `eae10c8b61ccb952e7c3e2ef3a75ebf48db03e11`. [Validation and deployment run 40799927372](https://github.com/CECREH/manuscripts/actions/runs/40799927372) succeeded: check job 1 minute 14 seconds, deploy job 53 seconds. Remote CI passed the same 15 data/build tests and 21 browser tests.

Anonymous live HTTP requests returned 200 for the HTML, application JavaScript, CSS, record helpers, schema validator and public JSON. All six bodies matched the tested local artifact by SHA-256. The live dataset contains 17 abstracts, one summary and one unresolved description; all 19 current-draft URLs remain null. The live robots directive is still `noindex, nofollow`. Existing grants, organization-profile and atlas heads/homepage settings still match the prepublication snapshot, with no inbound navigation additions.

Live browser checks confirmed abstract-text search finds MS-0005, its source abstract and inspection provenance expand correctly, MS-0015 is explicitly labeled as a summary written for this register, and MS-0007 displays the source-conflict warning without invented text. Private extraction and deployment receipts remain outside the public repository. No OneDrive permissions changed and no publication action was denied or left uncertain.

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

## Remaining work

The owner subsequently authorized the 19 inspected uploaded-copy links. Canonical/current-version confirmations remain null and visibly unresolved; destination verification is not author-version confirmation. Scope/identity confirmations, current bylines/statuses, owner assignments and agreed dates remain maintenance tasks as listed in `PROJECT_STATUS.md`. No OneDrive permissions were changed, and no publishing action is awaiting approval or has an uncertain outcome.
