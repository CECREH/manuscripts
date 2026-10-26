# Record dictionary

The executable contract is [manuscripts.schema.json](../schema/manuscripts.schema.json), schema version 1. All listed object properties are required; optional facts use JSON `null`. Unknown properties are rejected. Dates are real ISO `YYYY-MM-DD` calendar dates. Evidence dates cannot be later than the snapshot; due dates may be future dates. Links require HTTPS without embedded credentials.

| Field | Meaning and allowed values |
| --- | --- |
| `schemaVersion` | Exactly `1`. Change deliberately with a migration if the shape changes. |
| `dataClass` | `synthetic_demo` or `confidential`; controls the build gate and UI notice. It is a label, not an access control. |
| `snapshotDate` | Date of this data snapshot, no later than today. Does not re-confirm old evidence. |
| `staleAfterDays` | Integer 1–365; currently 30. Confirmation becomes stale after more than this many UTC days. |
| `coverageNote` | A plain statement of the inventory's limits. Never imply complete coverage without evidence. |
| `maintenance.primary`, `.backup` | Named roles or null. No implicit assignment. |
| `records` | Array of independent manuscript records; may be empty. |
| `id` | Stable unique `MS-0001` identifier. Demo records use `DEMO-0001`. Never recycle IDs or derive identity from topic. |
| `title`, `shortTitle`, `tags` | Current descriptive title, optional alias, and unique search tags. No author order. |
| `scope.status` | `candidate` or `confirmed`. Confirmed scope requires `confirmedOn` and `confirmedBy`; candidate confirmations stay null. `note` records scope limits. |
| `inventoryState` | `active` or `archived`. Candidate scope always renders in the separate pending queue. Confirm scope before archiving. |
| `writing.stage` | `unconfirmed`, `planning`, `analysis`, `drafting`, `internal_revision`, `coauthor_review`, `ready_to_submit`, `journal_revision`, `complete`, `paused`. |
| `writing.confirmedOn`, `.confirmedBy`, `.note` | Confirmation date/person as a pair, or both null; explanatory note may be null. A known stage without confirmation is shown as reported/currently unconfirmed. |
| `journal.status` | `unconfirmed`, `not_submitted`, `submitted`, `under_review`, `revision_requested`, `accepted`, `published`, `withdrawn`, `rejected`. Independent of writing stage. |
| `journal.name`, `.confirmedOn`, `.confirmedBy`, `.note` | Journal name and evidence; null where unknown. No inferred journal selection. |
| `lead`, `steward` | Manuscript lead and metadata steward, individually nullable. They do not specify authorship order. |
| `currentDraft.url` | Canonical or last-known protected URL, or null. Confidential even if the document separately requires sign-in. |
| `currentDraft.status` | `confirmed`, `unconfirmed`, or `unavailable`. Confirmation requires a URL, person, and date. Unavailable means no current URL. |
| `currentDraft.versionLabel`, `.versionDate` | Human-readable label and document version date, distinct from its confirmation date. |
| `currentDraft.confirmedOn`, `.confirmedBy`, `.note` | Confirmation of the current version; note explains gaps. A stale confirmation renders “last-confirmed draft.” An unconfirmed URL renders “last-known draft.” |
| `nextAction.text`, `.status`, `.owner` | Action and owner; status is `unconfirmed`, `proposed`, or `agreed`. Unknown action text is null; suggestions are explicitly labeled. |
| `nextAction.dueDate`, `.dueStatus`, `.agreedOn` | Due basis is `unconfirmed`, `proposed`, or `agreed`. Unknown due date is null. Agreed requires an agreed action, owner, and agreement date. Only an agreed past date is overdue. |
| `blockers[]` | `id` (`B-…`), `text`, `status` (`open`/`resolved`), `recordedOn`, `resolvedOn`. Resolved status requires a resolution date. Empty means none recorded, not proven absent. |
| `supportingLinks[]` | `label`, `url`, `kind` (`project`, `analysis`, `supplement`, `reference`, `other`), `confirmedOn`. Links only; no attachments or manuscripts. |
| `confirmation.sourceCheckedOn` | Date underlying source evidence was verified. Null is unconfirmed. Drives the source stale flag. |
| `confirmation.sourceLabel`, `.recordReviewedOn`, `.note` | Evidence description, date the register entry was reviewed, and evidence limits. Entry date does not refresh source confirmation. |
| `history.linkChanges[]` | Append-only `eventId` (`L-…`), `recordedOn`, `url` (nullable for clearing), `versionLabel`, `reason`. Chronological recorded-date order; latest URL must match the canonical URL when present. |
| `history.submissions[]` | Append-only `eventId` (`S-…`), `eventDate` (nullable), `journal` (nullable), `status`, `note`, `sourceLabel`. Status: submitted, under_review, revision_requested, resubmitted, accepted, published, withdrawn, rejected. |

“Needs attention” includes an unconfirmed current draft, a stale draft confirmation, an unconfirmed/stale source, an open blocker, or an overdue agreed action. Overview attention/draft counts include confirmed active records and pending candidates, and exclude the archive. Filtered result counts are separate. The archive never inflates the active count.

Sorting by agreed due date puts undated/proposed actions last. Sorting by source confirmation puts unconfirmed sources first, then oldest confirmed dates. The app never stores search terms in a URL or persistent browser storage.
