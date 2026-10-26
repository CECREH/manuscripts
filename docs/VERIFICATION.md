# Verification record

Verified locally on **October 26, 2026** with Node 22.20.0, pinned development dependencies, and an isolated installed-Chrome browser context.

`npm run check` completed successfully:

- Schema compilation and synthetic-data validation passed.
- **11 Node tests passed:** empty inventories, strict fields, duplicate IDs, real dates, URL safety, confirmation coupling, proposed/agreed deadlines, stale sources, combined filters, sorting, append-only history, link removal, and build privacy boundaries.
- **15 browser tests passed:** overview and details, filters and sorting, candidate/archive isolation, 390px and 320px layouts without horizontal overflow, keyboard skip/disclosure/reset behavior, empty/candidate-only inventories, stalled/HTTP/JSON/schema failures and retry, safe text rendering, link referrer protection, no third-party requests or browser persistence, and project-subpath serving.
- Axe scans using WCAG 2 A/AA, 2.1 AA, and 2.2 AA tags reported **zero violations in the tested states**. These automated scans do not constitute a complete accessibility audit; VoiceOver and cross-browser testing were not performed.
- Desktop and mobile screenshots were inspected after correcting a screenshot-only offscreen skip-link artifact. No manuscript content or private metadata appears in the demo screenshots.

Screenshots are generated locally under the Git-ignored `artifacts/` directory:

| File | View |
| --- | --- |
| `desktop-overview.png` | 1440px desktop register |
| `desktop-details.png` | Expanded draft/source/history details |
| `candidate-queue.png` | Separate pending-scope queue |
| `mobile-390-top.png` | 390 × 844 first viewport |
| `mobile-390.png` | 390px full page with expanded details |
| `mobile-320-top.png` | 320 × 844 first viewport |
| `mobile-320.png` | 320px full page with expanded details |

The local confidential build also passed schema validation and a separate loopback-only smoke check: inventory separation, preservation and labeling of the supplied last-known URL, no external network requests, and 390px reflow. No protected draft was opened and no private screenshot was created. Operational counts and evidence are recorded in the sibling private handoff, outside this repository.

The publishable source was scanned for protected SharePoint URLs and the specific private candidate names/aliases; none were found. Only the synthetic dataset is included in source control. The private input and preview directories are outside the repository and use owner-only local permissions.

There is **no remote manuscript repository, remote commit, or site from this task**. No signed-out remote access test was possible. Hosting is pending the owner decision documented in [HOSTING.md](HOSTING.md); no site privacy claim is made. The GitHub check workflow has been authored but has not run remotely.
