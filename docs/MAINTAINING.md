# Maintainer and backup runbook

The operational dataset has no assigned primary maintainer or backup yet. Confirm both people explicitly and enter them under `maintenance`. The primary maintains the structured records; the backup verifies meaningful changes and takes over when needed. No email ingestion or automatic manuscript discovery runs.

## Establish scope before promoting a candidate

Ask the manuscript team whether the paper belongs in CECREH's inventory. Keep a unique, permanent `MS-0001` style ID. Titles and tags may change without changing the ID. Two papers with related topics remain separate unless the team explicitly establishes identity; this system has no merge operation.

Candidates appear in **Pending scope** and do not count as confirmed active manuscripts. Set `scope.status` to `confirmed` only with a named confirmer and confirmation date. A confirmed manuscript can still have an unresolved draft link. Do not infer author order, journal, submission state, lead, action owner, or an agreed deadline from a mention in an email or an old draft.

The initial candidates are a bounded handoff, not a claim of complete coverage. Grant proposals, reviewer assignments, and explicitly non-CECREH papers remain excluded. Use the confidential local handoff for specific candidate questions, never the synthetic demo.

## Update one paper

1. Make a local backup of the operational JSON in the approved confidential location, outside this repository. Preserve the prior file for comparison.
2. Ask the steward to confirm the canonical current draft, version label/date, writing stage, journal state, next action, action owner, and any agreed due date. Verify protected draft access using the steward's authorized account. The tracker itself does not fetch or inspect links.
3. Edit the operational JSON. Use `null` for unknown values. Do not set a confirmation date merely because you entered the record today. `confirmation.recordReviewedOn` is the entry/review date; `sourceCheckedOn` is when the underlying evidence was checked. Draft, writing, journal, and scope each have their own confirmations.
4. Set `nextAction.status` to `proposed` for suggested work and `agreed` only after agreement. `dueStatus: proposed` is a target, not a deadline. An agreed due date requires an agreed action, an owner, and the agreement date. Unknown dates stay null.
5. When the canonical URL changes, append a new `history.linkChanges` event with a unique event ID, recorded date, URL, version label, and reason. Retain previous events. To clear a link, append a new event with `url: null` and a reason, then make the draft unavailable or unconfirmed. A reverted link is also a new event.
6. Append submission/decision events to `history.submissions` when evidence exists. Never infer submission from internal revision. Keep dates or journal names null when unknown. Preserve earlier events; explain corrections in a new event rather than rewriting history.
7. Record blockers with unique IDs and reported dates. A lack of recorded blockers does not prove a paper is unblocked. Mark a blocker resolved only with a resolution date. Archive a confirmed paper with `inventoryState: archived` when appropriate; retain its stable ID and history.
8. Run the validation and comparison below, then rebuild the local preview. Ask the backup to review the diff, source evidence, and displayed state. Keep sensitive diffs and screenshots inside the approved audience.

```sh
node scripts/validate.mjs ../private-data/manuscripts.json --previous ../private-data/manuscripts.previous.json
node scripts/build.mjs --data ../private-data/manuscripts.json --private-local --out ../private-preview
node scripts/serve.mjs --root ../private-preview --port 4174
```

The comparison detects deleted IDs, rewritten history, and canonical-link changes without a new event. It does not establish that a human actually confirmed a statement; the maintainer remains responsible for evidence.

## Regular review and backup

Review the pending queue, missing draft links, unresolved ownership, open blockers, agreed overdue actions, and stale source/version confirmations on the team's chosen cadence. The default 30-day stale threshold is a configurable review aid, not a deadline. Unknown confirmations are labeled unconfirmed, not current. Dates use UTC calendar days.

Keep one authoritative operational JSON and retain versioned backups in approved confidential storage. Until the remote privacy gate is satisfied, do not use a Git remote for those records. The backup should know where the authoritative file lives, how to restore it, and how to run the preview. Compare a restored file against the last accepted version and inspect the interface before continuing work.

For code changes, use a branch in the eventual private repository and a **draft** PR. Run `npm run check`. CI contains synthetic data only and never deploys. Do not paste protected links or manuscript metadata into issue/PR text, CI logs, or screenshots with unverified audiences.

## Failure recovery

- Invalid JSON or schema: the UI shows a load error and no partial records. Run the validator, correct the flagged path, and retry.
- A stale or unavailable link: keep the last-known URL in history and visibly unresolved; never guess a replacement or silently label it current.
- Accidental disclosure: stop further publication, inform the owner through an authorized channel, and follow their incident procedure. Changing a repository to private does not retract prior downloads or caches.
- Hosting changes: rerun the access checks in [HOSTING.md](HOSTING.md) before exposing new metadata. A privacy label in HTML is informational and cannot enforce access.
