# CECREH manuscript tracker

The owner authorized public tracker metadata on October 29, 2026, with a search-engine `noindex` flag and no links added to other CECREH repository navigation. That explicit approval supersedes the earlier private-hosting hold.

- Never edit CECREH/grants, the organization profile, or another repository for this tracker. Do not add inbound navigation links or a repository homepage link.
- Publish only the reviewed `data/public-manuscripts.json` dataset and allowlisted application assets. Keep `data/manuscripts.json` synthetic for tests. Do not copy private evidence, manuscript files/text, internal review notes, local paths, emails, raw research data or secrets into Git.
- Manuscript files belong on OneDrive. Do not create or change sharing permissions. A public draft link requires a verified current destination and a recorded review of its existing audience. Unresolved links stay null.
- This is a public site. `noindex` requests search-engine exclusion; it is not access control and does not protect the public repository or its JSON.
- Preserve stable manuscript IDs and append-only canonical-link/submission histories. Topic similarity never establishes manuscript identity.
- Unknowns stay null or unconfirmed. Byline observations are not assigned leads, and historical source dates are not current confirmations. Keep proposed and agreed deadlines distinct.
- Update schema, validator, field dictionary, tests and project documentation together. Run `npm run check` after functional changes. Record what is completed and what remains.
- Do not add analytics, browser persistence, email ingestion, a database, credentials, access grants or external hosts. Any PR must be a draft.
