import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { isValidUrl, normalizeUrl } from "../utils/url.js";
import { fetchPage, getUrlStatus } from "../crawler/fetcher.js";
import { parseHtml } from "../crawler/parser.js";
import { PageData } from "../models/page-data.js";
import { getAllRules } from "../rules/registry.js";
import { runRules } from "../rules/runner.js";
import { RuleResult } from "../rules/types.js";
import { calculateScore } from "../scoring/calculator.js";
import { generateContentStrategy } from "../strategy/content-strategy.js";
import { generateContentStrategyMarkdown } from "../strategy/markdown.js";
import { generateAdStrategy } from "../ads/ad-angle-generator.js";
import { generateAdStrategyMarkdown } from "../ads/markdown.js";
import { generateHtmlReport } from "../report/html.js";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditResult {
  tool: string;
  version: string;
  url: string;
  context: string;
  generatedAt: string;
  score: {
    overall: number;
    categories: {
      seo: number;
      content: number;
      conversion: number;
      trust: number;
      technical: number;
      offer: number;
      ads: number;
    };
  };
  findings: Array<{
    category: string;
    severity: string;
    title: string;
    description: string;
    recommendation: string;
  }>;
  ruleResults: RuleResult[];
  nextSteps: string[];
  pageData?: PageData;
  contentStrategy?: {
    summary: string;
    topicClusters: Array<{
      name: string;
      intent: string;
      priority: string;
      reason: string;
      keywords: string[];
    }>;
    contentGaps: Array<{
      type: string;
      severity: string;
      title: string;
      evidence: string;
      recommendation: string;
    }>;
    calendar30Days: Array<{
      day: number;
      title: string;
      format: string;
      intent: string;
      priority: string;
      goal: string;
    }>;
  };
  adStrategy?: {
    summary: string;
    audienceSegments: Array<{
      name: string;
      stage: string;
      painPoint: string;
      desiredOutcome: string;
      messageFocus: string;
      suggestedPlatforms: string[];
    }>;
    hooks: Array<{
      text: string;
      family: string;
      platformFit: string[];
      reason: string;
    }>;
    adCopyVariants: Array<{
      platform: string;
      family: string;
      stage: string;
      primaryText: string;
      headline: string;
      description?: string;
      cta: string;
      creativeNote: string;
    }>;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Core audit functions
// ─────────────────────────────────────────────────────────────────────────────

export function runHeuristicAudit(
  url: string,
  context: string,
  pageData: PageData,
): AuditResult {
  const rules = getAllRules();
  const ruleResults = runRules(pageData, rules);
  const scoreCard = calculateScore(ruleResults, rules);

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 } as const;
  const findings = ruleResults
    .filter((r) => !r.passed)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .map((r) => ({
      category: r.category,
      severity: r.severity,
      title: r.title,
      description: r.description,
      recommendation: r.recommendation,
    }));

  const nextSteps: string[] = [];
  for (const result of ruleResults.filter((r) => !r.passed && (r.severity === "critical" || r.severity === "high"))) {
    nextSteps.push(`Fix: ${result.title}`);
  }
  if (nextSteps.length === 0) {
    for (const result of ruleResults.filter((r) => !r.passed && r.severity === "medium").slice(0, 3)) {
      nextSteps.push(`Improve: ${result.title}`);
    }
  }
  if (nextSteps.length === 0) {
    nextSteps.push("Excellent baseline! Continue refining content and conversion elements.");
  }

  const contentStrategyData = generateContentStrategy({
    page: pageData,
    context,
    ruleResults,
    scorecard: scoreCard,
  });

  const adStrategyData = generateAdStrategy({
    page: pageData,
    context,
    scorecard: scoreCard,
    ruleResults,
    contentStrategy: contentStrategyData,
  });

  return {
    tool: "OpenGrowth",
    version: "1.0.0-rc.1",
    url,
    context: context || "No business context provided.",
    generatedAt: new Date().toISOString(),
    score: {
      overall: scoreCard.overall,
      categories: {
        seo: scoreCard.categories.seo,
        content: scoreCard.categories.content,
        conversion: scoreCard.categories.conversion,
        trust: scoreCard.categories.trust,
        technical: scoreCard.categories.technical,
        offer: scoreCard.categories.offer,
        ads: scoreCard.categories.ads,
      },
    },
    findings,
    ruleResults,
    nextSteps,
    pageData,
    contentStrategy: {
      summary: contentStrategyData.summary,
      topicClusters: contentStrategyData.topicClusters.map((c) => ({
        name: c.name,
        intent: c.intent,
        priority: c.priority,
        reason: c.reason,
        keywords: c.keywords,
      })),
      contentGaps: contentStrategyData.contentGaps,
      calendar30Days: contentStrategyData.calendar30Days,
    },
    adStrategy: {
      summary: adStrategyData.summary,
      audienceSegments: adStrategyData.audienceSegments.map((s) => ({
        name: s.name,
        stage: s.stage,
        painPoint: s.painPoint,
        desiredOutcome: s.desiredOutcome,
        messageFocus: s.messageFocus,
        suggestedPlatforms: s.suggestedPlatforms,
      })),
      hooks: adStrategyData.hooks.map((h) => ({
        text: h.text,
        family: h.family,
        platformFit: h.platformFit,
        reason: h.reason,
      })),
      adCopyVariants: adStrategyData.adCopyVariants,
    },
  };
}

export function generateMarkdownReport(audit: AuditResult): string {
  const lines: string[] = [];

  lines.push("# OpenGrowth Audit Report");
  lines.push("");
  lines.push("## Website");
  lines.push(`- **URL:** ${audit.url}`);
  if (audit.pageData?.canonicalUrl) {
    lines.push(`- **Canonical URL:** ${audit.pageData.canonicalUrl}`);
  }
  lines.push("");
  lines.push("## Context");
  lines.push(audit.context);
  lines.push("");
  lines.push("## Growth Score");
  lines.push(`**Overall: ${audit.score.overall}/100**`);
  lines.push("");
  lines.push("## Category Scores");
  lines.push("");
  lines.push("| Category | Score |");
  lines.push("|----------|-------|");
  lines.push(`| SEO Foundation | ${audit.score.categories.seo}/100 |`);
  lines.push(`| Content Opportunity | ${audit.score.categories.content}/100 |`);
  lines.push(`| Conversion Readiness | ${audit.score.categories.conversion}/100 |`);
  lines.push(`| Trust Signals | ${audit.score.categories.trust}/100 |`);
  lines.push(`| Technical SEO | ${audit.score.categories.technical}/100 |`);
  lines.push(`| Offer Clarity | ${audit.score.categories.offer}/100 |`);
  lines.push(`| Ad Readiness | ${audit.score.categories.ads}/100 |`);
  lines.push("");

  if (audit.pageData) {
    lines.push("## Page Summary");
    lines.push("");
    lines.push(`- **Page Title:** ${audit.pageData.title || "*None*"}`);
    lines.push(`- **Meta Description:** ${audit.pageData.metaDescription || "*None*"}`);
    lines.push(`- **Total Headings:** ${audit.pageData.headings.length}`);
    lines.push(
      `- **Total Links:** ${audit.pageData.links.length} (${audit.pageData.links.filter((l) => l.isInternal).length} internal, ${audit.pageData.links.filter((l) => !l.isInternal).length} external)`,
    );
    lines.push(`- **Total Images:** ${audit.pageData.images.length}`);
    lines.push(`- **Total CTAs:** ${audit.pageData.ctas.length}`);
    lines.push(`- **Total Forms:** ${audit.pageData.forms.length}`);
    lines.push("");
  }

  lines.push("## Key Findings");
  lines.push("");

  if (audit.findings.length === 0) {
    lines.push("🎉 No issues detected! Excellent job.");
    lines.push("");
  } else {
    for (const finding of audit.findings) {
      let severityIcon = "🟢";
      if (finding.severity === "critical") severityIcon = "🔴";
      else if (finding.severity === "high") severityIcon = "🟠";
      else if (finding.severity === "medium") severityIcon = "🟡";
      else if (finding.severity === "info") severityIcon = "ℹ️";
      lines.push(`### ${severityIcon} [${finding.severity.toUpperCase()}] ${finding.title}`);
      lines.push("");
      lines.push(`**Category:** ${finding.category}`);
      lines.push("");
      lines.push(finding.description);
      lines.push("");
      if (finding.recommendation) {
        lines.push(`**Recommendation:** ${finding.recommendation}`);
        lines.push("");
      }
    }
  }

  lines.push("## Rule Results");
  lines.push("");
  lines.push("| Rule | Category | Status | Severity | Score |");
  lines.push("|------|----------|--------|----------|-------|");
  for (const r of audit.ruleResults) {
    const status = r.passed ? "✅ Pass" : "❌ Fail";
    lines.push(`| ${r.title} | ${r.category} | ${status} | ${r.severity} | ${r.score} |`);
  }
  lines.push("");

  lines.push("## Recommended Next Steps");
  lines.push("");
  if (audit.nextSteps.length === 0) {
    lines.push("Keep maintaining high standards!");
  } else {
    for (let i = 0; i < audit.nextSteps.length; i++) {
      lines.push(`${i + 1}. ${audit.nextSteps[i]}`);
    }
  }
  lines.push("");
  lines.push("## Version");
  lines.push("");
  lines.push(
    `> Generated by OpenGrowth v${audit.version} — rule-engine powered audit.`,
  );
  lines.push("");
  lines.push(`*Audit run: ${audit.generatedAt}*`);
  lines.push("");

  return lines.join("\n");
}

export function printAuditSummary(audit: AuditResult): void {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║              🚀 OpenGrowth Audit Report                 ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`  URL:      ${audit.url}`);
  console.log(`  Context:  ${audit.context}`);
  console.log(`  Date:     ${audit.generatedAt}`);
  console.log("");
  if (audit.pageData) {
    console.log("  ── Page Content Summary ──────────────────────────────");
    console.log(`  Title:         ${audit.pageData.title || "[None]"}`);
    console.log(`  Headings:      ${audit.pageData.headings.length} tags`);
    console.log(
      `  Links:         ${audit.pageData.links.length} total (${audit.pageData.links.filter((l) => l.isInternal).length} internal)`,
    );
    console.log(`  Images:        ${audit.pageData.images.length} total`);
    console.log(`  CTAs found:    ${audit.pageData.ctas.length} elements`);
    console.log(`  Forms:         ${audit.pageData.forms.length} forms`);
    console.log("");
  }
  console.log("  ── Growth Score ──────────────────────────────────────");
  console.log(`  Overall:               ${audit.score.overall}/100`);
  console.log("");
  console.log("  ── Category Breakdown ────────────────────────────────");
  console.log(`  SEO Foundation:        ${audit.score.categories.seo}/100`);
  console.log(`  Content Opportunity:   ${audit.score.categories.content}/100`);
  console.log(`  Conversion Readiness:  ${audit.score.categories.conversion}/100`);
  console.log(`  Trust Signals:         ${audit.score.categories.trust}/100`);
  console.log(`  Technical SEO:         ${audit.score.categories.technical}/100`);
  console.log(`  Offer Clarity:         ${audit.score.categories.offer}/100`);
  console.log(`  Ad Readiness:          ${audit.score.categories.ads}/100`);
  console.log("");
  console.log(`  ── Findings (${audit.findings.length}) ───────────────────────────────────`);
  if (audit.findings.length === 0) {
    console.log("  🎉 No issues detected!");
  } else {
    for (const finding of audit.findings.slice(0, 8)) {
      let icon = "🟢";
      if (finding.severity === "critical") icon = "🔴";
      else if (finding.severity === "high") icon = "🟠";
      else if (finding.severity === "medium") icon = "🟡";
      else if (finding.severity === "info") icon = "ℹ️";
      console.log(`  ${icon} [${finding.severity.toUpperCase()}] ${finding.title}`);
    }
    if (audit.findings.length > 8) {
      console.log(`  ... and ${audit.findings.length - 8} more findings`);
    }
  }
  console.log("");
}

/**
 * End-to-end programmatic audit runner.
 */
export async function runOpenGrowthAudit(input: {
  url: string;
  context?: string;
  output: string;
}): Promise<AuditResult> {
  const context = input.context || "";
  
  if (!isValidUrl(input.url)) {
    throw new Error(`Invalid URL: "${input.url}"`);
  }

  const normalizedUrl = normalizeUrl(input.url);

  // 1. Fetch main page content
  const fetchResult = await fetchPage(normalizedUrl);

  // 2. Parse HTML
  const parsedData = parseHtml(fetchResult.html, fetchResult.finalUrl);

  // 3. Check robots.txt and sitemap.xml status
  const origin = new URL(fetchResult.finalUrl).origin;
  const [robotsTxtStatus, sitemapStatus] = await Promise.all([
    getUrlStatus(`${origin}/robots.txt`),
    getUrlStatus(`${origin}/sitemap.xml`),
  ]);

  const pageData: PageData = {
    ...parsedData,
    robotsTxtStatus,
    sitemapStatus,
  };

  // 4. Run rule engine and generate audit scorecard
  const audit = runHeuristicAudit(normalizedUrl, context, pageData);

  // Generate the full strategy reports
  const fullStrategy = generateContentStrategy({
    page: pageData,
    context,
    ruleResults: audit.ruleResults,
    scorecard: { overall: audit.score.overall, categories: audit.score.categories },
  });

  const fullAdStrategy = generateAdStrategy({
    page: pageData,
    context,
    scorecard: { overall: audit.score.overall, categories: audit.score.categories },
    ruleResults: audit.ruleResults,
    contentStrategy: fullStrategy,
  });

  // 5. Create output directories and write all 9 files
  const outputDir = resolve(process.cwd(), input.output);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const scorecardPath = resolve(outputDir, "scorecard.json");
  writeFileSync(scorecardPath, JSON.stringify(audit, null, 2), "utf-8");

  const reportPath = resolve(outputDir, "report.md");
  writeFileSync(reportPath, generateMarkdownReport(audit), "utf-8");

  const ruleResultsPath = resolve(outputDir, "rule-results.json");
  writeFileSync(ruleResultsPath, JSON.stringify(audit.ruleResults, null, 2), "utf-8");

  const pageDataPath = resolve(outputDir, "page-data.json");
  writeFileSync(pageDataPath, JSON.stringify(audit.pageData, null, 2), "utf-8");

  const strategyJsonPath = resolve(outputDir, "content-strategy.json");
  writeFileSync(strategyJsonPath, JSON.stringify(fullStrategy, null, 2), "utf-8");

  const strategyMdPath = resolve(outputDir, "content-strategy.md");
  writeFileSync(strategyMdPath, generateContentStrategyMarkdown(fullStrategy), "utf-8");

  const adStrategyJsonPath = resolve(outputDir, "ad-strategy.json");
  writeFileSync(adStrategyJsonPath, JSON.stringify(fullAdStrategy, null, 2), "utf-8");

  const adStrategyMdPath = resolve(outputDir, "ad-strategy.md");
  writeFileSync(adStrategyMdPath, generateAdStrategyMarkdown(fullAdStrategy), "utf-8");

  const htmlReportPath = resolve(outputDir, "report.html");
  const htmlReportInput = {
    tool: audit.tool,
    version: audit.version,
    url: audit.url,
    context: audit.context,
    generatedAt: audit.generatedAt,
    score: audit.score,
    findings: audit.findings,
    ruleResults: audit.ruleResults,
    nextSteps: audit.nextSteps,
    pageData: audit.pageData,
    contentStrategy: fullStrategy,
    adStrategy: fullAdStrategy,
  };
  writeFileSync(htmlReportPath, generateHtmlReport(htmlReportInput), "utf-8");

  return audit;
}
