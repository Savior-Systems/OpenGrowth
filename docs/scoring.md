# OpenGrowth Scoring Model

OpenGrowth scores any audited page across seven growth categories and produces a single weighted overall score. All scoring is deterministic, weight-based, and fully transparent.

## Algorithm

### Category Score (0–100)

```
CategoryScore = Σ(weight of each *passed* rule in category)
              / Σ(weight of *all* rules in category)
              × 100
```

Each rule carries a `weight` (positive integer) representing its relative importance within its category. If a category contains no rules in a particular audit run, its score defaults to **100** so that it does not penalise the user.

### Overall Score (0–100)

```
OverallScore = Σ(CategoryScore × CategoryWeight)
```

This is a weighted average of all seven category scores.

---

## Category Weights

| Category | Weight | Rationale |
|----------|--------|-----------|
| SEO Foundation | 0.20 (20%) | Crawlability and basic metadata indexing |
| Offer Clarity | 0.15 (15%) | Clarity of value proposition and layout |
| Conversion Readiness | 0.20 (20%) | Direct action and funnel/conversion paths |
| Trust Signals | 0.15 (15%) | Essential policies, social proof, secure connections |
| Content Opportunity | 0.15 (15%) | Content depth, accessibility, context alignment |
| Ad Readiness | 0.10 (10%) | Social sharing metadata and rich schemas |
| Technical SEO | 0.05 (5%) | Advanced technical optimizations (placeholder) |

**Total: 1.00 (100%)**

---

## Rule Weights (within each category)

### SEO Foundation (total weight: 130)

| Rule | Severity | Weight | % of Category |
|------|----------|--------|----------------|
| Title tag is present | high | 30 | 23% |
| Title tag length is optimal | medium | 20 | 15% |
| Meta description is present | high | 30 | 23% |
| Meta description length is optimal | medium | 10 | 8% |
| Canonical URL is set | medium | 20 | 15% |
| robots.txt is reachable | medium | 10 | 8% |
| sitemap.xml is reachable | low | 10 | 8% |

### Offer Clarity (total weight: 100)

| Rule | Severity | Weight | % of Category |
|------|----------|--------|----------------|
| Exactly one H1 heading is present | high | 60 | 60% |
| Page has a rich heading hierarchy | medium | 40 | 40% |

### Conversion Readiness (total weight: 100)

| Rule | Severity | Weight | % of Category |
|------|----------|--------|----------------|
| CTA elements are present | high | 30 | 30% |
| Multiple CTA elements provide varied action paths | low | 15 | 15% |
| CTA text uses direct action verbs | medium | 20 | 20% |
| Contact, demo, or trial path is available | medium | 20 | 20% |
| Forms do not have excessive input fields | low | 15 | 15% |

### Trust Signals (total weight: 100)

| Rule | Severity | Weight | % of Category |
|------|----------|--------|----------------|
| Policy links are present | medium | 25 | 25% |
| Social proof language is present | medium | 30 | 30% |
| A contact or support mechanism is present | medium | 25 | 25% |
| Page is served over HTTPS | high | 20 | 20% |

### Content Opportunity (total weight: 100)

| Rule | Severity | Weight | % of Category |
|------|----------|--------|----------------|
| Page has sufficient content depth | medium | 25 | 25% |
| Page uses a structured heading hierarchy | medium | 20 | 20% |
| Page contains internal links | low | 15 | 15% |
| Page content reflects business context | info | 20 | 20% |
| All images have descriptive alt text | medium | 20 | 20% |

### Ad Readiness (total weight: 100)

| Rule | Severity | Weight | % of Category |
|------|----------|--------|----------------|
| Open Graph metadata is present | medium | 50 | 50% |
| Core OG fields are set | low | 30 | 30% |
| JSON-LD structured data is present | low | 20 | 20% |

### Technical SEO (total weight: 0)
- Currently empty. Scores 100% automatically.

---

## Example Calculation

A page that:
- Passes all SEO rules → **SEO = 100**
- Has one H1 but only 2 headings → **Offer = 60**
- Passes all Conversion rules → **Conversion = 100**
- Has no Policy links but passes other Trust rules → **Trust = 75**
- Passes all Content rules → **Content = 100**
- Has no Open Graph or JSON-LD → **Ads = 0**
- Category with no rules → **Technical = 100**

```
Overall = (100 × 0.20) + (60 × 0.15) + (100 × 0.20) + (75 × 0.15) + (100 × 0.15) + (0 × 0.10) + (100 × 0.05)
        = 20 + 9 + 20 + 11.25 + 15 + 0 + 5
        = 80.25 → 80 / 100
```

## Score Interpretation

| Overall Score | Meaning |
|---------------|---------|
| 90–100 | Excellent — strong baseline across all growth dimensions |
| 70–89 | Good — a few important gaps remain |
| 50–69 | Moderate — critical issues are impacting growth potential |
| 30–49 | Weak — significant structural work needed |
| 0–29 | Critical — fundamental growth blockers present |
