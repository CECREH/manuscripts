# Maintainer and backup runbook

Assign one primary maintainer and one backup in `maintenance`. Neither role is inferred from bylines. The primary edits records; the backup reviews evidence, version changes and the release diff. No automatic ingestion runs.

## Scope and identity

Keep permanent `MS-0001` style IDs. A title change does not change identity. Related topics never justify merging papers. The first release preserves the original five IDs and records newly discovered drafts separately. Seven scope memberships are supported by a June 5 inventory; they require refresh. Twelve other records remain pending scope or identity confirmation. Do not claim that the register includes every manuscript.

Exclude grant proposals, journal referee assignments, literature corpora, templates, study protocols without drafted papers, published work and explicitly non-CECREH manuscripts. Keep an evidence-backed exclusion ledger privately.

## Update a record

1. Save the prior public JSON outside the checkout for comparison. Retain full local source receipts and confidential history separately; never copy them into this public repository.
2. Confirm scope, current OneDrive version, writing stage, journal status, byline, lead/steward and next action with the appropriate source. A byline in an old file is an observation, not a confirmed current author list or assigned role.
3. Edit `data/public-manuscripts.json`. Unknown values stay null/unconfirmed. `recordReviewedOn` is the record review date; `sourceCheckedOn` is the inspection date. Historical `reportedOn` dates stay historical. Do not turn file modification times into reported status dates.
4. A local file can be `canonical`, a `candidate`, or in `conflict`. Record a safe version label in `localVersion`; never expose its local path. A canonical local source is not proof of the latest OneDrive file.
5. Before publishing a link, inspect its destination and existing sharing audience without changing access. Record `publicLinkReviews` with URL, check date and a non-sensitive audience note. Require `currentDraft.status: confirmed` with confirmation evidence for a current-draft URL. An inspected uploaded copy may instead use `supportingLinks.kind: manuscript` with a checked destination/date and version label while `currentDraft` remains unresolved. Only one uploaded copy is featured per record; retain a superseded copy as a labeled `reference` link if replacing it. Link checking is not author-version confirmation. Keep unverified links null. Old confidential links stay in the private evidence ledger until appropriate for public disclosure.
6. Append `history.linkChanges` when a published canonical link changes or is cleared. Retain prior events. Append submission/decision events only when supported; dates/journal names stay null when unknown. An assembled submission bundle is not evidence of submission.
7. Suggested actions use `status: proposed`. Only an agreed action with an owner and agreement date may have `dueStatus: agreed`. A journal recommendation is not automatically an agreed team deadline. Record its basis distinctly.
8. Only publish blockers and supporting links cleared for this public audience. Keep internal review notes private. An empty blockers list does not assert that a manuscript is unblocked.
9. Validate history, run the checks, inspect the build, and have the backup review the diff. A main-branch push deploys automatically after checks pass. Any review PR should be a draft.

```sh
node scripts/validate.mjs data/public-manuscripts.json --previous /path/to/prior-public-manuscripts.json
npm run check
npm run build:public
npm run preview:public
```

The prior-public file must be the previous public release, not the confidential dataset: confidential history may contain links that were never published. Keep the confidential ledger append-only independently.

## Review and recovery

Review pending scope, missing links, unassigned roles and stale confirmations on the team's chosen cadence. The 30-day threshold is a review aid, not an agreed deadline. Source, scope, writing and journal evidence can age independently.

Invalid data fails closed with no partial records displayed. Fix the validator's reported field and retry. Preserve unavailable or superseded public links in history and label uncertainty. Restore from an accepted commit if needed; compare IDs and histories before redeploying. If confidential information is accidentally published, stop further publication and follow the owner's incident procedure; deletion does not retract previous downloads.

After every completed task, update `docs/PROJECT_STATUS.md`, `docs/VERIFICATION.md` and the change log with what changed, what was checked, and what remains.

## Abstracts and summaries

Inspect the recorded authoritative local source and its project documentation. Check metadata, companion files and the designated editorial master before declaring an abstract absent. Preserve the source abstract's language, with presentation-only normalization of line wrapping or simple markup. Keep exact source paths and hashes in the private evidence ledger.

If an inspected manuscript has no abstract, write a short summary grounded in its actual body, label it `summary`, and set `abstractPresence: absent_in_inspected_source`. Do not summarize from a title alone. If the source is unavailable or its identity/content cannot be verified, use `unresolved` with null text and source-check date. Do not replace an unresolved source with an invented summary.

Set a safe source label, version label, inspection date and a note about version limits for published text. Publication authorization covers abstracts and these labeled summaries, not full manuscript files, other body sections, internal reviews or private paths. A locally inspected abstract does not confirm the latest OneDrive version. Retain current-version uncertainty and existing permissions; an inspected uploaded copy can be linked separately from a confirmed current draft.
