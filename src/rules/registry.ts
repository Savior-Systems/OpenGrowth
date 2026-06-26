/**
 * Rule Registry — the single source of truth for all active rule packs.
 *
 * Adding a new rule pack is a two-step operation:
 *   1. Create the pack file under src/rules/packs/
 *   2. Import and spread it into ALL_RULES here
 *
 * No other files need to change.
 */

import { Rule, RuleCategory } from "./types.js";
import { seoRules } from "./packs/seo.js";
import { offerRules } from "./packs/offer.js";
import { conversionRules } from "./packs/conversion.js";
import { contentRules } from "./packs/content.js";
import { adsRules } from "./packs/ads.js";

/** All registered rules in evaluation order. */
const ALL_RULES: Rule[] = [
  ...seoRules,
  ...offerRules,
  ...conversionRules,
  ...contentRules,
  ...adsRules,
];

/**
 * Returns all registered rules.
 */
export function getAllRules(): Rule[] {
  return ALL_RULES;
}

/**
 * Returns all rules belonging to a specific category.
 */
export function getRulesByCategory(category: RuleCategory): Rule[] {
  return ALL_RULES.filter((r) => r.category === category);
}

/**
 * Returns a specific rule by its ID, or undefined if not found.
 */
export function getRuleById(id: string): Rule | undefined {
  return ALL_RULES.find((r) => r.id === id);
}
