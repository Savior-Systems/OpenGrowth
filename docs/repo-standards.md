# Repository Standards

> Guidelines for maintaining a clean, professional, community-ready repository.

## File Standards

### Required Root Files
| File | Purpose | Update Frequency |
|------|---------|-----------------|
| `README.md` | Project overview, install, usage | Every minor version |
| `LICENSE` | MIT license | Rarely |
| `CHANGELOG.md` | Release notes | Every release |
| `CONTRIBUTING.md` | Contribution guidelines | As needed |
| `CODE_OF_CONDUCT.md` | Community standards | Rarely |
| `SECURITY.md` | Vulnerability reporting | As needed |
| `SUPPORT.md` | Support channels | As needed |
| `ROADMAP.md` | Feature planning | Monthly or per milestone |

### GitHub Directory (`.github/`)
| File | Purpose |
|------|---------|
| `ISSUE_TEMPLATE/bug_report.md` | Bug report template |
| `ISSUE_TEMPLATE/feature_request.md` | Feature request template |
| `ISSUE_TEMPLATE/rule_pack_proposal.md` | Rule pack proposal template |
| `PULL_REQUEST_TEMPLATE.md` | PR checklist |
| `workflows/ci.yml` | CI pipeline (future) |
| `dependabot.yml` | Dependency updates (future) |

## Commit Standards

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation only
- `chore` — Maintenance, deps, CI
- `test` — Test additions/changes
- `refactor` — Code restructuring
- `perf` — Performance improvements
- `style` — Formatting (no logic change)

## Branch Strategy

- `main` — Stable, release-ready
- `dev` — Active development (optional for solo builder)
- `feature/*` — Feature branches
- `fix/*` — Bug fix branches

## Release Strategy

1. Bump version in `package.json`
2. Update `CHANGELOG.md` with release notes
3. Tag release: `git tag v0.x.0`
4. Push with tags: `git push origin main --tags`
5. Create GitHub Release with notes from CHANGELOG

## Documentation Update Triggers

Update documentation when:
- Adding new CLI commands → Update README usage section
- Adding new rules → Update docs/rules-engine.md
- Changing architecture → Update docs/architecture.md
- Reaching a milestone → Update ROADMAP.md checkboxes
- Releasing a version → Update CHANGELOG.md

## Public vs. Private Files

### Public (committed)
Everything in the repo except `.local-ai/` and items in `.gitignore`

### Private (gitignored)
- `.local-ai/` — AI session context, planning notes, prompt logs
- `.env` — Environment variables
- `local-output/` — Generated audit outputs during development
- `node_modules/` — Dependencies
- `dist/` — Build artifacts
- `coverage/` — Test coverage reports
