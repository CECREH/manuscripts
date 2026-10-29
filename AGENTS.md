# CECREH manuscript tracker

The owner authorized public tracker metadata on October 29, 2026, with a search-engine `noindex` flag and no links added to other CECREH repository navigation. The subsequent request explicitly authorizes manuscript abstracts, or labeled source-grounded summaries when an inspected source has no abstract. That approval supersedes the earlier private-hosting hold and the blanket manuscript-text restriction for these short descriptions only.

- Never edit CECREH/grants, the organization profile, or another repository for this tracker. Do not add inbound navigation links or a repository homepage link.
- Publish only the reviewed `data/public-manuscripts.json` dataset and allowlisted application assets. Keep `data/manuscripts.json` synthetic for tests. Approved abstracts/summaries must record their inspected source/version and check date; unavailable or unverified content stays unresolved. Do not copy private evidence, full manuscripts, other manuscript body text, internal review notes, local paths, emails, raw research data or secrets into Git.
- Reviewed uploaded-copy links may use `supportingLinks.kind: manuscript` with a real destination-check date and public access-review receipt. Keep current-author-version uncertainty explicit; this does not permit inventing `currentDraft` confirmation.
- Manuscript files belong on OneDrive. Do not create or change sharing permissions. A public draft link requires a verified current destination and a recorded review of its existing audience. Unresolved links stay null.
- This is a public site. `noindex` requests search-engine exclusion; it is not access control and does not protect the public repository or its JSON.
- Preserve stable manuscript IDs and append-only canonical-link/submission histories. Topic similarity never establishes manuscript identity.
- Unknowns stay null or unconfirmed. Byline observations are not assigned leads, and historical source dates are not current confirmations. Keep proposed and agreed deadlines distinct.
- Update schema, validator, field dictionary, tests and project documentation together. Run `npm run check` after functional changes. Record what is completed and what remains.
- Do not add analytics, browser persistence, email ingestion, a database, credentials, access grants or external hosts. Any PR must be a draft.

- The owner replaced scope tabs with one list of distinct papers. Compare source substance and documented lineage before adding a separate entry. Keep ambiguous identities privately, with exact prior records and all stable IDs/history preserved; never remove OneDrive files or merge by topic. See docs/IDENTITY-AUDIT.md.
