# OpenGrowth Rule Engine

The v0.3 rule engine is the core analytical layer of OpenGrowth. It replaces
the inline heuristics from v0.2 with a modular, extensible, and fully testable
rule system.

## Architecture Overview

```
PageData
   │
   ▼
runRules(page, rules)          ← src/rules/runner.ts
   │  maps rules → RuleResult[]
   ▼
calculateScore(results, rules) ← src/scoring/calculator.ts
   │  produces ScoreCard
   ▼
runHeuristicAudit(...)         ← src/commands/audit.ts
   │  assembles AuditResult
   ▼
Output files:
  scorecard.json
  report.md
  rule-results.json
  page-data.json
```

## Core Concepts

### Rule

A `Rule` is a single evaluation unit:

```typescript
interface Rule {
  id: string;           // unique, kebab-case (e.g. "seo-title-exists")
  title: string;        // human-readable name
  category: RuleCategory;
  priority: 'high' | 'medium' | 'low';
  weight: number;       // contribution weight within its category
  evaluate(page: PageData): RuleResult;
}
```

### RuleResult

The output of `rule.evaluate(page)`:

```typescript
interface RuleResult {
  ruleId: string;
  passed: boolean;
  title: string;
  category: RuleCategory;
  priority: 'high' | 'medium' | 'low';
  description: string;  // plain-English explanation of the finding
  evidence?: string;    // raw data extracted from the page
}
```

### RuleCategory

```typescript
type RuleCategory = 'seo' | 'offer' | 'conversion' | 'content' | 'ads';
```

## Rule Packs

Each pack is a file in `src/rules/packs/` that exports a `Rule[]` array.

| Pack | File | Description |
|------|------|-------------|
| SEO Foundation | `packs/seo.ts` | Title, meta description, canonical URL, robots.txt, sitemap |
| Offer Clarity | `packs/offer.ts` | H1 presence, heading hierarchy |
| Conversion Readiness | `packs/conversion.ts` | CTA elements, lead-capture forms |
| Content Opportunity | `packs/content.ts` | Word count, image alt tags |
| Ad Readiness | `packs/ads.ts` | Open Graph completeness, JSON-LD |

### Current Rules (14 total)

| Rule ID | Category | Priority | Weight |
|---------|----------|----------|--------|
| `seo-title-exists` | seo | high | 30 |
| `seo-title-length` | seo | medium | 20 |
| `seo-meta-description-exists` | seo | high | 30 |
| `seo-meta-description-length` | seo | medium | 10 |
| `seo-canonical-url` | seo | medium | 20 |
| `seo-robots-txt` | seo | medium | 10 |
| `seo-sitemap` | seo | low | 10 |
| `offer-single-h1` | offer | high | 60 |
| `offer-heading-structure` | offer | medium | 40 |
| `conversion-cta-present` | conversion | high | 60 |
| `conversion-form-present` | conversion | medium | 40 |
| `content-word-count` | content | medium | 60 |
| `content-image-alt-tags` | content | medium | 40 |
| `ads-open-graph-exists` | ads | medium | 50 |
| `ads-open-graph-complete` | ads | low | 30 |
| `ads-json-ld` | ads | low | 20 |

## Rule Registry

The registry (`src/rules/registry.ts`) is the single source of truth for all
active rules:

```typescript
getAllRules(): Rule[]
getRulesByCategory(category: RuleCategory): Rule[]
getRuleById(id: string): Rule | undefined
```

## Writing a New Rule

1. **Create or extend a pack file** in `src/rules/packs/`.
2. **Implement the rule object** following the `Rule` interface.
3. **Register it** by spreading the pack into `ALL_RULES` in `src/rules/registry.ts`.
4. **Write tests** in `tests/rules.test.ts` for at least the pass and fail paths.

### Example: adding a new SEO rule

```typescript
// In src/rules/packs/seo.ts
{
  id: 'seo-lang-attribute',
  title: 'HTML lang attribute is set',
  category: 'seo',
  priority: 'medium',
  weight: 10,
  evaluate(page: PageData): RuleResult {
    const passed = Boolean(page.lang);
    return {
      ruleId: this.id,
      passed,
      title: this.title,
      category: this.category,
      priority: this.priority,
      description: passed
        ? `lang attribute is "${page.lang}".`
        : 'No lang attribute found on <html>. Screen readers and search engines use this.',
      evidence: page.lang ?? undefined,
    };
  },
},
```

## Design Principles

- **Deterministic** — same `PageData` always produces the same results.
- **Transparent** — every rule documents *why* it passed or failed.
- **No dependencies** — rules read only from `PageData`; no network calls, no AI.
- **Single responsibility** — each rule tests exactly one thing.
- **Easy to contribute** — adding a rule is a ~20-line change in one file.
