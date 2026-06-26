# OpenGrowth v1.0.0-rc.1 — Release Notes

## Overview

OpenGrowth v1.0 is the first stable release of the open-source Growth Operating System. It provides a complete, local-first toolkit for auditing websites across SEO, content, conversion, trust, and ad readiness — with no paid APIs required.

## What's Included

### Core Engine
- **CLI audit command** — Crawl any URL and generate a comprehensive growth scorecard.
- **Cheerio-based crawler** — Extract metadata, headings, CTAs, links, images, and structured content.
- **Modular rule engine** — 26+ transparent, isolated rule checks across 7 scoring categories.
- **Balanced scoring calculator** — Objective 0-100 growth scores with categorical breakdowns.

### Strategy Generators
- **Content strategy generator** — Keyword extraction, topic clusters, content gap detection, 30-day calendar, and distribution plans.
- **Ad angle generator** — Audience segments, value propositions, 20+ hooks, 24 copy variants, video concepts, and carousel ideas.

### Output & Reporting
- **9 output files** per audit — scorecard.json, report.md, report.html, page-data.json, rule-results.json, content-strategy.json/md, ad-strategy.json/md.
- **Standalone HTML report** — Responsive, self-contained report with embedded CSS.

### Integrations
- **GitHub Action** — Composite action for CI/CD pipeline integration with threshold gating.
- **Self-hosted dashboard** — Local web interface for running audits and reviewing history.

### Documentation & Examples
- Complete documentation suite covering architecture, scoring, rules, strategies, and deployment.
- Curated FlowPilot SaaS demo with sample outputs.
- Launch asset templates for Product Hunt, Hacker News, Reddit, LinkedIn, and X/Twitter.

## Technical Details

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.x
- **Build**: tsup (ESM output)
- **Tests**: Vitest (176+ tests)
- **Dependencies**: cheerio, commander (2 production deps)
- **License**: MIT

## Installation

```bash
# From source
git clone https://github.com/Savior-Systems/OpenGrowth.git
cd OpenGrowth
npm install && npm run build

# Usage
node dist/cli.js audit https://example.com --context "Your business context" --output report
node dist/cli.js dashboard --port 3007
```

## Known Limitations

- Single-page crawl only (multi-page crawl is planned for a future release).
- No JavaScript rendering — pages requiring client-side rendering may produce incomplete results.
- Content and ad strategies are deterministic and rule-based, not AI-generated.

## Upgrade Path

This is the first stable release. Future minor versions (1.1, 1.2) will add multi-page crawling, custom rule packs, and enhanced scoring models while maintaining backward compatibility.

## Contributors

Built by [Savior Systems](https://github.com/Savior-Systems). Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
