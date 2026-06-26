# Content Strategy Generator

OpenGrowth includes a deterministic, free-by-default, and completely local Content Strategy Generator (v0.4.0) that operates entirely without paid or external AI APIs.

---

## 1. No-AI Deterministic Approach

Unlike modern marketing tools that rely on expensive LLM calls, OpenGrowth uses a rule-based heuristic approach to analyze website content. By parsing the structured `PageData` model and combining it with the user's optional business context, the engine generates actionable topic clusters, detects content gaps, suggests landing pages, blogs, FAQs, distribution campaigns, and structures a complete 30-day content calendar.

Benefits of this approach:
- **100% Free**: Zero cost to run, no OpenAI or Gemini keys required.
- **Privacy-First**: No data is sent to external servers. All processing runs locally on your machine.
- **Deterministic**: The same input page data and context will produce the exact same output.
- **Ultra-Fast**: Results are generated in milliseconds instead of seconds or minutes.

---

## 2. Inputs Used

The content strategy generator utilizes the following inputs:
1. **PageData**: The parsed model of the target page containing title, meta tags, headings (H1-H6), body text, CTA links, internal/external links, and JSON-LD schema status.
2. **Business Context**: An optional user-provided text description that specifies the business niche, target audience, product category, or key value propositions.
3. **Rule Results**: The output from the OpenGrowth rule engine indicating which rules passed or failed.
4. **Scorecard**: The weighted category scores (`seo`, `content`, `conversion`, `trust`, etc.) and overall growth score.

---

## 3. Keyword Extraction

The keyword extraction engine (`src/strategy/keyword-extractor.ts`) processes the website content and business context using the following steps:

1. **Text Normalization**: Lowercases all terms and strips punctuation.
2. **Stopword Filtering**: Removes common English stopwords (e.g., "the", "and", "for", "with", "this").
3. **Min Length Filtering**: Excludes single letters and short terms (length < 3).
4. **Phrase Extraction**: In addition to single words, the engine extracts 2-word and 3-word semantic phrases from headings and business context to preserve topic coherence (e.g., "customer feedback", "workflow management").
5. **Weighted Scoring**: Assigns weights to terms based on where they were found on the page:
   - **Title / Business Context / CTAs**: Weight 10
   - **H1 Headings**: Weight 8
   - **H2 Headings**: Weight 6
   - **Other Headings**: Weight 4
   - **Body Text / Links**: Weight 1
   - **Multi-word phrases**: Given a 1.5x weight multiplier to highlight composite concepts over single words.
6. **Deduplication & Sorting**: Aggregates weights for identical terms/phrases and returns the top terms sorted descending by their combined weight.

---

## 4. Content Gap Detection

Content gaps are mapped directly from the failed results of the audit rule engine:
- **SEO Gaps**: Triggered by missing title tags, missing canonical URLs, or unoptimized page headings.
- **Trust Gaps**: Triggered by the absence of privacy policy links, missing SSL/HTTPS, or lack of social proof signals (testimonials, case studies).
- **Conversion Gaps**: Triggered by missing or weak call-to-action (CTA) paths, excessive input forms, or lack of direct signup links.
- **Authority Gaps**: Triggered by thin content depth (low word count) or lack of structured JSON-LD schema markup.

Each detected gap provides:
- **Type**: e.g., `seo`, `trust`, `conversion`, `authority`.
- **Severity**: `low`, `medium`, or `high` based on the rule severity.
- **Evidence**: Specific text findings extracted from the page.
- **Recommendation**: Exact actionable steps to resolve the gap.

---

## 5. Topic Clusters

OpenGrowth constructs topic clusters by mapping extracted keywords and context into six predefined logical cluster families:

1. **Problem/Solution Cluster**: Focuses on user pain points and how to solve them.
2. **Product/Use Case Cluster**: Focuses on specific capabilities, product workflows, and category-level definitions.
3. **Comparison Cluster**: Structures comparison pages between the product and alternatives (e.g., spreadsheet alternatives).
4. **Educational Guide Cluster**: Focuses on long-form guides, checklists, and how-tos.
5. **Trust/Proof Cluster**: Focuses on case studies, compliance, security, and testimonials.
6. **Conversion/Decision Cluster**: Focuses on pricing, signup verification, and product demonstration layouts.

If the page category or niche cannot be determined, it falls back to the top-weighted keyword or a generic "growth system" baseline.

---

## 6. Content Ideas and 30-Day Calendar

The strategy engine outputs structured content ideas templates:
- **Landing Page Ideas** (at least 5): Focused on conversion paths and key audience segments.
- **Blog Ideas** (at least 10): Categorized by funnel stage (Awareness, Consideration, Conversion) and search intent.
- **FAQ Ideas** (at least 10): Formulates typical customer questions and outlines suggested response angles.
- **Distribution Ideas** (at least 8): Outlines channel-specific distribution angles (LinkedIn, X, Reddit, Email, etc.).

### 30-Day Content Calendar

The 30-day calendar sequences these ideas chronologically to establish topic authority and guide leads down the conversion funnel:

- **Week 1 (Days 1–7): Foundation & Awareness**
  Focuses on top-of-funnel (TOFU) awareness blogs, problem definitions, and explaining the category baseline.
- **Week 2 (Days 8–15): SEO & Topic Authority**
  Focuses on mid-funnel (MOFU) educational guides, checklists, and search-optimized target phrase content.
- **Week 3 (Days 16–22): Conversion & Trust**
  Focuses on bottom-of-funnel (BOFU) comparison templates, case studies, security verification, and high-intent landing pages.
- **Week 4 (Days 23–30): Distribution & Optimization**
  Focuses on repurposing, newsletter distribution, social threads, FAQ additions, and historical content performance reviews.

---

## 7. Limitations

- **Syntactic, Not Semantic**: The keyword extractor performs string normalization and frequency analysis. It does not understand synonyms or semantic similarity without a pre-compiled thesaurus.
- **Static Templates**: Content ideas rely on structured templating. While highly relevant and contextual, they may feel formulaic compared to custom-written human or AI copy.
- **Single-page Scope**: The generator evaluates a single crawled page at a time. It does not currently analyze site-wide authority or crawl internal pages recursively.

---

## 8. Future AI / Local Model Enhancements

OpenGrowth's architecture is designed for progressive enhancement. While the default core remains 100% rule-based and local:
- **Ollama Integration**: Planned integration with local LLMs (e.g., Llama 3, Mistral) via Ollama to generate highly stylized blog outlines, write full draft content, or customize ad copy.
- **API Extension**: Developers will be able to plug in optional OpenAI, Claude, or custom LLM endpoints for advanced semantic rewriting.
