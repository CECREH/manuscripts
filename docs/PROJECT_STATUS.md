# Project status

Updated October 29, 2026.

## Completed

- Separate static tracker implemented with search, stage/journal/person filters, sorting, overview counts, expandable details and separate scope-confirmation queue.
- Local drive and synced OneDrive inventory performed. Nineteen records were reconciled; seven are supported by a dated CECREH inventory, twelve await scope or identity confirmation. The original five IDs are preserved.
- Observed bylines and local authority/version evidence are distinct from lead assignments and current OneDrive confirmations. Historical writing and journal evidence is dated and flagged when stale.
- Public metadata dataset separated from synthetic fixtures and confidential source receipts/history. No full manuscripts, protected URLs, internal review notes or local paths are in the release. The owner subsequently authorized abstracts and labeled summaries.
- Public build includes noindex/nofollow. The deployment uploads only allowlisted public assets. No inbound navigation additions are made to other CECREH repositories.
- Schema validation, history checks, accessibility/mobile tests and documented maintainer/backup workflow are implemented.

- Abstracts and summary: 18 source abstracts and one grounded summary for an empty Abstract section. MS-0007 now uses the owner-selected Word render dated April 16, 2026; source synchronization and manuscript identity remain separate unresolved questions. Source labels, version labels and inspection dates accompany the text. Search includes descriptions.

## Release state

**Live and verified.** The public Pages site is `https://cecreh.github.io/manuscripts/`, hosted from the separate `CECREH/manuscripts` repository. Initial release commit: `87450e31aab119addd32a5b4df84f57b6705fa91`; validation and deployment run `40797452308` succeeded. Anonymous HTTP checks and a live browser check confirmed the released data, working interface and noindex/nofollow directive. Existing grants, organization-profile and atlas heads/homepages are unchanged.

The initial abstract enhancement was published in commit `eae10c8b61ccb952e7c3e2ef3a75ebf48db03e11`; [validation and deployment run 40799927372](https://github.com/CECREH/manuscripts/actions/runs/40799927372) succeeded with 15 data/build tests and 21 browser tests. All 19 draft URLs remain unresolved; source inspection does not confirm the current shared version.

The owner subsequently selected the MS-0007 Word abstract and explicitly authorized publishing it. Its version date comes from the April 16, 2026 embedded document metadata, not the June 6 distribution copy. The selected abstract and its provenance passed 15 data/build tests and 22 browser tests and are ready for deployment; the release result will be recorded after live verification.

The owner explicitly deferred completing manuscript links: “We can get all the links working later. Get the website working for now.” Link work is therefore remaining maintenance, not a release blocker. No OneDrive permissions were changed.

## Remaining

- Deferred by owner: verify the current OneDrive destination and intended access boundary for each of the 19 records; no public manuscript links are released yet.
- Assign one maintainer and one backup, plus manuscript leads/stewards and next-action owners.
- Refresh the seven dated CECREH scope memberships; resolve the other twelve candidates.
- Reconcile the audit-protocol/financial-implementation identity and source synchronization without merging by topic. Selecting the MS-0007 Word abstract does not resolve its relationship to MS-0003 or establish the current OneDrive version.
- Confirm current author lists and journal states with the manuscript teams. Local submission records are historical evidence, not a live portal check.
- Confirm any agreed action dates. No team deadlines are inferred. The ASAPP record separately notes its source-reported journal recommendation.
- Continue discovery as new manuscripts are identified; this inventory is provisional.

Manuscript source projects were read only. No analyses were rerun and no manuscript source content was edited. Only the explicitly authorized abstracts and labeled summary were copied/written into the tracker.
