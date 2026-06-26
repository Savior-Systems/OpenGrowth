# Product Hunt Launch Draft

## 1. Metadata
* **Product Name**: OpenGrowth
* **Tagline**: Open-source growth operating system for audits, content strategy & ad copy
* **Key Features**: Local website crawler, modular rule engine, deterministic content calendar, ad angle variant generator, and dashboard.
* **Categories**: Developer Tools, Marketing, Open Source, SaaS
* **Links**: [GitHub Repository](https://github.com/Savior-Systems/OpenGrowth)

---

## 2. Descriptions

### Short Description (Max 260 chars)
An open-source, local-first growth operating system. Run website audits, find conversion leaks, generate 30-day content strategies, and draft ad angles using a deterministic rule-based engine. No paid API keys required.

### Long Description
OpenGrowth is an open-source growth suite built for developers, founders, and marketers. Just like Lighthouse measures website performance and accessibility, OpenGrowth measures your growth readiness. 

It crawls your website, parses landing pages, and runs localized rule checks across SEO, Content, Conversion, Trust, and Ads. 

What it generates for every audit:
1. **Interactive Scorecard**: Category and overall scores (0-100).
2. **Audit Report**: Actionable items highlighting critical warnings, evidence, and exact code changes needed.
3. **Marketing Blueprints**: A deterministic 30-day content calendar, keyword clusters, and topic distributions.
4. **Ad Strategy**: Audience segments, pain/gain hooks, video scripts, and platform ad copy variations.

All of this is generated locally on your machine, respecting your privacy, without requiring paid API keys or sending your data to external services. Run it as a CLI tool, spin up the local dashboard, or drop it into your GitHub Actions workflow to verify every pull request.

---

## 3. Maker Comment & First Post

### The Pitch / Story
"Hi Product Hunt! 👋

I'm esthiyak, builder of OpenGrowth. 

We all know the pain of launching a website only to wonder: *Why isn't it growing?* Most commercial tools charge hefty subscription fees to run audit checks, or force you to send your data to external APIs for content strategy suggestions.

I wanted to build a developer-first alternative: something completely free, open-source, and local. 

OpenGrowth runs a rule-based engine directly on your computer. It checks search optimizations, checks conversion trust signals (like contact forms or terms of service), and compiles ready-to-use content ideas and ad angles based on your actual website copy. 

Whether you're running it in your terminal, using the self-hosted dashboard, or running it in a CI/CD pipeline, OpenGrowth keeps your growth analysis transparent and deterministic.

OpenGrowth is now at v0.9 (Examples and Launch Assets). We've put together sample SaaS scenarios to show what the reports look like. We would love to hear your feedback, bug reports, and ideas for new rule packs. 

Check out the repo, star it if you find it useful, and let us know what you think!"

---

## 4. Product Hunt FAQ

#### Q: How does the analysis work? Does it use AI?
By default, OpenGrowth uses a fast, deterministic, rule-based engine. It doesn't require paid APIs or AI tokens. It uses local rules to analyze crawled page copy, meta tags, headers, and site structures. (We plan to offer optional local AI integration like Ollama in the future).

#### Q: Does OpenGrowth send my website data to external servers?
No. OpenGrowth is local-first. The crawler, parser, rule checks, and strategy generators run entirely on your local machine.

#### Q: Can I run this in my CI/CD pipelines?
Yes! OpenGrowth includes a custom GitHub Action wrapper (`action.yml`). You can configure it to fail builds if scores drop below a specific threshold, ensuring your team never deploys a page with missing SEO tags or broken trust signals.

#### Q: How can I contribute a new rule pack?
We support modular rule packs. If you have specific rules for e-commerce, local businesses, or technical documentation, check out our rule pack guides in `CONTRIBUTING.md` and submit a PR!
