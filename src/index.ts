/**
 * OpenGrowth — Open-source Growth Operating System
 *
 * Public API surface for programmatic usage.
 */

export { isValidUrl, normalizeUrl } from "./utils/url.js";
export {
  runHeuristicAudit,
  generateMarkdownReport,
  runAudit,
} from "./commands/audit.js";
export type { AuditResult } from "./commands/audit.js";

// Crawler & Parser exports
export { fetchPage, getUrlStatus } from "./crawler/fetcher.js";
export { parseHtml } from "./crawler/parser.js";

// Model types
export * from "./models/page-data.js";

// Rule engine exports
export { getAllRules, getRulesByCategory, getRuleById } from "./rules/registry.js";
export { runRules } from "./rules/runner.js";
export type { Rule, RuleResult, RuleCategory } from "./rules/types.js";

// Scoring exports
export { calculateScore, CATEGORY_WEIGHTS } from "./scoring/calculator.js";
export type { ScoreCard } from "./scoring/calculator.js";
