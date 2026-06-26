# OpenGrowth Roadmap

> Last updated: 2026-06-27

## Vision

OpenGrowth becomes the **Lighthouse for growth** — the standard open-source tool for auditing and improving a website's growth, content, ads, SEO/AEO, and conversion performance.

---

## v0.1 — CLI Foundation

- [x] Project scaffolding (Node.js, TypeScript)
- [x] CLI skeleton with `opengrowth` command
- [x] `audit` command stub (accepts URL, outputs placeholder JSON)
- [ ] Config file support (`.opengrowthrc`)
- [x] Basic error handling and help text
- [x] Unit test foundation

## v0.2 — Crawler & Parser

- [x] URL fetcher (HTTP/HTTPS with redirects, timeouts)
- [x] HTML parser (title, meta tags, headings, links, images)
- [x] Text content extractor (body copy, CTAs, navigation)
- [x] Structured page data model
- [x] Parser test fixtures

## v0.3 — Rule Engine & Scoring

- [x] Rule engine architecture (modular, extensible)
- [x] Core rule packs: SEO basics, content quality, conversion signals
- [x] Scoring system (0–100 per category, overall score)
- [x] Rule documentation format
- [x] Custom rule pack loading

## v0.4 — Content Strategy Generator

- [x] Topic cluster extraction from page content
- [x] Content gap analysis (rule-based)
- [x] Content calendar suggestions
- [x] Distribution channel recommendations
- [x] Plain-text business context input support

## v0.5 — Ad Angle Generator

- [x] Value proposition extraction
- [x] Ad angle templates (pain/gain/feature/social-proof)
- [x] Headline and hook generation (rule-based)
- [x] Ad copy variations
- [x] Audience angle suggestions

## v0.6 — HTML Reports

- [x] Report template system
- [x] Standalone HTML report generation
- [x] Score visualizations (charts, gauges)
- [x] Section-by-section breakdown
- [x] Shareable single-file reports

## v0.7 — GitHub Action

- [x] Action manifest (`action.yml`)
- [x] PR step summary integration
- [x] Score threshold checks
- [x] Artifact upload examples
- [x] Workflow examples

## v0.8 — Self-Hosted Dashboard

- [x] Lightweight web dashboard
- [x] Report history and comparison
- [ ] Multi-URL tracking
- [ ] Team sharing
- [ ] Docker deployment

## v0.9 — Examples & Launch Assets

- [x] Curated neutral SaaS demo report & context (FlowPilot)
- [x] Launch asset drafts (PH, Show HN, Reddit, LinkedIn, X/Twitter)
- [x] Demo walkthrough script & terminal GIF storyboard
- [x] Screenshot checklist & community outreach guides
- [x] Report gallery guidelines & example templates


## v1.0 — Public Launch

- [ ] Documentation polish
- [ ] Performance optimization
- [ ] Security audit
- [ ] npm publish
- [ ] GitHub Marketplace listing (Action)
- [ ] Community launch (HN, Reddit, Twitter/X, Dev.to)

---

## Future (Post v1.0)

- Optional local AI integration (Ollama)
- Multi-page crawling
- Competitor comparison
- Historical trend tracking
- API server mode
- Plugin ecosystem
- VS Code extension
