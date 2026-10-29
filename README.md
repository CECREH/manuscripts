# CECREH manuscript register

A responsive, read-only register of manuscript metadata: writing stage, journal state, observed byline, local-version evidence, current draft links and next actions. Writing and journal status are separate. Every listed paper appears in one searchable list.

The owner approved a **public metadata tracker** with `noindex, nofollow` and no inbound navigation links added elsewhere. Manuscript files remain separate on OneDrive. The approved single-list update has **18 manuscript entries** and has passed the full local checks. Deployment verification is recorded in the project status and verification documents. One additional record is privately retained while its relationship to another paper is resolved. No source or OneDrive files were deleted. Each listed record links to an inspected manuscript copy in OneDrive. The newest author-approved version remains visibly unconfirmed. This is a provisional inventory, not a claim that every manuscript or present status has been confirmed.

The owner authorized publication of inspected abstracts and labeled summaries: 17 abstracts and one summary for an empty Abstract section. MS-0007 uses the owner-selected Word render dated April 16, 2026; its current OneDrive version and relationship to MS-0003 remain unconfirmed. Expand “Read abstract” or “Read source-grounded summary” on a card; keyword search includes this text.

No full manuscript text/files, reviewer letters, local source paths, raw research data, access-granting sharing URLs, analytics, cookies or browser storage are included. Search-engine directives do not make the page private.

## Run locally

Use Node 22 or later and the pinned development dependencies. The website has no runtime package dependencies or external fonts.

```sh
npm ci --ignore-scripts
npx playwright install chromium
npm run check
npm run build:public
npm run preview:public
```

Local and CI tests use the Chromium version pinned to Playwright, rather than a separately updated system Chrome. `PLAYWRIGHT_BROWSERS_PATH` may point to a task-local browser cache. The loopback-only preview is at port 4173. `npm run build` and `npm run preview` instead use six synthetic fixtures. Relative asset paths support the GitHub Pages project subpath. Build-derived version parameters keep HTML, CSS, module imports, schema validation and JSON requests consistent across browser caches. The preview server serves only allowlisted site files.

## Data and maintenance

- `data/public-manuscripts.json`: reviewed public release metadata.
- `data/manuscripts.json`: synthetic examples used by behavioral tests.
- `schema/manuscripts.schema.json`: strict record schema.
- `lib/schema-validator.mjs`: generated Ajv browser/CLI validator.
- `lib/records.mjs`: semantic checks, history validation, search and status/date rules.
- `scripts/build.mjs`: separate public, synthetic and local confidential builds.
- `.github/workflows/validate.yml`: validation, accessibility/mobile checks and Pages deployment from `main` only.

Follow [Maintaining the register](docs/MAINTAINING.md), [Field dictionary](docs/DATA-DICTIONARY.md), [Hosting](docs/HOSTING.md), [Project status](docs/PROJECT_STATUS.md) and [Verification](docs/VERIFICATION.md). Primary maintainer and backup still require assignment; authorship does not imply either role.

Keep full source receipts, local paths and confidential history outside this repository. A separate confidential input can be validated and previewed with `--private-local --out` pointing to a dedicated directory outside the repository. It cannot be built into the public artifact.

## Release

The Pages workflow checks the application, builds `dist/public`, and uploads that directory alone. A private local preview is never a deployment source. Public deployment requires an explicit `--public` build of a `public_metadata` dataset. Changes on pull requests are tested but not deployed. Open any PR as a draft.

The interface uses the official red/black CECREH artwork, a neutral paper background, Georgia headlines, readable status labels, search and expandable cards. The header and cache-safe `cecreh-favicon-red-a473da1c.png` reuse the exact [CECREH logo](https://github.com/CECREH/cdbg-dr-atlas/blob/main/cecreh-logo.png), SHA-256 `a473da1cfcdef681f28b9228d47d07ce1db7a960cf8f2e9a949f0bdd732e4d8a`. No artwork was redrawn. The grants repository is unchanged.

## Uploaded manuscript copies

All 18 listed records have a prominent “Open uploaded copy” link: 15 Word, two PDF and one Markdown draft. All 19 uploaded files remain on OneDrive, including the privately retained ambiguous record. These are resource links to the inspected copies uploaded to the selected TTU OneDrive folder. Each opened as the signed-in owner/editor, and initial anonymous requests redirected to Microsoft sign-in. A subsequent unsigned check was denied with HTTP 403 before the sign-in page; no file content was returned. Existing file/folder permissions apply; no sharing links or access grants were created. Parent-folder inheritance means the observed direct-member list is not a complete audience census.

Link destination checks do not establish the newest author-approved version. `supportingLinks.kind: manuscript` distinguishes an available inspected copy from `currentDraft`, whose canonical/current-version confirmation remains unresolved. MS-0007 retains the selected April 16, 2026 Word render; all scope, status and submission-history uncertainties remain.
