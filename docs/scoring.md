# OpenGrowth Scoring Model

OpenGrowth scores any audited page across five growth categories and
produces a single weighted overall score. All scoring is deterministic,
weight-based, and fully transparent.

## Algorithm

### Category Score (0–100)

```
CategoryScore = Σ(weight of each *passed* rule in category)
              / Σ(weight of *all* rules in category)
              × 100
```

Each rule carries a `weight` (positive integer) that represents its relative
importance within its category. Rules with higher weights contribute more to
the category score.

### Overall Score (0–100)

```
OverallScore = Σ(CategoryScore × CategoryWeight)
```

This is a weighted average of all five category scores.

## Category Weights

| Category | Weight | Rationale |
|----------|--------|-----------|
| SEO Foundation | 0.25 (25%) | Crawlability and indexing are prerequisites for any growth |
| Offer Clarity | 0.25 (25%) | Clear value proposition drives every downstream metric |
| Conversion Readiness | 0.25 (25%) | Traffic without conversion is wasted |
| Content Opportunity | 0.15 (15%) | Content underpins SEO, offer, and conversion |
| Ad Readiness | 0.10 (10%) | Supplementary — enables paid amplification |

**Total: 1.00**

## Rule Weights (within each category)

### SEO Foundation (total weight: 130)

| Rule | Weight | % of Category |
|------|--------|----------------|
| Title tag exists | 30 | 23% |
| Title length optimal | 20 | 15% |
| Meta description exists | 30 | 23% |
| Meta description length optimal | 10 | 8% |
| Canonical URL set | 20 | 15% |
| robots.txt reachable | 10 | 8% |
| sitemap.xml reachable | 10 | 8% |

### Offer Clarity (total weight: 100)

| Rule | Weight | % of Category |
|------|--------|----------------|
| Single H1 heading | 60 | 60% |
| Heading hierarchy (3+) | 40 | 40% |

### Conversion Readiness (total weight: 100)

| Rule | Weight | % of Category |
|------|--------|----------------|
| CTA elements present | 60 | 60% |
| Lead-capture forms present | 40 | 40% |

### Content Opportunity (total weight: 100)

| Rule | Weight | % of Category |
|------|--------|----------------|
| Word count ≥ 250 | 60 | 60% |
| All images have alt text | 40 | 40% |

### Ad Readiness (total weight: 100)

| Rule | Weight | % of Category |
|------|--------|----------------|
| Open Graph metadata present | 50 | 50% |
| Open Graph core fields complete | 30 | 30% |
| JSON-LD structured data present | 20 | 20% |

## Example Calculation

A page that:
- Passes all SEO rules → **SEO = 100**
- Has one H1 but only 2 headings → **Offer = 60**
- Has a CTA but no form → **Conversion = 60**
- Has 300 words and all images have alt text → **Content = 100**
- Has no Open Graph or JSON-LD → **Ads = 0**

```
Overall = (100 × 0.25) + (60 × 0.25) + (60 × 0.25) + (100 × 0.15) + (0 × 0.10)
        = 25 + 15 + 15 + 15 + 0
        = 70 / 100
```

## Output Files

| File | Contents |
|------|---------|
| `scorecard.json` | Complete `AuditResult` including all scores, findings, and rule results |
| `rule-results.json` | Raw array of `RuleResult` objects for every rule |
| `report.md` | Human-readable Markdown report |
| `page-data.json` | Normalised `PageData` produced by the crawler |

## Score Interpretation

| Overall Score | Meaning |
|---------------|---------|
| 90–100 | Excellent — strong baseline across all growth dimensions |
| 70–89 | Good — a few important gaps remain |
| 50–69 | Moderate — critical issues are impacting growth potential |
| 30–49 | Weak — significant structural work needed |
| 0–29 | Critical — fundamental growth blockers present |

## Programmatic Usage

```typescript
import { runRules, calculateScore, getAllRules } from 'opengrowth';

const rules = getAllRules();
const results = runRules(myPageData, rules);
const scoreCard = calculateScore(results, rules);

console.log(scoreCard.overall);            // e.g. 72
console.log(scoreCard.categories.seo);    // e.g. 85
console.log(scoreCard.categories.offer);  // e.g. 60
```
