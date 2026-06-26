import { resolve } from "node:path";
import { isValidUrl, normalizeUrl } from "../utils/url.js";
import { runOpenGrowthAudit, printAuditSummary } from "../audit/run-audit.js";

export type { AuditResult } from "../audit/run-audit.js";
export {
  runHeuristicAudit,
  generateMarkdownReport,
  printAuditSummary
} from "../audit/run-audit.js";

export async function runAudit(options: {
  url: string;
  context: string;
  output: string;
  format: string;
}): Promise<void> {
  // Validate URL
  if (!isValidUrl(options.url)) {
    console.error(`\n  ❌ Invalid URL: "${options.url}"`);
    console.error('  Provide a valid URL like "https://example.com" or "example.com"\n');
    process.exit(1);
  }

  const normalizedUrl = normalizeUrl(options.url);
  console.log(`\n  🔎 Auditing ${normalizedUrl}...`);

  try {
    const audit = await runOpenGrowthAudit({
      url: normalizedUrl,
      context: options.context,
      output: options.output
    });

    // Print summary to terminal
    printAuditSummary(audit);

    const passedCount = audit.ruleResults.filter((r) => r.passed).length;
    const totalRules = audit.ruleResults.length;
    const highFindingsCount = audit.findings.filter(
      (f) => f.severity === "critical" || f.severity === "high"
    ).length;

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║              🚀 OpenGrowth Audit Complete               ║");
    console.log("╚══════════════════════════════════════════════════════════╝");
    console.log("");
    console.log(`  URL:                     ${normalizedUrl}`);
    console.log(`  Overall Score:           ${audit.score.overall}/100`);
    console.log(`  Rules Passed:            ${passedCount}/${totalRules}`);
    console.log(`  High Priority Findings:  ${highFindingsCount}`);
    console.log(`  Content Strategy:        Generated`);
    console.log(`  Ad Strategy:             Generated`);
    console.log(`  HTML Report:             Generated`);
    console.log(`  Output Directory:        ${options.output}`);
    console.log("");
    console.log("  ── Output Files ─────────────────────────────────────");
    const outputDir = resolve(process.cwd(), options.output);
    console.log(`  📄 ${resolve(outputDir, "scorecard.json")}`);
    console.log(`  📄 ${resolve(outputDir, "report.md")}`);
    console.log(`  📄 ${resolve(outputDir, "report.html")}`);
    console.log(`  📄 ${resolve(outputDir, "rule-results.json")}`);
    console.log(`  📄 ${resolve(outputDir, "page-data.json")}`);
    console.log(`  📄 ${resolve(outputDir, "content-strategy.json")}`);
    console.log(`  📄 ${resolve(outputDir, "content-strategy.md")}`);
    console.log(`  📄 ${resolve(outputDir, "ad-strategy.json")}`);
    console.log(`  📄 ${resolve(outputDir, "ad-strategy.md")}`);
    console.log("");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n  ❌ Audit failed: ${message}\n`);
    process.exit(1);
  }
}
