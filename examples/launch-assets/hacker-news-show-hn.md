# Show HN: OpenGrowth – Open-Source Growth Operating System

## Title Ideas
* Show HN: OpenGrowth – Open-source, local-first growth audits and ad/content generators
* Show HN: OpenGrowth – A developer-first growth auditor and strategy planner (free & local)

---

## Post Body

Hi HN,

I built OpenGrowth because I wanted a developer-friendly, privacy-respecting tool to analyze websites for growth readiness—think Lighthouse, but for marketing and conversions rather than just page speed.

Most search, conversion, and strategy tools are closed-source, charge recurring fees, and often require sending site content to remote AI endpoints. I wanted something I could run locally, script in a terminal, and easily drop into a GitHub Action pipeline.

### How it works under the hood
1. **Crawler & Parser**: Built on Cheerio and standard fetch APIs, it parses page tags, heading hierarchy, links, and main copy.
2. **Rule Engine**: Evaluates page data against isolated, modular rule packs. Rules return structured findings with severity levels (critical, warning), evidence, and recommendations.
3. **Scoring Calculator**: Combines category metrics (SEO, Content, Conversion, Trust, Ads) into weighted 0-100 scores.
4. **Strategy Engines**: Deterministic algorithms map keyword clusters, outline a 30-day marketing calendar, and draft ad angles (headlines, hooks, copy variations) directly from the crawled text.
5. **Output Layer**: Generates 9 files including `scorecard.json`, `report.md`, and a standalone responsive `report.html`.

### What works right now
- **CLI**: A single command runs the audit and outputs the strategy.
- **GitHub Action**: Fail a PR build if overall or category scores drop below a threshold you define.
- **Local Dashboard**: A simple Node server to run audits and browse history visually.
- **Curated Examples**: We've included a FlowPilot B2B SaaS example context and sample outputs in the repo so you can inspect reports immediately without building.

### Limitations & Future Plans
- **Single Page Only**: Currently, it only crawls and analyzes the specific URL provided, rather than recursively crawling an entire domain. Multi-page maps are planned for v1.1.
- **Deterministic Generators**: The content strategy and ad copy engines use rule-based dictionaries and heuristics. They work well for brainstorming but lack the fluid creativity of LLMs. We plan to add optional local AI support (e.g. via Ollama) to improve this.
- **Browser-rendered Sites**: If a site is highly dynamic and requires JavaScript rendering, Cheerio won't see the hydrated DOM. We're considering a Playwright crawler fallback for SPAs.

### Feedback
The codebase is written in TypeScript and is completely open-source (MIT). I'd love to hear your thoughts on:
- What growth, SEO, or trust rules would you add?
- Does the scoring weight balance make sense for your own projects?
- What CLI features are we missing?

Repository: https://github.com/Savior-Systems/OpenGrowth

Thanks!
 esthiyak
