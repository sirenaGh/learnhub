# Contributing to LearnHub

Keep changes focused on the application, its documentation, and its verification. Preserve working features and unrelated local work.

## Branches and change descriptions

Use a short branch name that describes the work, for example:

- `feature/catalog-improvements`
- `fix/course-progress`
- `docs/setup-instructions`
- `maintenance/dependency-updates`

Write commit messages and pull request titles around the behavior or engineering change. In the description, explain what changed, why it helps, how it was verified, and any relevant limitations. Keep unrelated promotional text and unsolicited signature trailers out of project documents and change descriptions. Retain any notices required by licensing or repository policy, and preserve accurate contributor identities.

## Verification

For application changes, run the relevant checks:

```sh
npm run lint
npm test
npm run build
npm run test:install
npm run test:e2e
```

For documentation-only changes, check the diff, formatting, and affected links. State which checks were performed and which were not. Screenshot capture supports human inspection; it is not an automated pixel comparison.

## Attribution and history

Preserve third-party licenses, required copyright notices, and legitimate source attribution. Keep security findings, technical limitations, and verification results accurate.

Before deleting a remote branch, verify that its tip is included in the default branch and that it has no unique commits. Preserve unmerged work on a descriptive branch. Do not rewrite published history or alter contributor statements as part of a presentation change.
