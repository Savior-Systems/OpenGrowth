# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - Unreleased

### Added
- Deterministic content strategy generator.
- Keyword extraction from page data and business context.
- Topic cluster generation.
- Content gap detection from rule results.
- Landing page, blog, FAQ, and distribution ideas.
- 30-day content calendar.
- Content strategy JSON and Markdown exports.

## [0.3.1] - 2026-06-27

### Added
- Complete Trust signals rule set (SSL/HTTPS check, privacy policy, terms of service, and contact/demo path).
- Improved CLI reporting with detailed findings showing severity, evidence, and recommendations.

### Changed
- Balanced scoring weights across categories (SEO, Content, Conversion, Trust, Technical, Offer, Ads).

## [0.3.0] - 2026-06-26

### Added
- Modular rule engine structure with isolated rule packs.
- Structured scoring calculator delivering categorical and overall scores (0-100).
- Multi-file audit output generation (`scorecard.json`, `report.md`, `rule-results.json`, `page-data.json`).

## [0.2.0] - 2026-06-26

### Added
- Cheerio-based HTML parser and metadata extractor.
- Fetch-based web crawler with robots.txt and sitemap.xml validation.

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
