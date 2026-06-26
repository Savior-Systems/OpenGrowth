# Ad Angle Generator

OpenGrowth includes a deterministic, local-first, and completely free Ad Angle Generator (v0.5.0) that generates ad strategies without paid or external AI dependencies.

---

## 1. No-AI Deterministic Approach

Modern ad strategy builders rely on expensive, latency-prone, and non-deterministic LLM calls. OpenGrowth uses a rule-based templating system to compile website metrics and audit results into high-converting audience segments, hooks, platform copy variations, and video/carousel briefs.

This delivers:
- **Zero Cost**: Run unlimited campaigns audits offline for free.
- **Privacy Assurance**: Your proprietary business context, website copy, and funnel weaknesses are never sent to external AI servers.
- **Speed**: Output is generated instantaneously alongside the standard scorecard.
- **Determinism**: Identical audit inputs yield the exact same ad copy recommendations, allowing for reproducible testing baselines.

---

## 2. Inputs Used

The ad strategy builder operates on:
1. **PageData**: Crawled website elements (Title, headings, meta descriptions, body copy, and button CTA text).
2. **Business Context**: Optional plain-text details describing the product niche, audience, or target customer pain points.
3. **Scorecard**: Overall score and individual category scores (`seo`, `content`, `conversion`, `trust`, `technical`, `offer`, `ads`).
4. **Rule Results**: Passing and failing audit findings.
5. **Content Strategy**: Extracted keywords, topic clusters, and gaps.

---

## 3. Audience Segment Logic

The generator designs at least 5 targeted B2B/B2C audience segments based on the primary crawled topic:
- **Founder / Operator**: Stressed on manual growth processes and looking for automation playbooks.
- **Marketing / Growth Manager**: Staggered conversion rates; looking to patch funnel leaks.
- **Agencies / Consultants**: Seeking automated white-label deliverables to hand off to B2B clients.
- **Developer-Founder**: Technically proficient builders looking to align messaging hooks and trust compliance.
- **Enterprise Buyer**: Risk-averse decision-makers seeking security audit guidelines, privacy policies, and compliance parameters.

Each segment maps out pain points, desired outcomes, messaging focuses, and suggested platforms.

---

## 4. Value Proposition Logic

At least 5 core value propositions are compiled by mapping page evidence:
- **Clarity & Instant Diagnosis**: Focused on category weaknesses (e.g. flagging a trust score below 70).
- **Time-Saving Automation**: Transforming one URL crawl into a 30-day calendar.
- **Trust & Compliance Safeguards**: Auditing SSL, privacy policy availability, and contact paths.
- **Local Architecture**: Operating offline with zero cloud latency.
- **Frictionless Conversion**: Optimizing CTA text active verbs.

---

## 5. Angle Families & Hook Templates

OpenGrowth formats at least 20 hooks across 10 ad angle families:
1. **Pain-Point**: "Your website is not the problem. Your {topic} is missing."
2. **Transformation**: "Turn one website crawl into a 30-day growth roadmap."
3. **Proof**: "The 26-rule growth audit checklist the top SaaS startups use."
4. **Urgency**: "Don't scale your ad budget if your site is missing a privacy policy."
5. **Comparison**: "{capTopic} vs Spreadsheets: Why your team is losing momentum."
6. **Education**: "Are your CTAs using active verbs? Most pages fail this simple check."
7. **Objection-Handling**: "No paid APIs. No external calls. 100% local growth audit."
8. **Offer**: "Get the Free Growth Operating System CLI."
9. **Founder-Story**: "I built a tool to diagnose website growth in seconds. Here is why."
10. **Use-Case**: "How {audience} scale their traffic without hiring writers."

---

## 6. Platform Copy Rules

The copy engine enforces platform-specific visual and length constraints:
- **Google Search**: Restricts headlines to under 30 characters and descriptions to under 90 characters to prevent Google Ads rendering truncated text.
- **LinkedIn**: Structures professional, ROI-centric corporate copy emphasizing operations and risk mitigation.
- **Facebook / Instagram**: Formats benefit-driven hooks and highlights emotional outcomes.
- **Reddit / X**: Generates conversational, plain-text developer-friendly hooks with zero marketing puffery.
- **Short Video**: Focuses on high-impact opening hooks and visual script structures.

### Ad Compliance Guidelines
To maintain trust, the engine forbids high-risk, unverified claims. The ad strategy generator **cannot** output words such as:
- `guaranteed`
- `instant success`
- `100% results`
- `make millions`
- `risk-free` (unless explicitly stated on the crawled landing page).

---

## 7. Short Video and Carousel Concepts

- **Short Video / Reels Concepts** (at least 8): Provides outline scripts, hooks, visual directions, caption ideas, and platform fits targeting organic social hooks.
- **Carousel Concepts** (at least 5): Outlines 5-to-7 slide sequences including slide headlines, visual composition descriptions, CTAs, and themes (e.g. *Mistakes Checklist*, *Step-by-step implementation plan*, *Spreadsheet vs CLI comparison*).

---

## 8. Creative Direction Notes

Generates at least 5 detailed text-based creative directions, outlining:
- **Mood**: e.g., "Professional, analytical, technical, clean".
- **Visual Style**: e.g., "Dark mode SaaS dashboard mockup UI layout".
- **Composition**: Detailed element layouts (mock browsers, scoreboard tables).
- **Proof Elements**: Embedding overall scores, badges, and checkmark graphics.
- **Avoidances**: Explicitly flags bad practices (avoid stock photography of corporate actors, abstract gradients, or blurry code).

---

## 9. Limitations

- **Text Only**: Does not generate image files or video assets.
- **Static Variations**: Relies on templates. Copy may feel formulaic across different runs, although it inserts crawled keywords dynamically.
- **No Image Auditing**: Cannot analyze uploaded image banner creatives.

---

## 10. Future Image Creative & AI Upgrades

- **Local Vision Model (Ollama)**: Future versions plan to integrate local multimodal models (e.g., LLaVA) to let users upload active ad images and audit them for layout, readability, and hook alignment.
- **Generative Image Scaffolding**: Structured template details will be pluggable into Stable Diffusion or DALL-E endpoints for automated image generation.
