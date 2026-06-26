import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { isValidUrl, normalizeUrl } from "../utils/url.js";
import { fetchPage, getUrlStatus } from "../crawler/fetcher.js";
import { parseHtml } from "../crawler/parser.js";
import { PageData } from "../models/page-data.js";

export interface AuditResult {
  tool: string;
  version: string;
  url: string;
  context: string;
  generatedAt: string;
  score: {
    overall: number;
    categories: {
      offerClarity: number;
      conversionReadiness: number;
      seoFoundation: number;
      contentOpportunity: number;
      adReadiness: number;
    };
  };
  findings: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;
  nextSteps: string[];
  pageData?: PageData;
}

/**
 * Evaluate the parsed PageData using lightweight heuristic rules for v0.2.
 */
export function runHeuristicAudit(
  url: string,
  context: string,
  pageData: PageData,
): AuditResult {
  const findings: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }> = [];

  // 1. SEO Foundation Scoring (Max: 100)
  let seoScore = 0;
  if (pageData.title) {
    seoScore += 30;
    if (pageData.title.length > 60 || pageData.title.length < 10) {
      findings.push({
        category: "seo",
        priority: "medium",
        title: "Optimize title tag length",
        description: `Current title length is ${pageData.title.length} characters. Titles should ideally be between 10-60 characters.`,
      });
    }
  } else {
    findings.push({
      category: "seo",
      priority: "high",
      title: "Missing title tag",
      description: "The page does not have a <title> element, which is critical for search engine indexing.",
    });
  }

  if (pageData.metaDescription) {
    seoScore += 30;
    if (pageData.metaDescription.length > 160 || pageData.metaDescription.length < 50) {
      findings.push({
        category: "seo",
        priority: "medium",
        title: "Optimize meta description length",
        description: `Current description is ${pageData.metaDescription.length} characters. Descriptions should ideally be between 50-160 characters.`,
      });
    }
  } else {
    findings.push({
      category: "seo",
      priority: "high",
      title: "Missing meta description",
      description: "No meta description tag was found. Search engines will fallback to auto-generated page snippets.",
    });
  }

  if (pageData.canonicalUrl) {
    seoScore += 20;
  } else {
    findings.push({
      category: "seo",
      priority: "medium",
      title: "Missing canonical URL",
      description: "No canonical link element was found. This can lead to duplicate content indexing issues.",
    });
  }

  if (pageData.robotsTxtStatus === 200) {
    seoScore += 10;
  } else {
    findings.push({
      category: "seo",
      priority: "medium",
      title: "robots.txt is missing or unreachable",
      description: `robots.txt request returned status ${pageData.robotsTxtStatus || "failed"}. Search engine crawlers need robots.txt for routing.`,
    });
  }

  if (pageData.sitemapStatus === 200) {
    seoScore += 10;
  } else {
    findings.push({
      category: "seo",
      priority: "low",
      title: "Sitemap xml is missing or unreachable",
      description: `sitemap.xml returned status ${pageData.sitemapStatus || "failed"} at default location. Sitemaps help crawlers find page URLs.`,
    });
  }

  // 2. Offer Clarity Scoring (Max: 100)
  let offerScore = 0;
  const h1s = pageData.headings.filter((h) => h.level === 1);
  if (h1s.length === 1) {
    offerScore += 60;
  } else if (h1s.length > 1) {
    offerScore += 30;
    findings.push({
      category: "offer",
      priority: "medium",
      title: "Multiple H1 headings detected",
      description: `Found ${h1s.length} H1 tags. Pages should generally have exactly one H1 tag representing the primary value proposition.`,
    });
  } else {
    findings.push({
      category: "offer",
      priority: "high",
      title: "Missing H1 heading tag",
      description: "No H1 heading was found. The page lacks a clear above-the-fold main headline.",
    });
  }

  if (pageData.headings.length > 3) {
    offerScore += 40;
  } else if (pageData.headings.length > 0) {
    offerScore += 20;
  } else {
    findings.push({
      category: "offer",
      priority: "high",
      title: "Sparse heading structure",
      description: "No structured headings (H1-H6) were found on the page, indicating weak layout hierarchy.",
    });
  }

  // 3. Conversion Readiness Scoring (Max: 100)
  let conversionScore = 0;
  if (pageData.ctas.length > 0) {
    conversionScore += 60;
  } else {
    findings.push({
      category: "conversion",
      priority: "high",
      title: "No Call-to-Action (CTA) elements detected",
      description: "No buttons, form submits, or button-style links were found. Users have no clear action path.",
    });
  }

  if (pageData.forms.length > 0) {
    conversionScore += 40;
  } else {
    findings.push({
      category: "conversion",
      priority: "medium",
      title: "No capture forms found",
      description: "No form structures were detected. Adding lead-capture forms or email signups improves lead conversion.",
    });
  }

  // 4. Content Opportunity Scoring (Max: 100)
  let contentScore = 0;
  const wordCount = pageData.bodyText.split(/\s+/).filter(Boolean).length;
  if (wordCount > 600) {
    contentScore += 60;
  } else if (wordCount > 250) {
    contentScore += 40;
  } else {
    contentScore += 20;
    findings.push({
      category: "content",
      priority: "medium",
      title: "Thin content density",
      description: `Found only around ${wordCount} words of text. Thin content pages may struggle to rank and might not provide enough context.`,
    });
  }

  const badImages = pageData.images.filter((img) => !img.alt);
  if (pageData.images.length > 0) {
    if (badImages.length === 0) {
      contentScore += 40;
    } else {
      const pct = Math.round((badImages.length / pageData.images.length) * 100);
      contentScore += Math.max(0, 40 - pct);
      findings.push({
        category: "content",
        priority: "medium",
        title: "Images missing alt tags",
        description: `${badImages.length} out of ${pageData.images.length} images (${pct}%) lack alt text, harming SEO and accessibility.`,
      });
    }
  } else {
    contentScore += 20;
  }

  // 5. Ad Readiness Scoring (Max: 100)
  let adScore = 0;
  const ogKeys = Object.keys(pageData.openGraph);
  if (ogKeys.length > 0) {
    const hasCoreOg = ["title", "description", "image"].every((k) => ogKeys.includes(k));
    if (hasCoreOg) {
      adScore += 80;
    } else {
      adScore += 40;
      findings.push({
        category: "ads",
        priority: "low",
        title: "Incomplete Open Graph markup",
        description: "Open Graph tags are present but missing core fields like og:image or og:description, which impacts social sharing cards.",
      });
    }
  } else {
    findings.push({
      category: "ads",
      priority: "medium",
      title: "Missing Open Graph metadata",
      description: "No og: tags were found. Sharing this page on social platforms will not render preview cards correctly.",
    });
  }

  if (pageData.jsonLd.length > 0) {
    adScore += 20;
  }

  // Generate Next Steps
  const nextSteps: string[] = [];
  if (findings.some((f) => f.category === "seo" && f.priority === "high")) {
    nextSteps.push("Address critical SEO issues (missing title/description tags)");
  }
  if (findings.some((f) => f.category === "offer" && f.priority === "high")) {
    nextSteps.push("Establish a single, clear H1 heading for the primary value proposition");
  }
  if (findings.some((f) => f.category === "conversion" && f.priority === "high")) {
    nextSteps.push("Add a prominent Call-to-Action (CTA) above the fold and at key section endings");
  }
  if (badImages.length > 0) {
    nextSteps.push("Add descriptive alt tags to your images");
  }
  if (ogKeys.length === 0) {
    nextSteps.push("Add Open Graph meta tags to control preview cards on social networks");
  }
  nextSteps.push("Configure custom rules in next version to detail growth checklists");

  const overall = Math.round((seoScore + offerScore + conversionScore + contentScore + adScore) / 5);

  return {
    tool: "OpenGrowth",
    version: "0.2.0",
    url,
    context: context || "No business context provided.",
    generatedAt: new Date().toISOString(),
    score: {
      overall,
      categories: {
        offerClarity: offerScore,
        conversionReadiness: conversionScore,
        seoFoundation: seoScore,
        contentOpportunity: contentScore,
        adReadiness: adScore,
      },
    },
    findings,
    nextSteps,
    pageData,
  };
}

/**
 * Generate a Markdown report from audit data.
 */
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
  lines.push(`| Offer Clarity | ${audit.score.categories.offerClarity}/100 |`);
  lines.push(`| Conversion Readiness | ${audit.score.categories.conversionReadiness}/100 |`);
  lines.push(`| SEO Foundation | ${audit.score.categories.seoFoundation}/100 |`);
  lines.push(`| Content Opportunity | ${audit.score.categories.contentOpportunity}/100 |`);
  lines.push(`| Ad Readiness | ${audit.score.categories.adReadiness}/100 |`);
  lines.push("");

  if (audit.pageData) {
    lines.push("## Page Summary");
    lines.push("");
    lines.push(`- **Page Title:** ${audit.pageData.title || "*None*"}`);
    lines.push(`- **Meta Description:** ${audit.pageData.metaDescription || "*None*"}`);
    lines.push(`- **Total Headings:** ${audit.pageData.headings.length}`);
    lines.push(`- **Total Links:** ${audit.pageData.links.length} (${audit.pageData.links.filter((l) => l.isInternal).length} internal, ${audit.pageData.links.filter((l) => !l.isInternal).length} external)`);
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
      const priorityIcon =
        finding.priority === "high"
          ? "🔴"
          : finding.priority === "medium"
            ? "🟡"
            : "🟢";
      lines.push(`### ${priorityIcon} [${finding.priority.toUpperCase()}] ${finding.title}`);
      lines.push("");
      lines.push(`**Category:** ${finding.category}`);
      lines.push("");
      lines.push(finding.description);
      lines.push("");
    }
  }

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
  lines.push("## Version Notice");
  lines.push("");
  lines.push(
    `> This is a v0.2 crawler-driven audit. More sophisticated scoring and rules will be introduced in v0.3.`,
  );
  lines.push("");
  lines.push(`*Generated by OpenGrowth v${audit.version} on ${audit.generatedAt}*`);
  lines.push("");

  return lines.join("\n");
}

/**
 * Print a CLI-friendly audit summary to stdout.
 */
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
    console.log(`  Links:         ${audit.pageData.links.length} total (${audit.pageData.links.filter((l) => l.isInternal).length} internal)`);
    console.log(`  Images:        ${audit.pageData.images.length} total`);
    console.log(`  CTAs found:    ${audit.pageData.ctas.length} elements`);
    console.log(`  Forms:         ${audit.pageData.forms.length} forms`);
    console.log("");
  }
  console.log("  ── Growth Score ──────────────────────────────────────");
  console.log(`  Overall:               ${audit.score.overall}/100`);
  console.log("");
  console.log("  ── Category Breakdown ────────────────────────────────");
  console.log(`  Offer Clarity:         ${audit.score.categories.offerClarity}/100`);
  console.log(`  Conversion Readiness:  ${audit.score.categories.conversionReadiness}/100`);
  console.log(`  SEO Foundation:        ${audit.score.categories.seoFoundation}/100`);
  console.log(`  Content Opportunity:   ${audit.score.categories.contentOpportunity}/100`);
  console.log(`  Ad Readiness:          ${audit.score.categories.adReadiness}/100`);
  console.log("");
  console.log(`  ── Findings (${audit.findings.length}) ───────────────────────────────────`);
  if (audit.findings.length === 0) {
    console.log("  🎉 No issues detected!");
  } else {
    for (const finding of audit.findings.slice(0, 8)) {
      const icon =
        finding.priority === "high"
          ? "🔴"
          : finding.priority === "medium"
            ? "🟡"
            : "🟢";
      console.log(`  ${icon} [${finding.priority.toUpperCase()}] ${finding.title}`);
    }
    if (audit.findings.length > 8) {
      console.log(`  ... and ${audit.findings.length - 8} more findings`);
    }
  }
  console.log("");
}

/**
 * Run the audit command.
 */
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
    // 1. Fetch main page content
    const fetchResult = await fetchPage(normalizedUrl);
    
    // 2. Parse main page content
    const parsedData = parseHtml(fetchResult.html, fetchResult.finalUrl);
    
    // 3. Resolve base origin for robots / sitemaps checks
    const origin = new URL(fetchResult.finalUrl).origin;
    const robotsTxtUrl = `${origin}/robots.txt`;
    const sitemapUrl = `${origin}/sitemap.xml`;
    
    console.log("  🌐 Checking robots.txt and sitemap.xml...");
    const [robotsTxtStatus, sitemapStatus] = await Promise.all([
      getUrlStatus(robotsTxtUrl),
      getUrlStatus(sitemapUrl),
    ]);
    
    const pageData: PageData = {
      ...parsedData,
      robotsTxtStatus,
      sitemapStatus,
    };
    
    // 4. Generate scorecard / audit result
    const audit = runHeuristicAudit(normalizedUrl, options.context, pageData);
    
    // Print summary to terminal
    printAuditSummary(audit);

    // Create output directory
    const outputDir = resolve(process.cwd(), options.output);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write scorecard.json
    const scorecardPath = resolve(outputDir, "scorecard.json");
    writeFileSync(scorecardPath, JSON.stringify(audit, null, 2), "utf-8");

    // Write report.md
    const reportPath = resolve(outputDir, "report.md");
    const markdown = generateMarkdownReport(audit);
    writeFileSync(reportPath, markdown, "utf-8");

    console.log("  ── Output Files ─────────────────────────────────────");
    console.log(`  📄 ${scorecardPath}`);
    console.log(`  📄 ${reportPath}`);
    console.log("");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n  ❌ Audit failed: ${message}\n`);
    process.exit(1);
  }
}
