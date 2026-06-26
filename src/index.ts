/**
 * OpenGrowth — Open-source Growth Operating System
 *
 * Public API surface for programmatic usage.
 */

export { isValidUrl, normalizeUrl } from "./utils/url.js";
export {
  generatePlaceholderAudit,
  generateMarkdownReport,
  runAudit,
} from "./commands/audit.js";
export type { AuditResult } from "./commands/audit.js";
