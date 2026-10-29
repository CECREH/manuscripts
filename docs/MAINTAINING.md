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
5. Before publishing a link, inspect its destination and existing sharing audience without changing access. Record `publicLinkReviews` with URL, check date and a non-sensitive audience note. Require `currentDraft.status: confirmed` with confirmation evidence for a current-draft URL. Keep unverified links null. Old confidential links stay in the private evidence ledger until appropriate for public disclosure.
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
