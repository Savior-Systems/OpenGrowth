# Reddit Launch Posts Drafts

Tailored, non-spammy post drafts focusing on providing value, lessons learned, and asking for feedback.

---

## 1. r/opensource
* **Title**: Show Reddit: OpenGrowth – A local-first, rule-based growth auditor and marketing strategy generator
* **Post Content**:
  Hi all, I've spent the past few weeks building OpenGrowth, an open-source (MIT) tool that audits websites for growth metrics and generates content calendars and ad angles locally.

  **Why build it?**
  Most SEO and growth audit utilities are commercial SaaS platforms. I wanted a developer-first tool that runs offline, has a modular rule system, and can block pull requests if a change breaks core SEO or trust signals.

  **Tech Stack:** TypeScript, Commander, Cheerio, Vitest, tsup.

  **How we run it:**
  It is a CLI tool (`node dist/cli.js audit <url>`) that generates 9 files: a visual `report.html`, markdown files, and JSON databases. We also built a self-hosted dashboard and a composite GitHub Action.

  It's completely free and does not require any API keys. I would love feedback from the open-source community, particularly on adding new rule packs.

  Code: https://github.com/Savior-Systems/OpenGrowth

---

## 2. r/webdev
* **Title**: Showoff Saturday: OpenGrowth – Open-source CLI and dashboard to audit website trust, SEO, and conversion signals
* **Post Content**:
  Hey webdevs, I built OpenGrowth, a tool that functions like Google Lighthouse but evaluates search optimization, copy trust signals, and content strategies.

  **Under the hood:**
  - **Crawler**: Crawls URLs, respects robots.txt/sitemaps, and extracts headers/CTAs.
  - **Modular Rules**: Executes checks for SSL, Privacy Policies, CTAs, and keyword densities.
  - **Strategy Generators**: Uses deterministic templates to compile topic clusters and 30-day content calendars from extracted metadata.
  - **GitHub Action**: Allows developers to fail builds if a commit drops website scoring.

  If you are launching landing pages or client sites, this might help you run a quick pre-launch check to make sure you didn't miss basic trust or conversion signals. I'd love to know what rules you check before shipping.

  Repository: https://github.com/Savior-Systems/OpenGrowth

---

## 3. r/SideProject
* **Title**: I built OpenGrowth – An open-source, local-first alternative to expensive website audit tools
* **Post Content**:
  Hey everyone, I wanted to share a side project I've been working on called OpenGrowth. 

  When launching side projects, we often ignore basic marketing practices or trust signals (like terms of service pages or clear value propositions), which hurts early conversions. 

  OpenGrowth is a tool you can run in your terminal to scrape your landing page and highlight these issues immediately. It gives you scorecards, suggests ad copies, and outputs a 30-day content calendar.

  It runs completely locally on your computer with no external API calls or AI token fees. 

  I'm sharing v0.9 today which includes curated SaaS examples so you can test it out. What features would you find most useful for auditing your projects?

  GitHub: https://github.com/Savior-Systems/OpenGrowth

---

## 4. r/marketing
* **Title**: Open-Source Website Auditor: Get content blueprints and ad copy angles directly from your website copy (Free & Local)
* **Post Content**:
  Hello marketers, I developed OpenGrowth, an open-source tool that crawls a landing page, audits it for SEO/conversion readiness, and creates marketing assets.

  **What it outputs:**
  - **Scorecard**: Scores your site's copy, technical tags, and conversion paths.
  - **Content Strategy**: Topic clusters and a 7-day draft calendar based on the keywords extracted from your copy.
  - **Ad Strategy**: Audience segments, pain/gain hooks, and copy variations.

  I wanted to make this tool completely open and local so agencies and solo marketers can audit pages without signing up for subscription software or sharing client URLs with third-party servers.

  Would love to hear how you structure your initial client site audits and if these rule packs align with your workflow.

  Repository: https://github.com/Savior-Systems/OpenGrowth

---

## 5. r/SaaS
* **Title**: Auditing SaaS Landing Pages for Trust and Conversion signals: I built an open-source tool to do it locally
* **Post Content**:
  Hey SaaS founders, I built an open-source tool called OpenGrowth to solve a common problem: auditing landing pages for conversion leaks and planning initial marketing materials.

  **What we audit for:**
  - **Trust signals**: SSL, privacy pages, terms of service, active contact paths.
  - **SEO & Copy**: Heading hierarchy, descriptive CTAs, and alt text.
  - **Value Proposition**: Offering clarity and hook alignment.

  It also generates a 30-day content calendar outline and ad hooks directly from your crawled copy. 

  It is free and local-first (no subscription, no external APIs). I've created a fictional SaaS audit sample ("FlowPilot") in the examples folder to show what it produces. 

  Let me know if this is helpful for your pre-launch check!

  Code: https://github.com/Savior-Systems/OpenGrowth
