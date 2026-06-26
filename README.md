<p align="center">
  <h1 align="center">🚀 OpenGrowth</h1>
  <p align="center">
    <strong>Open-source growth operating system for website audits, content strategy, ad strategy, and HTML reports.</strong>
  </p>
  <p align="center">
    <!-- Status Badge Placeholders -->
    <img src="https://img.shields.io/badge/status-active_development-orange" alt="Status" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
    <img src="https://img.shields.io/badge/version-v0.9.0-blue" alt="Version" />
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#output-files">Output Files</a> •
    <a href="#examples--gallery">Examples & Gallery</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="./ROADMAP.md">Roadmap</a> •
    <a href="./CONTRIBUTING.md">Contributing</a>
  </p>
</p>

---

## What is OpenGrowth?

**OpenGrowth** is a developer-first, open-source Growth Operating System for developers, founders, marketers, and agencies. 

Think of it as **Lighthouse for growth** — but instead of just performance scores, you get:
- 📊 **Growth Audit** — Crawl any URL and score it across SEO, content, conversion, and messaging.
- 📝 **Content Strategy** — Generate topic clusters, content calendars, and distribution plans.
- 🎯 **Ad Angle Generation** — Surface high-converting ad angles from your website copy.
- 🔍 **Conversion Diagnosis** — Find friction points and missed opportunities in your funnel.
- 📋 **Execution Roadmap** — Get a prioritized, actionable plan to grow.

All **free**, **local-first**, and **no paid API required**.

> 🏗️ **Under active development** — v0.9 examples and launch assets are live.

---

## Features

| Feature | Description | Status |
|---|---|---|
| **CLI Engine** | Run audits from your terminal using simple CLI commands | ✅ Production Ready (v0.1) |
| **Crawler & Parser** | Cheerio-based crawler with sitemap and robots.txt parsing | ✅ Production Ready (v0.2) |
| **Modular Rule Engine** | Isolated, transparent rule checks across categories with balanced scoring | ✅ Production Ready (v0.3.1) |
| **Content Strategy** | Multi-channel keyword mapping, cluster groups, and a 30-day calendar | ✅ Production Ready (v0.4) |
| **Ad Strategy** | Hook variations, segments, ad copies, video outlines, and concepts | ✅ Production Ready (v0.5) |
| **HTML Reports** | Standalone responsive report outputs for easy sharing | ✅ Production Ready (v0.6) |
| **GitHub Action** | Automate and enforce growth audits in pull requests and CI/CD pipelines | ✅ Production Ready (v0.7) |
| **Dashboard** | Visual browser interface for historical audits and report review | ✅ Production Ready (v0.8) |
| **Curated Examples** | Curated neutral SaaS reports, templates, and launch preparations | 🚀 Added in v0.9 |

---

## Quick Start

### 1. Build from Source
Ensure you have Node.js 18+ or 20+ installed.
```bash
git clone https://github.com/Savior-Systems/OpenGrowth.git
cd OpenGrowth
npm install
npm run build
```

### 2. Run a Growth Audit
Analyze any URL and output results in a custom directory. Specify a brief description of your offer/business model for best results.
```bash
node dist/cli.js audit https://example.com --context "SaaS for customer feedback management" --output opengrowth-report
```

### 3. Start the Self-Hosted Dashboard
Launch the local web client to run audits and review results visually.
```bash
node dist/cli.js dashboard --port 3007
```
Open `http://localhost:3007` in your browser.

### 4. Integrate into CI/CD (GitHub Action)
Embed OpenGrowth into your pull request pipeline:
```yaml
- name: Run OpenGrowth Audit
  uses: Savior-Systems/OpenGrowth@v1
  with:
    url: https://example.com
    context: "SaaS customer feedback platform"
```
See [docs/github-action.md](./docs/github-action.md) for full configuration options.

---

## Output Files

Every audit generates a set of 9 key assets in your chosen output folder:
- **`scorecard.json`** — Overall and categorical growth scores (0-100).
- **`report.md`** — A detailed markdown report of all findings, severity levels, and next steps.
- **`report.html`** — A beautifully styled, single-file HTML report with charts and visual gauges.
- **`page-data.json`** — Raw parsed metadata, copy headers, internal/external links, and image alt tags.
- **`rule-results.json`** — Comprehensive array of passing and failing rules with proof and recommendations.
- **`content-strategy.json`** — Raw content strategy database.
- **`content-strategy.md`** — Markdown content calendar and keyword cluster mapping.
- **`ad-strategy.json`** — Raw ad angles database.
- **`ad-strategy.md`** — Markdown copy variations, segment targets, and reel storyboards.

---

## Examples & Gallery

Want to see OpenGrowth outputs without running a local audit? Explore the curated examples:
- **[FlowPilot SaaS Demo](./examples/neutral-saas/)** — A complete growth audit and strategy suite for a fictional B2B SaaS company.
  - Check out the curated [sample-report.md](./examples/neutral-saas/sample-report.md) and [sample-content-strategy.md](./examples/neutral-saas/sample-content-strategy.md).
- **[Report Gallery](./examples/report-gallery/)** — Learn how to submit anonymized, public website reports to share with the community.

---

## Screenshots & Demos
*Visual assets and video recordings are being prepared using our launch storyboards:*
- Refer to [Launch Assets & Storyboards](./examples/launch-assets/) to view our planned demo script, screenshot checklists, and terminal GIF flows.

---

## How It Works

1. **Input Collection** → Receives a website URL and an optional business description context.
2. **Crawl & Extract** → Crawls and extracts headings, CTAs, links, text length, meta tags, and structured code.
3. **Analysis Engine** → Evaluates content, SEO, technical metrics, ads, offers, conversion paths, and trust factors.
4. **Scoring Calculator** → Derives weights and computes an objective overall growth scorecard.
5. **Strategy Generation** → Formulates topic clusters and platform-specific ad hooks.
6. **Report Generation** → Exports reports to Markdown, HTML, and JSON.

---

## Roadmap Summary
- [x] v0.1 — CLI Foundation
- [x] v0.2 — Crawler & Parser
- [x] v0.3 — Rule Engine & Scoring
- [x] v0.4 — Content Strategy Generator
- [x] v0.5 — Ad Angle Generator
- [x] v0.6 — HTML Reports
- [x] v0.7 — GitHub Action
- [x] v0.8 — Self-Hosted Dashboard
- [x] v0.9 — Examples & Launch Assets (Current)
- [ ] v1.0 — Public Launch & Hardening

See [ROADMAP.md](./ROADMAP.md) for full task details.

---

## Ethical Growth & Transparency

We believe in honest open-source growth:
- **No Manipulative Hype** — We do not promise "guaranteed 1M stars." We position 1M stars only as a long-term community ambition.
- **No Paid AI Dependencies** — OpenGrowth's core analysis is fully rule-based, local, and free of charge. No OpenAI or paid API key is needed.
- **No Spam Launch Tactics** — All outreach and launch posts are tailored, useful, and fully respect community rules.

---

## Contributing

We welcome contributions! Please review [CONTRIBUTING.md](./CONTRIBUTING.md) to get started on submitting features, example reports, or new rule packs.

---

## License

[MIT](./LICENSE) © [Savior Systems](https://github.com/Savior-Systems)
