# CECREH manuscript register

A responsive, read-only static register for unpublished manuscripts. Overview counts, search, writing/journal/person filters, agreed-date sorting, and expandable details make the current draft and next action easy to find. Candidate manuscripts stay in their own queue until their CECREH scope is confirmed.

**Publication is blocked pending a hosting decision.** The October 26, 2026 read-only GitHub organization check returned `plan: free` and `default_repository_permission: read`. GitHub Free cannot privately publish this project with GitHub Pages. A private source repository does not make Pages private. No remote repository, Pages configuration, or deployment was created. See [Hosting decision](docs/HOSTING.md).

This source tree contains **synthetic demo data only**. Six fictional examples demonstrate active, candidate, and archived records; they are not CECREH's inventory. Real candidate metadata belongs in a sibling private-data folder outside this repository. Never copy operational records into `data/manuscripts.json` while publication boundaries remain unverified.

## Preview the safe demonstration

Node 22 or later is recommended. The website itself has no runtime package dependencies, external fonts, analytics, cookies, browser storage, or automatic draft-link checks. Pinned development tools validate the schema and test the interface.

```sh
npm ci --ignore-scripts
npm run schema
npm run validate
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/`. The preview server binds only to loopback and serves an explicit asset allowlist. It does not serve source, tests, documentation, or sibling private data. The static build is `dist/demo/`. Its relative paths also work at a GitHub Pages project subpath.

## Validate and inspect local confidential records

```sh
node scripts/validate.mjs ../private-data/manuscripts.json
node scripts/build.mjs --data ../private-data/manuscripts.json --private-local --out ../private-preview
node scripts/serve.mjs --root ../private-preview --port 4174
```

Open `http://127.0.0.1:4174/` only on the local computer. This preview is confidential and must not be uploaded. The build refuses confidential data without the explicit local flag, refuses confidential output inside the source repository, and keeps private preview files restricted to the local owner. Local labels and file permissions are not a substitute for verified remote access controls.

## Maintain the register

Assign one primary maintainer and one backup before operational use. Neither role is inferred from manuscript authorship. Follow [Maintainer runbook](docs/MAINTAINING.md) and the [Field dictionary](docs/DATA-DICTIONARY.md).

- `schema/manuscripts.schema.json` is the authoritative record schema, with strict fields and enumerated states.
- `lib/schema-validator.mjs` is generated using Ajv and bundled for offline browser validation. `lib/records.mjs` adds semantic rules, history checks, filters, and date logic.
- `data/manuscripts.json` is always the fictional demonstration in this repository.
- `scripts/build.mjs` emits only the static asset allowlist. There is no publish command or Pages workflow.
- `tests/` checks uncertainty, IDs/history, privacy boundaries, behavior, mobile layouts, accessibility, and failure states.

Unknown values remain `null` or `unconfirmed`. The record-entry date never substitutes for a source or version confirmation. Staleness is calculated against today's UTC date and the configured 30-day threshold. Suggested actions and proposed dates are labeled; only agreed deadlines can become overdue. Each paper has a stable ID, independent of its title or topic. No author order is recorded or inferred.

## Verification

```sh
npm test
npm run build
npm run test:ui
```

Local browser tests use the installed Google Chrome in a fresh context. On Linux CI, `npx playwright install --with-deps chromium` installs the pinned Playwright browser. `npm run check` runs the complete validation and test sequence. The workflow performs checks only; it never deploys or uploads screenshots. Screenshots under `artifacts/` and test reports are ignored by Git and contain synthetic examples only.

The visual system follows [CECREH/grants](https://github.com/CECREH/grants): muted paper background, dark teal C mark, Georgia headline, green/gold status cues, searchable card register, and expandable source details. This is a separate application; the grants repository was only read.

## Boundaries

Do not store manuscripts, raw research data, reviewer letters, credentials, or hidden secrets in site assets. Protected draft URLs are confidential metadata. Grant proposals, journal referee work, and work outside CECREH scope do not belong in this inventory. Similar topics do not establish that two papers are the same manuscript. Do not add access grants, credentials, external hosting, or a public version without the required owner decision.
