/**
 * Core type definitions for the OpenGrowth rule engine.
 *
 * A Rule is a single, self-contained evaluation unit:
 *   - It reads from PageData
 *   - It produces a RuleResult
 *   - It carries a weight used by the scoring calculator
 *
 * Rules are deterministic and have no external dependencies.
 */

import { PageData } from "../models/page-data.js";

/** Growth audit categories evaluated by the rule engine. */
export type RuleCategory = "seo" | "offer" | "conversion" | "content" | "ads";

/**
 * The output produced by running a single rule against a page.
 */
export interface RuleResult {
  /** Unique identifier of the rule that produced this result. */
  ruleId: string;
  /** Whether the rule condition was satisfied. */
  passed: boolean;
  /** Human-readable title of the rule. */
  title: string;
  /** Category the rule belongs to. */
  category: RuleCategory;
  /** Severity level when this rule fails. */
  priority: "high" | "medium" | "low";
  /** Explanation of the finding (always written in present tense, plain English). */
  description: string;
  /** Raw data extracted from the page that the rule used for its decision. */
  evidence?: string;
}

/**
 * A single rule definition.
 * Rules are authored as plain objects with an `evaluate` method.
 */
export interface Rule {
  /** Unique kebab-case identifier, e.g. "seo-title-exists". */
  id: string;
  /** Short, human-readable rule name. */
  title: string;
  /** Category this rule belongs to. */
  category: RuleCategory;
  /** Severity if this rule fails. */
  priority: "high" | "medium" | "low";
  /**
   * Relative contribution of this rule to its category score.
   * Category score = Σ(passed rule weights) / Σ(all rule weights) × 100.
   */
  weight: number;
  /** Run the rule against a PageData object and return a result. */
  evaluate(page: PageData): RuleResult;
}
