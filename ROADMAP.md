# OpenGrowth Roadmap

> Last updated: 2026-06-27

## Vision

OpenGrowth becomes the **Lighthouse for growth** — the standard open-source tool for auditing and improving a website's growth, content, ads, SEO/AEO, and conversion performance.

---

## v0.1 — CLI Foundation

- [ ] Project scaffolding (Node.js, TypeScript)
- [ ] CLI skeleton with `opengrowth` command
- [ ] `audit` command stub (accepts URL, outputs placeholder JSON)
- [ ] Config file support (`.opengrowthrc`)
- [ ] Basic error handling and help text
- [ ] Unit test foundation

## v0.2 — Crawler & Parser

- [ ] URL fetcher (HTTP/HTTPS with redirects, timeouts)
- [ ] HTML parser (title, meta tags, headings, links, images)
- [ ] Text content extractor (body copy, CTAs, navigation)
- [ ] Structured page data model
- [ ] Parser test fixtures

## v0.3 — Rule Engine & Scoring

- [ ] Rule engine architecture (modular, extensible)
- [ ] Core rule packs: SEO basics, content quality, conversion signals
- [ ] Scoring system (0–100 per category, overall score)
- [ ] Rule documentation format
- [ ] Custom rule pack loading

## v0.4 — Content Strategy Generator

- [ ] Topic cluster extraction from page content
- [ ] Content gap analysis (rule-based)
- [ ] Content calendar suggestions
- [ ] Distribution channel recommendations
- [ ] Plain-text business context input support

## v0.5 — Ad Angle Generator

- [ ] Value proposition extraction
- [ ] Ad angle templates (pain/gain/feature/social-proof)
- [ ] Headline and hook generation (rule-based)
- [ ] Ad copy variations
- [ ] Audience angle suggestions

## v0.6 — HTML Reports

- [ ] Report template system
- [ ] Standalone HTML report generation
- [ ] Score visualizations (charts, gauges)
- [ ] Section-by-section breakdown
- [ ] Shareable single-file reports

## v0.7 — GitHub Action

- [ ] Action manifest (`action.yml`)
- [ ] PR comment integration
- [ ] Score threshold checks
- [ ] Artifact upload (HTML report)
- [ ] Workflow examples

## v0.8 — Self-Hosted Dashboard

- [ ] Lightweight web dashboard
- [ ] Report history and comparison
- [ ] Multi-URL tracking
- [ ] Team sharing
- [ ] Docker deployment

## v0.9 — Examples & Launch Assets

- [ ] 5+ neutral SaaS demo reports
- [ ] Example rule packs (e-commerce, SaaS, agency)
- [ ] Video walkthrough
- [ ] Blog post / launch article
- [ ] Social media assets

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
