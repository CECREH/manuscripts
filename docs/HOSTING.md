# Hosting and publication boundary

## Approved release

On October 29, 2026 the owner explicitly approved public manuscript tracker metadata on the CECREH GitHub site, requested a search-engine noindex flag, and directed that the tracker not be linked elsewhere in repository navigation. Manuscript files remain on OneDrive. This supersedes the October 26 private-hosting hold.

The destination is a separate public `CECREH/manuscripts` repository and its GitHub Pages project site. Do not change other repository permissions, invite collaborators, add credentials, install authentication services or use another host. No grants-site, organization-profile, or atlas navigation changes are part of this release.

`<meta name="robots" content="noindex, nofollow">` is shipped in the HTML. It asks compliant search engines not to index the page. The site and the public repository remain readable by anyone; JSON and historical commits are public too. No password-in-JavaScript, hidden URL or robots rule is treated as protection.

## Contents

Publish only reviewed titles and status metadata, observed bylines, source/version dates, scope caveats and suggested next actions. Do not publish manuscript bodies, internal research/reviewer notes, participant data, file-system paths or credentials.

The initial release publishes no manuscript URLs. Each link is unresolved until the owner or steward verifies the current OneDrive version and its existing intended audience. Never assume that a sharing link requires sign-in or is view-only. Do not broaden OneDrive sharing. Add a `publicLinkReviews` entry only after reading the destination and access settings. Current-draft URLs must additionally have current-version confirmation and append-only history.

## Deployment and verification

1. Validate and compare public data against the prior released JSON; preserve IDs and history.
2. Run `npm run check`. Inspect the public desktop and narrow-screen screenshots.
3. Commit only application code, reviewed public metadata and public documentation.
4. Push `main`. The workflow builds and uploads only `dist/public`; pull requests never deploy.
5. Verify the remote commit, successful Pages deployment and live page/data. Confirm the robots meta directive, record counts, no manuscript files and no unexpected external requests.
6. Compare the grants, organization-profile and other existing CECREH repository heads to the pre-release snapshot. Do not add inbound links or set a repository homepage URL.
7. Update project status and verification documentation with completed work, evidence and remaining tasks.

Local confidential previews stay outside this repository and are not publishable. The build gates enforce dataset separation; human review still determines whether individual metadata and links are appropriate to publish.

Implementation references: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [Pages REST API](https://docs.github.com/en/rest/pages/pages). The successful workflow and live checks, rather than configuration alone, establish this release's deployment state.
