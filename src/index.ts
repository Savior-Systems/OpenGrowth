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
