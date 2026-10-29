# CECREH manuscript register

A responsive, read-only register of manuscript metadata: scope, writing stage, journal state, observed byline, local-version evidence, current draft links and next actions. Writing and journal status are separate. Pending-scope records stay outside the confirmed-scope count.

The owner approved a **public metadata tracker** with `noindex, nofollow` and no inbound navigation links added elsewhere. Manuscript files remain separate on OneDrive. The initial release has **19 records: 7 supported by a dated CECREH inventory and 12 awaiting scope or identity confirmation**. Every current OneDrive link is visibly unresolved. This is a provisional inventory, not a claim that every manuscript or present status has been confirmed.

No manuscript text, reviewer letters, local source paths, raw research data, protected sharing URLs, analytics, cookies or browser storage are included. Search-engine directives do not make the page private.

## Run locally

Use Node 22 or later and the pinned development dependencies. The website has no runtime package dependencies or external fonts.

```sh
npm ci --ignore-scripts
npm run check
npm run build:public
npm run preview:public
```

The loopback-only preview is at port 4173. `npm run build` and `npm run preview` instead use six synthetic fixtures. Relative asset paths support the GitHub Pages project subpath. The preview server serves only allowlisted site files.

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

The interface follows the existing CECREH grants visual conventions: paper background, teal identity mark, Georgia headline, readable status cues, search and expandable cards. The grants repository is unchanged.
