/**
 * Scoring Calculator
 *
 * Converts a list of RuleResult objects into a structured ScoreCard.
 *
 * ## Algorithm
 *
 * Category score (0-100):
 *   = Σ(weight of each *passed* rule in category)
 *   / Σ(weight of *all* rules in category)
 *   × 100
 *
 * Overall score (0-100):
 *   = Σ(categoryScore × CATEGORY_WEIGHTS[category])
 *
 * All weights are transparent, documented below, and configurable via
 * CATEGORY_WEIGHTS.
 */

import { Rule, RuleCategory, RuleResult } from "../rules/types.js";

/** The output produced by calculateScore. */
export interface ScoreCard {
  /** Weighted overall score across all categories (0–100). */
  overall: number;
  /** Individual category scores (0–100 each). */
  categories: Record<RuleCategory, number>;
}

/**
 * Relative weights for each category in the overall score calculation.
 * Must sum to 1.0.
 *
 * Current rationale:
 *  - seo, offer, conversion are the three core growth pillars (equal weight)
 *  - content underpins all three, slightly lower weight
 *  - ads readiness is important but supplementary
 */
export const CATEGORY_WEIGHTS: Record<RuleCategory, number> = {
  seo: 0.25,
  offer: 0.25,
  conversion: 0.25,
  content: 0.15,
  ads: 0.10,
};

const CATEGORIES: RuleCategory[] = ["seo", "offer", "conversion", "content", "ads"];

/**
 * Compute a ScoreCard from rule results and the rules that produced them.
 *
 * @param results - Output of runRules().
 * @param rules   - The same rule set passed to runRules(), needed for weights.
 * @returns       A ScoreCard with per-category and overall scores.
 */
export function calculateScore(results: RuleResult[], rules: Rule[]): ScoreCard {
  const categories = {} as Record<RuleCategory, number>;

  for (const cat of CATEGORIES) {
    const catRules = rules.filter((r) => r.category === cat);
    const totalWeight = catRules.reduce((sum, r) => sum + r.weight, 0);

    if (totalWeight === 0) {
      categories[cat] = 0;
      continue;
    }

    const passedWeight = catRules
      .filter((r) => results.some((res) => res.ruleId === r.id && res.passed))
      .reduce((sum, r) => sum + r.weight, 0);

    categories[cat] = Math.round((passedWeight / totalWeight) * 100);
  }

  const overall = Math.round(
    CATEGORIES.reduce((sum, cat) => sum + categories[cat] * CATEGORY_WEIGHTS[cat], 0),
  );

  return { overall, categories };
}
