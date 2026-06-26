# OpenGrowth Architecture

> System Architecture — current version v0.9.0.

## System Overview

```
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│          OpenGrowth CLI           │       │       OpenGrowth Dashboard        │
│      opengrowth audit <url>       │       │       localhost:3007 HTTP Server  │
└─────────────────┬─────────────────┘       └─────────────────┬─────────────────┘
                  │                                           │
                  └───────────────────┬───────────────────────┘
                                      │
                          ┌───────────▼───────────┐
                          │    Input Resolver     │
                          │  URL | Plain Text     │
                          └───────────┬───────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
    ┌─────────▼──────┐        ┌──────▼───────┐        ┌──────▼───────┐
    │  Web Crawler   │        │  Text Parser │        │  Config      │
    │  (URL input)   │        │  (text input)│        │  Loader      │
    └─────────┬──────┘        └──────┬───────┘        └──────┬───────┘
              │                      │                        │
              └──────────────────────┼────────────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  Normalized Page    │
                          │  Data Model         │
                          └──────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
    ┌─────────▼──────┐      ┌──────▼───────┐      ┌──────▼───────┐
    │  Rule Engine   │      │  Content     │      │  Ad Angle    │
    │  (scoring)     │      │  Strategy    │      │  Generator   │
    └─────────┬──────┘      └──────┬───────┘      └──────┬───────┘
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  Report Generator   │
                          │  JSON | HTML | CLI  │
                          └──────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
    ┌─────────▼──────┐      ┌──────▼───────┐      ┌──────▼───────┐
    │  CLI Output    │      │  HTML Report │      │  JSON Export  │
    └────────────────┘      └──────────────┘      └──────────────┘
```

## Component Descriptions

### Input Layer
- **CLI** — Command-line interface built with `commander`.
- **Dashboard** — Self-hosted local web interface built with Node.js native `http` server.
- **Input Resolver** — Determines whether input is a URL or plain text, routes accordingly.

### Adoption & Launch Layer
- **Curated Examples** — Fictional SaaS audit configurations (like `FlowPilot` in `examples/neutral-saas`) providing pre-computed scorecard templates for new users.
- **Report Gallery** — Community-driven showcase directory for submitted, anonymized growth blueprints.
- **Launch Blueprints** — Planning storyboards, script sequences, and outreach templates for launching OpenGrowth.

### Data Acquisition Layer
- **Web Crawler** — Fetches pages via HTTP, handles redirects, timeouts, basic error recovery.
- **Text Parser** — Parses plain-text business context for keyword/theme extraction.
- **Config Loader** — Loads `.opengrowthrc` or `opengrowth.config.js` for custom settings.

### Data Model
- **Normalized Page Data** — Unified schema regardless of input source:
  - `title`, `description`, `headings[]`, `bodyText`, `links[]`, `images[]`
  - `meta{}`, `openGraph{}`, `structuredData[]`
  - `keywords[]`, `ctas[]`, `navigation[]`

### Analysis Layer
- **Rule Engine** — Modular, file-based rules that score page data across categories.
- **Content Strategy Engine** — Generates topic clusters, content gaps, calendar suggestions.
- **Ad Angle Generator** — Extracts value propositions and generates ad angle variations.

### Output Layer
- **Report Generator** — Assembles analysis results into structured output.
- **CLI Output** — Terminal-formatted tables and summaries.
- **HTML Report** — Standalone, shareable HTML file with embedded styles.
- **JSON Export** — Machine-readable output for CI/CD integration.

## Technology Choices

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Language | TypeScript | Type safety, npm ecosystem, broad adoption |
| CLI Framework | `commander` | Lightweight, well-documented, zero-config |
| HTTP Client | `undici` or built-in `fetch` | Node.js native, no extra deps |
| HTML Parser | `cheerio` | Lightweight jQuery-like parsing, battle-tested |
| Test Framework | `vitest` | Fast, TypeScript-native, modern |
| Build | `tsup` | Simple TypeScript bundler |
| Report Templates | Handlebars or template literals | Simple, no heavy framework needed |

## Design Principles

1. **No paid API dependency** — Core is 100% rule-based.
2. **Modular rules** — Each rule is a separate file with clear input/output contract.
3. **Progressive enhancement** — Optional AI layer for richer analysis later.
4. **Single-file reports** — HTML reports embed all CSS/JS, no external dependencies.
5. **CI-friendly output** — JSON output with exit codes for GitHub Actions.
