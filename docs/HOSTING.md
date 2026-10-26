# Hosting decision and access gate

Status as of **October 26, 2026**: local build only. No source was pushed, no repository was created, and no site was published. CECREH/grants was not modified.

## Verified evidence

The authenticated, read-only GitHub CLI query was:

```sh
gh api orgs/CECREH --jq '{login,plan: .plan.name,default_repository_permission,members_can_create_private_repositories}'
```

It returned:

```json
{"default_repository_permission":"read","login":"CECREH","members_can_create_private_repositories":true,"plan":"free"}
```

The GitHub connector returned a public `CECREH/grants` repository on `main`, with admin permission for the connected account. Its root was inspected for instructions and visual conventions; no AGENTS.md or .agents directory appeared in that root listing. `CECREH/manuscripts` returned 404 through that connector. A 404 is not a complete audit of organization repositories or audiences. No remote writes followed.

[GitHub's private Pages documentation](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site) states that private project sites require GitHub Enterprise Cloud and are accessible to readers of the source repository. [Creating a Pages site](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/creating-a-github-pages-site) warns that a private repository alone does not establish private site access.

The current Free plan therefore blocks the requested confidential GitHub Pages site. The default organization repository permission is read, so a new private repository would also inherit a wider organization audience than just named collaborators. No exact reader roster has been verified or approved for manuscript metadata.

## Owner decision needed

For the requested confidential GitHub-hosted tracker, the organization owner must decide whether to obtain GitHub Enterprise Cloud private Pages capability and confirm the exact audience permitted to read the manuscript source and site. Do not upgrade, change organization defaults, grant access, invite people, or create authentication credentials automatically.

If private Pages is unavailable, keep the operational register local. Authenticated external hosting or a separately approved public-safe version would require an explicit new decision. Neither is an authorized fallback in this task. A public JavaScript password, noindex tag, or hard-to-guess URL would not satisfy this gate.

## Verification before any confidential remote copy

1. Recheck the organization's Enterprise Cloud entitlement and Pages creation policy with an owner. Record the date and evidence.
2. Verify that the target is `CECREH/manuscripts` and its visibility is **private**, not internal or public. Review owners, organization base permission, teams, direct and outside collaborators, pending invitations, and installed-app access. Obtain the owner's acceptance of the actual audience. Do not adjust that audience on your own.
3. Use synthetic data to configure and test a private Pages project first. Check that Pages visibility itself is private and that all build logs/artifacts have the approved audience. Do not upload confidential records until this is established.
4. Test in an authorized session and a fresh signed-out browser with no GitHub cookies. Direct requests to the HTML, JSON, JavaScript, CSS, and any support assets must not return site content to the signed-out session. A sign-in redirect or denial is acceptable only when no confidential body is disclosed. Test the exact deployment origin and project path, not just the home page.
5. Check the source repository and raw/download endpoints signed out as well. Record status, redirect destination, timestamp, and whether any confidential body was returned; avoid placing private content in screenshots or reports.
6. Only then move approved metadata into the verified private source/deployment workflow. Recheck the signed-out access boundary after publishing. Keep drafts in the existing protected university storage and verify their intended readers independently.

None of these future hosting checks was performed against a deployed manuscript site because no site exists from this task. No private-site URL or signed-out access guarantee is claimed.
