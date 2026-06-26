# OpenGrowth Rule Engine

The v0.3.1 rule engine is the core analytical layer of OpenGrowth. It evaluates pages using modular, weight-based rules, producing structured findings, category scores, and recommended actions.

## Architecture Overview

```
PageData (and optional Business Context)
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

A `Rule` is a single, self-contained evaluation unit:

```typescript
export interface Rule {
  id: string;           // Unique kebab-case identifier (e.g., "seo-title-exists")
  title: string;        // Human-readable rule name
  category: RuleCategory;
  severity: RuleSeverity;
  weight: number;       // Contribution weight within its category
  evaluate(page: PageData, context?: string): RuleResult;
}
```

### RuleResult

The output of `rule.evaluate(page, context)`:

```typescript
export interface RuleResult {
  ruleId: string;
  category: RuleCategory;
  severity: RuleSeverity;
  passed: boolean;
  score: number;        // Normalised score contribution (0–100)
  title: string;
  description: string;  // Plain-English explanation of the finding
  evidence: RuleEvidence[]; // Structured evidence items
  recommendation: string; // Concrete recommended action when the rule fails
}
```

### RuleCategory

OpenGrowth supports 7 growth categories:

```typescript
export type RuleCategory =
  | "seo"
  | "content"
  | "conversion"
  | "trust"
  | "technical"
  | "offer"
  | "ads";
```

### RuleSeverity

How serious a finding is when the rule fails:

```typescript
export type RuleSeverity = "critical" | "high" | "medium" | "low" | "info";
```

### RuleEvidence

Structured evidence explaining the decision:

```typescript
export interface RuleEvidence {
  label: string; // E.g., "word count"
  value: string | number | boolean | string[]; // E.g., 250
}
```

---

## Rule Packs

Each pack resides in `src/rules/packs/` and exports a `Rule[]` array.

| Pack | File | Category | Description |
|------|------|----------|-------------|
| SEO Foundation | `packs/seo.ts` | `seo` | Basic Technical SEO elements (Title, Meta description, canonical URL, robots.txt, sitemap) |
| Offer Clarity | `packs/offer.ts` | `offer` | Value proposition structure (H1 presence, heading hierarchy) |
| Conversion Readiness | `packs/conversion.ts` | `conversion` | Actions and form friction |
| Trust Signals | `packs/trust.ts` | `trust` | Policy links, social proof, contact signals, HTTPS |
| Content Opportunity | `packs/content.ts` | `content` | Content depth, image alt tags, business context alignment |
| Ad Readiness | `packs/ads.ts` | `ads` | Open Graph completeness, JSON-LD schema |

---

## Rule Registry

The registry (`src/rules/registry.ts`) imports and registers all active packs, providing functions to query rules:

```typescript
export function getAllRules(): Rule[]
export function getRulesByCategory(category: RuleCategory): Rule[]
export function getRuleById(id: string): Rule | undefined
```

---

## Writing a New Rule

1. **Create or extend a pack file** in `src/rules/packs/`.
2. **Implement the rule object** following the `Rule` interface.
3. **Register it** by spreading the pack into `ALL_RULES` in `src/rules/registry.ts`.
4. **Write tests** in `tests/rules.test.ts` for the pass and fail paths.

### Example

```typescript
{
  id: 'seo-lang-attribute',
  title: 'HTML lang attribute is set',
  category: 'seo',
  severity: 'medium',
  weight: 10,
  evaluate(page: PageData): RuleResult {
    const passed = Boolean(page.lang);
    return {
      ruleId: this.id,
      category: this.category,
      severity: this.severity,
      passed,
      score: passed ? 100 : 0,
      title: this.title,
      description: passed
        ? `lang attribute is "${page.lang}".`
        : 'No lang attribute found on <html>. Screen readers and search engines use this.',
      evidence: [{ label: "lang", value: page.lang ?? "(missing)" }],
      recommendation: passed
        ? "No action needed."
        : "Add a lang attribute to the <html> tag (e.g., <html lang=\"en\">).",
    };
  },
}
```

## Design Principles

- **Deterministic** — same `PageData` always produces the same results.
- **Transparent** — every rule documents *why* it passed or failed with structured evidence.
- **No dependencies** — rules read only from `PageData` and context; no network calls, no AI.
- **Single responsibility** — each rule tests exactly one thing.
- **Actionable** — every failure has a clear, user-facing recommendation.
