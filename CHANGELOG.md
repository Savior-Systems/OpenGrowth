# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

### Added
- Initial TypeScript CLI foundation with `commander`.
- `opengrowth audit <url>` command with placeholder analysis.
- `--context` flag for business context input.
- `--output` flag for custom output directory.
- `--format` flag for output format selection.
- Markdown (`report.md`) and JSON (`scorecard.json`) report generation.
- URL validation and normalization utilities.
- 28 unit and integration tests with vitest.
- TypeScript build pipeline with tsup.
- ESLint flat config with typescript-eslint.
- GitHub Actions CI workflow (Node.js 20 + 22).
- Repository scaffolding: README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, SUPPORT, ROADMAP.
- GitHub issue templates (bug, feature, rule pack) and PR template.
- Architecture, product strategy, repo standards, and launch strategy docs.
