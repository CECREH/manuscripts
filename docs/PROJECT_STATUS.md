# Project status

Updated October 29, 2026.

## Completed

- Separate static tracker implemented with search, stage/journal/person filters, sorting, overview counts and expandable details. The owner subsequently requested one list, replacing historical confirmed/pending scope tabs.
- Local drive and synced OneDrive inventory performed. Nineteen source records were inspected; the public projection retains 18 papers and privately holds MS-0003 pending its independent identity decision. All stable IDs, original records, histories and 19 uploaded files are preserved. See IDENTITY-AUDIT.md.
- Observed bylines and local authority/version evidence are distinct from lead assignments and current OneDrive confirmations. Historical writing and journal evidence is dated and flagged when stale.
- Public metadata dataset separated from synthetic fixtures and confidential source receipts/history. No full manuscripts, access-granting URLs, internal review notes or local paths are in the release. The owner subsequently authorized abstracts and labeled summaries.
- Public build includes noindex/nofollow. The deployment uploads only allowlisted public assets. No inbound navigation additions are made to other CECREH repositories.
- Schema validation, history checks, accessibility/mobile tests and documented maintainer/backup workflow are implemented.

- Public descriptions: 17 source abstracts and one grounded summary for an empty Abstract section. The additional privately held record retains its abstract. MS-0007 uses the owner-selected Word render dated April 16, 2026; source synchronization and its relationship to MS-0003 remain unresolved. Source labels, version labels and inspection dates accompany the text. Search includes descriptions.

## Official branding and uploaded copies

The exact official logo and newly named red PNG favicon replace the synthetic green icon. SHA-256 artwork regression and 1440/760/380/320px browser checks cover loaded images, MIME types, palette, reflow and accessibility. Nineteen protected copy links are featured separately from current-version confirmations; source dates are not replaced with upload dates. The selected MS-0007 Word render remains April 16, 2026. No existing histories are changed.

The branding/19-link release deployed as `349cda6aba3a1b780271182e72edaf622241c67e` in successful run [40814852032](https://github.com/CECREH/manuscripts/actions/runs/40814852032), before the owner's request to remove the scope tabs. It passed 17 data/build and 27 browser checks. Nine live application assets matched the tested artifact and the previous SVG returned 404. A live browser exposed mixed cached modules/new data; the single-list update adds build-derived version parameters for CSS, application/modules and JSON. No authentication or sharing settings were changed.

The source audit is complete: 33 original files match their receipt hashes, and the 19 selected uploaded copies are intact. Eighteen entries are supported for the public list, no duplicate records are proven, and one additional entry is held privately. All 18 data/build and 28 browser test cases passed locally. The Mac runner stalled after the final case and was interrupted during cleanup (exit 130); the unchanged CI gate must complete successfully before Pages deployment. Desktop and 320px layouts were inspected with no tested accessibility violations or horizontal overflow. The publication push was rejected before execution by automatic approval review because explicit approval to publish the new inventory interpretation was not established. The owner subsequently explicitly approved publication of the 18-entry list and removal of the tabs. A clean aggregate rerun now exits 0 with 18 data/build tests and 28 browser tests (17.2 seconds for the browser suite), using the Chromium version pinned to Playwright on both Mac and CI. The previous hang was resolved without a forced exit. The approved single publication retry is ready; no alternate publishing route is used.

## Release state

**Single-list revision approved and cleanly tested; deployment verification pending.** The public Pages site is `https://cecreh.github.io/manuscripts/`, hosted from the separate `CECREH/manuscripts` repository. Initial release commit: `87450e31aab119addd32a5b4df84f57b6705fa91`; validation and deployment run `40797452308` succeeded. Anonymous HTTP checks and a live browser check confirmed the released data, working interface and noindex/nofollow directive. Existing grants, organization-profile and atlas heads/homepages are unchanged.

The initial abstract enhancement was published in commit `eae10c8b61ccb952e7c3e2ef3a75ebf48db03e11`; [validation and deployment run 40799927372](https://github.com/CECREH/manuscripts/actions/runs/40799927372) succeeded with 15 data/build tests and 21 browser tests. All 19 draft URLs remain unresolved; source inspection does not confirm the current shared version.

The owner subsequently selected the MS-0007 Word abstract and explicitly authorized publishing it. Its version date comes from the April 16, 2026 embedded document metadata, not the June 6 distribution copy. It is published in commit `2847facc91e42f251ec0d53d64f3f680dff373db`; [validation and deployment run 40803422001](https://github.com/CECREH/manuscripts/actions/runs/40803422001) succeeded with 15 data/build tests and 22 browser tests. Anonymous live asset hashes match the tested build. Live browser inspection confirmed the exact abstract, selected-version/date labels and remaining uncertainty caveats.

The earlier link deferral was superseded by the request to upload manuscript sources and link the inspected copies. All 19 files are uploaded and their signed-in destinations verified. Initial anonymous checks reached Microsoft sign-in; a subsequent unsigned check returned HTTP 403 before login for all 19 and returned no file content. The 18 listed papers retain protected-copy links. Existing OneDrive permissions remain unchanged. The latest author-approved versions remain unconfirmed.

## Remaining

- Confirm the latest author-approved version for each record; the inspected uploaded-copy links do not establish that authority. Maintain the existing OneDrive access boundary and review inherited access when membership decisions are needed.
- Assign one maintainer and one backup, plus manuscript leads/stewards and next-action owners.
- Resolve the one privately held additional identity before restoring it to the public list. Historical scope membership is retained as provenance, not a separate user-facing inventory.
- Reconcile the audit-protocol/financial-implementation identity and source synchronization without merging by topic. Selecting the MS-0007 Word abstract does not resolve its relationship to MS-0003 or establish the current OneDrive version.
- Confirm current author lists and journal states with the manuscript teams. Local submission records are historical evidence, not a live portal check.
- Confirm any agreed action dates. No team deadlines are inferred. The ASAPP record separately notes its source-reported journal recommendation.
- Continue discovery as new manuscripts are identified; this inventory is provisional.

Manuscript source projects were read only. No analyses were rerun and no manuscript source content was edited. Only the explicitly authorized abstracts and labeled summary were copied/written into the tracker.
