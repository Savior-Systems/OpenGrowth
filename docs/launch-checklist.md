# Launch Checklist

Final pre-launch verification checklist for OpenGrowth v1.0.

## Repository Profile

- [x] README.md is accurate, up-to-date, and has correct version badges
- [x] LICENSE file exists (MIT)
- [x] CHANGELOG.md covers all versions through 1.0.0-rc.1
- [x] CONTRIBUTING.md exists with clear contribution guidelines
- [x] CODE_OF_CONDUCT.md exists
- [x] SECURITY.md exists with reporting instructions and supported versions
- [x] SUPPORT.md exists with help channels
- [x] ROADMAP.md exists

## Package Metadata

- [x] `package.json` version is `1.0.0-rc.1`
- [x] `package.json` has correct `name`, `description`, `license`, `author`
- [x] `package.json` has `repository`, `homepage`, `bugs` URLs
- [x] `package.json` has `keywords` relevant to the project
- [x] `package.json` `files` list includes dist, docs, examples, README, LICENSE, CHANGELOG, action.yml
- [x] `package.json` `engines` specifies `node >= 20.0.0`
- [x] `bin` entry points to `./dist/cli.js`
- [x] `main` and `types` entry points are correct

## Source Code

- [x] CLI version string matches `1.0.0-rc.1`
- [x] Audit result version string matches `1.0.0-rc.1`
- [x] Dashboard health endpoint version matches `1.0.0-rc.1`
- [x] No hardcoded secrets or API keys in source
- [x] No `console.log` debugging statements in production code
- [x] All exports are correctly typed

## Tests

- [x] All version assertion tests updated to `1.0.0-rc.1`
- [x] All tests pass (`npm run test`)
- [x] TypeScript typecheck passes (`npm run typecheck`)
- [x] Build succeeds (`npm run build`)
- [x] Lint passes (`npm run lint`)

## CI/CD

- [x] `.github/workflows/ci.yml` exists and runs on push/PR
- [x] `.github/workflows/action-smoke-test.yml` exists
- [x] No irrelevant workflow files (deno.yml, webpack.yml, etc.)

## GitHub Action

- [x] `action.yml` exists with correct metadata
- [x] Action inputs/outputs are documented
- [x] Composite action steps are functional

## Documentation

- [x] `docs/architecture.md` — System architecture
- [x] `docs/scoring.md` — Scoring methodology
- [x] `docs/rules-engine.md` — Rule engine guide
- [x] `docs/content-strategy.md` — Content strategy docs
- [x] `docs/ad-angle-generator.md` — Ad angle generator docs
- [x] `docs/html-reports.md` — HTML report docs
- [x] `docs/github-action.md` — GitHub Action docs
- [x] `docs/dashboard.md` — Dashboard docs
- [x] `docs/examples-and-launch.md` — Examples guide
- [x] `docs/launch-checklist.md` — This file
- [x] `docs/npm-publish-checklist.md` — npm publish guide
- [x] `docs/v1-release-notes.md` — Release notes draft
- [x] `docs/security-review.md` — Security review
- [x] `docs/project-status.md` — Project status overview

## Pre-Publish Verification

- [ ] `npm pack --dry-run` output reviewed (correct files, reasonable size)
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Manual CLI audit produces all 9 output files
- [ ] Dashboard starts and serves audit form

## Release Gates

- [ ] All checklist items above are green
- [ ] Commit created with all hardening changes
- [ ] User has reviewed and approved push
- [ ] npm publish executed only after explicit approval
