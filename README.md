<p align="center">
  <h1 align="center">🚀 OpenGrowth</h1>
  <p align="center">
    <strong>The open-source Growth Operating System</strong>
  </p>
  <p align="center">
    Audit any website. Get a content strategy, ad strategy, conversion diagnosis, and execution roadmap.
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="./ROADMAP.md">Roadmap</a> •
    <a href="./CONTRIBUTING.md">Contributing</a>
  </p>
</p>

---

## What is OpenGrowth?

**OpenGrowth** is a developer-first, open-source Growth Operating System for developers, founders, marketers, and agencies.

Think of it as **Lighthouse for growth** — but instead of just performance scores, you get:

- 📊 **Growth Audit** — Crawl any URL and score it across SEO, content, conversion, and messaging
- 📝 **Content Strategy** — Generate topic clusters, content calendars, and distribution plans
- 🎯 **Ad Angle Generation** — Surface high-converting ad angles from your website copy
- 🔍 **Conversion Diagnosis** — Find friction points and missed opportunities in your funnel
- 📋 **Execution Roadmap** — Get a prioritized, actionable plan to grow

All **free**, **local-first**, and **no paid API required**.

## Features

> 🏗️ **Under active development** — v0.3 Rule Engine & Scoring is live. Content strategy coming in v0.4+.

- **CLI** — Run audits from your terminal
- **GitHub Action** — Automate growth audits in CI/CD
- **Self-Hosted Dashboard** — Visualize growth reports (planned)
- **Rule-Based Engine** — Deterministic, transparent scoring with no black box
- **URL + Text Input** — Analyze websites or paste business context directly
- **Local AI Ready** — Optional Ollama integration for enhanced analysis (planned)
- **Beautiful Reports** — HTML reports you can share with your team

## Quick Start

```bash
# Clone and build
git clone https://github.com/Savior-Systems/OpenGrowth.git
cd OpenGrowth
npm install
npm run build

# Run an audit
node dist/cli.js audit https://example.com --context "Demo SaaS"
```

> **Current version:** v0.3 — real crawler, rule engine, and weighted scoring.
> Four output files per audit: `scorecard.json`, `report.md`, `rule-results.json`, `page-data.json`.

## How It Works

1. **Input** → Provide a URL or plain-text business context
2. **Crawl** → OpenGrowth fetches and parses the page structure, copy, meta tags, and links
3. **Analyze** → The rule engine scores your site across dozens of growth dimensions
4. **Report** → Get a structured report with scores, insights, and action items

## Philosophy

- **Free by default** — No paid API keys needed for core features
- **Rule-based first** — Transparent, deterministic analysis you can understand and extend
- **Developer-first** — CLI, JSON output, CI/CD integration
- **Community-driven** — Contribute custom rule packs for your industry
- **Privacy-respecting** — Everything runs locally, your data stays yours

## Project Status

| Component | Status |
|-----------|--------|
| CLI Foundation | ✅ v0.1 |
| Web Crawler/Parser | ✅ v0.2 |
| Rule Engine & Scoring | ✅ v0.3 |
| Content Strategy | 🔜 Planned v0.4 |
| Ad Angle Generator | 🔜 Planned |
| HTML Reports | 🔜 Planned |
| GitHub Action | 🔜 Planned |
| Dashboard | 🔜 Planned |

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

[MIT](./LICENSE) © [Savior Systems](https://github.com/Savior-Systems)

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Savior-Systems">Savior Systems</a></sub>
</p>
