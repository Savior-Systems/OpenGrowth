/**
 * Rule Runner — executes a set of rules against a PageData object.
 *
 * The runner is intentionally thin: it just maps rules → results.
 * Scoring and categorisation are handled by the scoring calculator.
 */

import { Rule, RuleResult } from "./types.js";
import { PageData } from "../models/page-data.js";
import { getAllRules } from "./registry.js";

/**
 * Run all (or a subset of) rules against a crawled page.
 *
 * @param page    - Normalised data produced by the parser.
 * @param rules   - Rule subset to run (defaults to all registered rules).
 * @returns       Array of RuleResult objects, one per rule, in input order.
 */
export function runRules(page: PageData, rules: Rule[] = getAllRules()): RuleResult[] {
  return rules.map((rule) => rule.evaluate(page));
}
