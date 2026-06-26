/**
 * Core type definitions for the OpenGrowth rule engine.
 *
 * A Rule is a single, self-contained evaluation unit:
 *   - It reads from PageData (and optionally a business context string)
 *   - It produces a RuleResult
 *   - It carries a weight used by the scoring calculator
 *
 * Rules are deterministic and have no external dependencies.
 */

import { PageData } from "../models/page-data.js";

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

/** Growth audit categories evaluated by the rule engine. */
export type RuleCategory =
  | "seo"
  | "content"
  | "conversion"
  | "trust"
  | "technical"
  | "offer"
  | "ads";

// ─────────────────────────────────────────────────────────────────────────────
// Severity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How serious the finding is when a rule fails.
 *
 * critical → immediate action required
 * high     → important, fix soon
 * medium   → worth addressing
 * low      → minor improvement opportunity
 * info     → informational; no scoring penalty
 */
export type RuleSeverity = "critical" | "high" | "medium" | "low" | "info";

// ─────────────────────────────────────────────────────────────────────────────
// Evidence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A structured piece of evidence produced by a rule evaluation.
 * Evidence items explain *why* a rule passed or failed.
 */
export interface RuleEvidence {
  /** Short label describing what was measured, e.g. "word count". */
  label: string;
  /** The observed value (can be a string, number, boolean, or list). */
  value: string | number | boolean | string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// RuleResult
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The output produced by running a single rule against a page.
 */
export interface RuleResult {
  /** Unique identifier of the rule that produced this result. */
  ruleId: string;
  /** Category the rule belongs to. */
  category: RuleCategory;
  /** Severity level that applies when this rule fails. */
  severity: RuleSeverity;
  /** Whether the rule condition was satisfied. */
  passed: boolean;
  /**
   * Normalised score contribution for this rule (0–100).
   * 100 if passed, 0 if failed (or partial score for graduated rules).
   */
  score: number;
  /** Human-readable title of the rule. */
  title: string;
  /** Plain-English explanation of the finding. */
  description: string;
  /** Structured evidence items used to reach the decision. */
  evidence: RuleEvidence[];
  /** Concrete recommended action when the rule fails. */
  recommendation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule
// ─────────────────────────────────────────────────────────────────────────────

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
  severity: RuleSeverity;
  /**
   * Relative contribution of this rule to its category score.
   * Category score = Σ(passed rule weights) / Σ(all rule weights) × 100.
   */
  weight: number;
  /**
   * Run the rule against a PageData object and an optional business context
   * string, then return a RuleResult.
   */
  evaluate(page: PageData, context?: string): RuleResult;
}
