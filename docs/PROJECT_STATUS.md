# Project status

Updated October 29, 2026.

## Completed

- Separate static tracker implemented with search, stage/journal/person filters, sorting, overview counts, expandable details and separate scope-confirmation queue.
- Local drive and synced OneDrive inventory performed. Nineteen records were reconciled; seven are supported by a dated CECREH inventory, twelve await scope or identity confirmation. The original five IDs are preserved.
- Observed bylines and local authority/version evidence are distinct from lead assignments and current OneDrive confirmations. Historical writing and journal evidence is dated and flagged when stale.
- Public metadata dataset separated from synthetic fixtures and confidential source receipts/history. No full manuscripts, protected URLs, internal review notes or local paths are in the release. The owner subsequently authorized abstracts and labeled summaries.
- Public build includes noindex/nofollow. The deployment uploads only allowlisted public assets. No inbound navigation additions are made to other CECREH repositories.
- Schema validation, history checks, accessibility/mobile tests and documented maintainer/backup workflow are implemented.

- Abstract enhancement published and verified: 17 source abstracts, one grounded summary for an empty Abstract section, and one unresolved source-title conflict. Source labels, version labels and inspection dates accompany the text. Search includes descriptions.

## Release state

**Live and verified.** The public Pages site is `https://cecreh.github.io/manuscripts/`, hosted from the separate `CECREH/manuscripts` repository. Initial release commit: `87450e31aab119addd32a5b4df84f57b6705fa91`; validation and deployment run `40797452308` succeeded. Anonymous HTTP checks and a live browser check confirmed the released data, working interface and noindex/nofollow directive. Existing grants, organization-profile and atlas heads/homepages are unchanged.

The abstract enhancement is live from commit `eae10c8b61ccb952e7c3e2ef3a75ebf48db03e11`; [validation and deployment run 40799927372](https://github.com/CECREH/manuscripts/actions/runs/40799927372) succeeded with 15 data/build tests and 21 browser tests. Anonymous asset hashes match the tested build. Live search, abstract and summary disclosures, source labels and the unresolved-content warning were checked. All 19 draft URLs remain unresolved; the source inspection does not confirm the current shared version.

The owner explicitly deferred completing manuscript links: “We can get all the links working later. Get the website working for now.” Link work is therefore remaining maintenance, not a release blocker. No OneDrive permissions were changed.

## Remaining

- Deferred by owner: verify the current OneDrive destination and intended access boundary for each of the 19 records; no public manuscript links are released yet.
- Assign one maintainer and one backup, plus manuscript leads/stewards and next-action owners.
- Refresh the seven dated CECREH scope memberships; resolve the other twelve candidates.
- Reconcile the audit-protocol/financial-implementation identity and source-title conflict without merging by topic; MS-0007 abstract/summary remains unresolved.
- Confirm current author lists and journal states with the manuscript teams. Local submission records are historical evidence, not a live portal check.
- Confirm any agreed action dates. No team deadlines are inferred. The ASAPP record separately notes its source-reported journal recommendation.
- Continue discovery as new manuscripts are identified; this inventory is provisional.

Manuscript source projects were read only. No analyses were rerun and no manuscript source content was edited. Only the explicitly authorized abstracts and labeled summary were copied/written into the tracker.
