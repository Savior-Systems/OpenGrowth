import type { PageData } from "../models/page-data.js";
import type { RuleResult } from "../rules/types.js";
import type { ContentStrategy } from "../strategy/types.js";
import type { AdStrategy } from "../ads/types.js";
import { escapeHtml, clampScore, scoreLabel, formatList, slugify } from "./html-utils.js";

export interface HtmlReportInput {
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
  contentStrategy?: ContentStrategy;
  adStrategy?: AdStrategy;
}

/**
 * Generate a standalone, visually polished, single-file HTML report.
 */
export function generateHtmlReport(input: HtmlReportInput): string {
  const overall = clampScore(input.score.overall);
  const overallClass = scoreLabel(overall);
  const passedRules = input.ruleResults.filter((r) => r.passed).length;
  const totalRules = input.ruleResults.length;
  const highFindings = input.findings.filter((f) => f.severity === "critical" || f.severity === "high").length;

  const html: string[] = [];

  // HTML Head and Styles
  html.push(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OpenGrowth Audit Report - ${escapeHtml(input.url)}</title>
  <style>
    :root {
      --color-bg: #f8fafc;
      --color-card-bg: #ffffff;
      --color-text-main: #1e293b;
      --color-text-muted: #64748b;
      --color-slate-900: #0f172a;
      --color-slate-800: #1e293b;
      --color-slate-700: #334155;
      
      /* Severity Ratings */
      --color-critical: #ef4444;
      --color-weak: #f97316;
      --color-fair: #fbbf24;
      --color-good: #34d399;
      --color-excellent: #10b981;
      
      --font-stack: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-stack);
      background-color: var(--color-bg);
      color: var(--color-text-main);
      line-height: 1.5;
      padding-bottom: 4rem;
    }

    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Header Styling */
    header {
      background-color: var(--color-slate-900);
      color: #ffffff;
      padding: 2.5rem 0;
      border-bottom: 4px solid var(--color-excellent);
    }

    .header-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .header-grid {
        grid-template-columns: 1fr;
      }
    }

    .header-title h1 {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
    }

    .header-title p {
      color: var(--color-text-muted);
      font-size: 1rem;
    }

    .meta-badge {
      display: inline-block;
      background-color: var(--color-slate-800);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      color: #ffffff;
      margin-top: 0.5rem;
    }

    /* Score Badge Circle */
    .overall-score-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--color-slate-800);
      border: 4px solid;
      border-radius: 50%;
      width: 140px;
      height: 140px;
      text-align: center;
    }
    
    .overall-score-badge.critical { border-color: var(--color-critical); }
    .overall-score-badge.weak { border-color: var(--color-weak); }
    .overall-score-badge.fair { border-color: var(--color-fair); }
    .overall-score-badge.good { border-color: var(--color-good); }
    .overall-score-badge.excellent { border-color: var(--color-excellent); }

    .overall-score-badge .num {
      font-size: 3rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
    }

    .overall-score-badge .lbl {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      margin-top: 0.25rem;
    }

    /* Main Section Cards */
    .section-card {
      background-color: var(--color-card-bg);
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 2rem;
      margin-top: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-slate-900);
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .grid-2, .grid-3 {
        grid-template-columns: 1fr;
      }
    }

    /* Category Scoring Visual */
    .category-bar-wrapper {
      margin-bottom: 1.25rem;
    }

    .category-bar-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.35rem;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .category-bar-outer {
      background-color: #f1f5f9;
      height: 12px;
      border-radius: 9999px;
      overflow: hidden;
    }

    .category-bar-inner {
      height: 100%;
      border-radius: 9999px;
    }
    
    .category-bar-inner.critical { background-color: var(--color-critical); }
    .category-bar-inner.weak { background-color: var(--color-weak); }
    .category-bar-inner.fair { background-color: var(--color-fair); }
    .category-bar-inner.good { background-color: var(--color-good); }
    .category-bar-inner.excellent { background-color: var(--color-excellent); }

    /* Chips & Badges */
    .chip {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .chip.critical { background-color: #fee2e2; color: #991b1b; }
    .chip.weak { background-color: #ffedd5; color: #9a3412; }
    .chip.fair { background-color: #fef3c7; color: #92400e; }
    .chip.good { background-color: #d1fae5; color: #065f46; }
    .chip.excellent { background-color: #d1fae5; color: #065f46; }

    /* Findings & Lists */
    .findings-card {
      background-color: #fafafa;
      border-left: 4px solid var(--color-critical);
      padding: 1.25rem;
      border-radius: 0 0.5rem 0.5rem 0;
      margin-bottom: 1rem;
    }
    
    .findings-card.severity-high { border-left-color: var(--color-critical); }
    .findings-card.severity-medium { border-left-color: var(--color-weak); }
    .findings-card.severity-low { border-left-color: var(--color-fair); }
    .findings-card.severity-info { border-left-color: #3b82f6; }

    .findings-meta {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .findings-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--color-slate-800);
    }

    .findings-recommendation {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 0.75rem;
      border-radius: 0.25rem;
      margin-top: 0.75rem;
      font-size: 0.9rem;
      color: #166534;
    }

    /* Website Intelligence Grid */
    .intel-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      text-align: center;
    }

    @media (max-width: 900px) {
      .intel-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .intel-item {
      background-color: #f8fafc;
      padding: 1.25rem;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
    }

    .intel-val {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-slate-900);
    }

    .intel-lbl {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      margin-top: 0.25rem;
      font-weight: 600;
    }

    /* Collapsible Groupings */
    details {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
      overflow: hidden;
    }

    summary {
      padding: 1rem;
      font-weight: 700;
      cursor: pointer;
      outline: none;
      background-color: #f8fafc;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    summary:hover {
      background-color: #f1f5f9;
    }

    .details-content {
      padding: 1.25rem;
      border-top: 1px solid #e2e8f0;
      background-color: #ffffff;
    }

    /* Lists */
    ul {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.35rem;
    }

    /* Strategy Calendar */
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
    }

    @media (max-width: 900px) {
      .calendar-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (max-width: 600px) {
      .calendar-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .calendar-day {
      border: 1px solid #e2e8f0;
      border-radius: 0.35rem;
      padding: 0.75rem;
      background-color: #ffffff;
      min-height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .calendar-day-header {
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--color-text-muted);
      margin-bottom: 0.35rem;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 0.25rem;
    }

    .calendar-day-body {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-slate-800);
      margin-bottom: 0.5rem;
    }

    .calendar-day-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
    }

    /* Copy blocks */
    pre {
      background-color: #1e293b;
      color: #f8fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      font-family: Consolas, Monaco, monospace;
      font-size: 0.9rem;
      overflow-x: auto;
      margin: 0.75rem 0;
      white-space: pre-wrap;
    }

    /* Print-specific styles */
    @media print {
      body {
        background-color: #ffffff;
        color: #000000;
      }
      .section-card {
        border: none;
        box-shadow: none;
        padding: 0;
        margin-top: 1.5rem;
        page-break-inside: avoid;
      }
      details {
        page-break-inside: avoid;
      }
      .overall-score-badge {
        background: none;
        color: #000000;
        border: 2px solid #000000;
      }
      .overall-score-badge .num, .overall-score-badge .lbl {
        color: #000000;
      }
    }
  </style>
</head>
<body>

  <!-- Section 1: Hero / Summary -->
  <header>
    <div class="container header-grid">
      <div class="header-title">
        <h1>🚀 OpenGrowth Audit Report</h1>
        <p>Comprehensive website audit for growth, content, conversion, and ad readiness.</p>
        <div class="meta-badge">URL: ${escapeHtml(input.url)}</div>
        <div class="meta-badge">Date: ${escapeHtml(input.generatedAt)}</div>
        <div class="meta-badge">CLI Version: ${escapeHtml(input.version)}</div>
        <div style="margin-top: 1rem; color: #cbd5e1; font-size: 0.95rem; max-width: 800px;">
          <strong>Business Context:</strong> ${escapeHtml(input.context)}
        </div>
      </div>
      
      <!-- Section 2: Scorecard -->
      <div class="overall-score-badge ${overallClass}">
        <span class="num">${overall}</span>
        <span class="lbl">${overallClass}</span>
      </div>
    </div>
  </header>

  <div class="container">

    <!-- Section 3: Category Scores -->
    <div class="section-card" id="category-scores">
      <div class="section-title">
        <span>📊 Category Breakdown</span>
        <span class="chip ${overallClass}">Score: ${overall}/100</span>
      </div>
      <div class="grid-2">
        <div>
          <!-- SEO -->
          <div class="category-bar-wrapper">
            <div class="category-bar-meta">
              <span>SEO Foundation</span>
              <span>${clampScore(input.score.categories.seo)}/100</span>
            </div>
            <div class="category-bar-outer">
              <div class="category-bar-inner ${scoreLabel(input.score.categories.seo)}" style="width: ${clampScore(input.score.categories.seo)}%"></div>
            </div>
          </div>
          <!-- Content -->
          <div class="category-bar-wrapper">
            <div class="category-bar-meta">
              <span>Content Opportunity</span>
              <span>${clampScore(input.score.categories.content)}/100</span>
            </div>
            <div class="category-bar-outer">
              <div class="category-bar-inner ${scoreLabel(input.score.categories.content)}" style="width: ${clampScore(input.score.categories.content)}%"></div>
            </div>
          </div>
          <!-- Conversion -->
          <div class="category-bar-wrapper">
            <div class="category-bar-meta">
              <span>Conversion Readiness</span>
              <span>${clampScore(input.score.categories.conversion)}/100</span>
            </div>
            <div class="category-bar-outer">
              <div class="category-bar-inner ${scoreLabel(input.score.categories.conversion)}" style="width: ${clampScore(input.score.categories.conversion)}%"></div>
            </div>
          </div>
          <!-- Trust -->
          <div class="category-bar-wrapper">
            <div class="category-bar-meta">
              <span>Trust Signals</span>
              <span>${clampScore(input.score.categories.trust)}/100</span>
            </div>
            <div class="category-bar-outer">
              <div class="category-bar-inner ${scoreLabel(input.score.categories.trust)}" style="width: ${clampScore(input.score.categories.trust)}%"></div>
            </div>
          </div>
        </div>

        <div>
          <!-- Technical -->
          <div class="category-bar-wrapper">
            <div class="category-bar-meta">
              <span>Technical SEO</span>
              <span>${clampScore(input.score.categories.technical)}/100</span>
            </div>
            <div class="category-bar-outer">
              <div class="category-bar-inner ${scoreLabel(input.score.categories.technical)}" style="width: ${clampScore(input.score.categories.technical)}%"></div>
            </div>
          </div>
          <!-- Offer -->
          <div class="category-bar-wrapper">
            <div class="category-bar-meta">
              <span>Offer Clarity</span>
              <span>${clampScore(input.score.categories.offer)}/100</span>
            </div>
            <div class="category-bar-outer">
              <div class="category-bar-inner ${scoreLabel(input.score.categories.offer)}" style="width: ${clampScore(input.score.categories.offer)}%"></div>
            </div>
          </div>
          <!-- Ads -->
          <div class="category-bar-wrapper">
            <div class="category-bar-meta">
              <span>Ad Readiness</span>
              <span>${clampScore(input.score.categories.ads)}/100</span>
            </div>
            <div class="category-bar-outer">
              <div class="category-bar-inner ${scoreLabel(input.score.categories.ads)}" style="width: ${clampScore(input.score.categories.ads)}%"></div>
            </div>
          </div>
          <!-- Audit Metrics -->
          <div style="background-color: #f8fafc; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 1rem; border: 1px solid #e2e8f0; font-size: 0.9rem;">
            <div>Rules Passed: <strong>${passedRules}/${totalRules}</strong></div>
            <div style="margin-top: 0.25rem;">High Priority Issues: <strong>${highFindings}</strong></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: High Priority Findings -->
    <div class="section-card" id="high-priority-findings">
      <div class="section-title">
        <span>⚠️ High Priority Findings (${highFindings})</span>
      </div>
      `);

  if (input.findings.length === 0) {
    html.push(`<p style="color: var(--color-excellent); font-weight: 600;">✅ Excellent! No high priority findings. Your page meets essential conversion and security baselines.</p>`);
  } else {
    for (const f of input.findings) {
      const isHigh = f.severity === "critical" || f.severity === "high";
      if (isHigh) {
        html.push(`
        <div class="findings-card severity-${escapeHtml(f.severity)}">
          <div class="findings-meta">
            <span class="chip critical">${escapeHtml(f.severity)}</span>
            <span class="chip fair">${escapeHtml(f.category)}</span>
          </div>
          <div class="findings-title">${escapeHtml(f.title)}</div>
          <p style="margin-bottom: 0.5rem; color: var(--color-slate-700);">${escapeHtml(f.description)}</p>
          <div class="findings-recommendation"><strong>Action:</strong> ${escapeHtml(f.recommendation)}</div>
        </div>`);
      }
    }
    // If no findings are critical/high but there are medium ones
    const hasCriticalHigh = input.findings.some((f) => f.severity === "critical" || f.severity === "high");
    if (!hasCriticalHigh) {
      html.push(`<p style="color: var(--color-text-muted);">No critical or high-severity issues found. Review medium and low priority items in the Rule Results section below.</p>`);
    }
  }

  html.push(`
    </div>

    <!-- Section 5: Website Intelligence -->
    <div class="section-card" id="website-intelligence">
      <div class="section-title">
        <span>🔍 Website Intelligence</span>
      </div>
      `);

  if (input.pageData) {
    const pd = input.pageData;
    const h1Count = pd.headings.filter((h) => h.level === 1).length;
    const internalLinks = pd.links.filter((l) => l.isInternal).length;
    const externalLinks = pd.links.filter((l) => !l.isInternal).length;

    html.push(`
      <div style="margin-bottom: 1.5rem; background-color: #fafafa; padding: 1.25rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
        <div style="margin-bottom: 0.5rem;"><strong>Page Title:</strong> ${escapeHtml(pd.title || "*No Title tag found*")}</div>
        <div style="margin-bottom: 0.5rem;"><strong>Meta Description:</strong> ${escapeHtml(pd.metaDescription || "*No Meta Description found*")}</div>
        <div><strong>Canonical URL:</strong> ${escapeHtml(pd.canonicalUrl || "*No Canonical tag found*")}</div>
      </div>
      <div class="intel-grid">
        <div class="intel-item">
          <div class="intel-val">${h1Count}</div>
          <div class="intel-lbl">H1 Headings</div>
        </div>
        <div class="intel-item">
          <div class="intel-val">${pd.headings.length}</div>
          <div class="intel-lbl">Total Headings</div>
        </div>
        <div class="intel-item">
          <div class="intel-val">${internalLinks}</div>
          <div class="intel-lbl">Internal Links</div>
        </div>
        <div class="intel-item">
          <div class="intel-val">${externalLinks}</div>
          <div class="intel-lbl">External Links</div>
        </div>
        <div class="intel-item">
          <div class="intel-val">${pd.images.length}</div>
          <div class="intel-lbl">Total Images</div>
        </div>
        <div class="intel-item">
          <div class="intel-val">${pd.ctas.length}</div>
          <div class="intel-lbl">CTA Elements</div>
        </div>
        <div class="intel-item">
          <div class="intel-val">${pd.forms.length}</div>
          <div class="intel-lbl">Input Forms</div>
        </div>
        <div class="intel-item">
          <div class="intel-val">${pd.robotsTxtStatus}</div>
          <div class="intel-lbl">robots.txt Status</div>
        </div>
      </div>
    `);
  } else {
    html.push(`<p style="color: var(--color-text-muted);">No page data available.</p>`);
  }

  html.push(`
    </div>

    <!-- Section 6: Rule Results -->
    <div class="section-card" id="rule-results">
      <div class="section-title">
        <span>📋 Rule Checklist</span>
      </div>
      `);

  // Group rules by category
  const categoriesList = ["seo", "content", "conversion", "trust", "technical", "offer", "ads"];
  for (const cat of categoriesList) {
    const catRules = input.ruleResults.filter((r) => r.category === cat);
    if (catRules.length > 0) {
      const catScore = clampScore(input.score.categories[cat as keyof typeof input.score.categories] || 0);
      const catClass = scoreLabel(catScore);
      html.push(`
      <details>
        <summary>
          <span>${cat.toUpperCase()} Checks</span>
          <span class="chip ${catClass}" style="margin-left: 1rem;">Score: ${catScore}/100</span>
        </summary>
        <div class="details-content">
          `);
      for (const r of catRules) {
        const statusIcon = r.passed ? "🟢" : "🔴";
        const statusText = r.passed ? "Passed" : "Failed";
        const statusClass = r.passed ? "good" : "critical";
        html.push(`
          <div style="border-bottom: 1px solid #f1f5f9; padding: 1rem 0; display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700;">
              <span>${statusIcon}</span>
              <span style="color: var(--color-slate-800);">${escapeHtml(r.title)}</span>
              <span class="chip ${statusClass}">${statusText}</span>
              <span class="chip info" style="background-color: #f1f5f9; color: var(--color-text-muted); font-size: 0.7rem;">${escapeHtml(r.severity)}</span>
            </div>
            <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.25rem;">${escapeHtml(r.description)}</p>
            ${r.evidence && r.evidence.length > 0 ? `<div style="font-size: 0.85rem; color: var(--color-slate-700); margin-top: 0.25rem;"><strong>Evidence:</strong> ${escapeHtml(r.evidence.map(e => `${e.label}: ${Array.isArray(e.value) ? e.value.join(', ') : e.value}`).join('; '))}</div>` : ""}
            ${!r.passed && r.recommendation ? `<div style="font-size: 0.85rem; color: #b45309; background-color: #fffbeb; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid #fde68a; margin-top: 0.25rem;"><strong>Recommendation:</strong> ${escapeHtml(r.recommendation)}</div>` : ""}
          </div>
        `);
      }
      html.push(`
        </div>
      </details>
      `);
    }
  }

  html.push(`
    </div>

    <!-- Section 7: Content Strategy -->
    <div class="section-card" id="content-strategy">
      <div class="section-title">
        <span>📝 Content Strategy</span>
      </div>
      `);

  if (input.contentStrategy) {
    const cs = input.contentStrategy;
    html.push(`
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
        <strong>Strategic Summary:</strong>
        <p style="margin-top: 0.5rem; color: var(--color-slate-700);">${escapeHtml(cs.summary)}</p>
      </div>

      <!-- Keywords -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">🔑 Top Extracted Keywords</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
          `);
    // Limit to top 20
    const topKeywords = cs.extractedKeywords ? cs.extractedKeywords.slice(0, 20) : [];
    for (const kw of topKeywords) {
      html.push(`
          <span style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.85rem; font-weight: 600; color: var(--color-slate-700);">
            ${escapeHtml(kw.term)} <span style="font-size: 0.7rem; color: var(--color-text-muted);">(${kw.weight})</span>
          </span>
      `);
    }
    html.push(`
        </div>
      </div>

      <!-- Section 8: Topic Clusters -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">📂 Topic Clusters</h3>
        `);
    for (const cluster of cs.topicClusters) {
      html.push(`
        <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; background-color: #fafafa;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            <strong style="color: var(--color-slate-800);">${escapeHtml(cluster.name)}</strong>
            <div>
              <span class="chip good">${escapeHtml(cluster.intent)}</span>
              <span class="chip fair">${escapeHtml(cluster.priority)} priority</span>
            </div>
          </div>
          <div style="font-size: 0.9rem; color: var(--color-slate-700); margin-bottom: 0.5rem;"><strong>Focus:</strong> ${escapeHtml(cluster.reason)}</div>
          <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.5rem;"><strong>Keywords:</strong> ${escapeHtml(cluster.keywords.join(", "))}</div>
          <div style="font-size: 0.85rem;">
            <strong>Suggested Pages:</strong>
            <ul style="margin-left: 1.25rem; margin-top: 0.25rem;">
              `);
      const pages = cluster.suggestedPages || [];
      for (const p of pages) {
        html.push(`
              <li><strong>${escapeHtml(p.title)}</strong> (${escapeHtml(p.format)} - ${escapeHtml(p.funnelStage)}) - <em>Angle: ${escapeHtml(p.angle)}</em></li>
        `);
      }
      html.push(`
            </ul>
          </div>
        </div>
      `);
    }
    html.push(`
      </div>

      <!-- Section 9: Content Gaps -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">🚪 Content Gaps Detected</h3>
        `);
    if (cs.contentGaps && cs.contentGaps.length > 0) {
      for (const gap of cs.contentGaps) {
        html.push(`
        <div style="background-color: #fff7ed; border-left: 4px solid #f97316; border-radius: 0 0.5rem 0.5rem 0; padding: 1rem; margin-bottom: 0.75rem; border-top: 1px solid #ffedd5; border-right: 1px solid #ffedd5; border-bottom: 1px solid #ffedd5;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="chip weak">${escapeHtml(gap.severity)}</span>
            <span class="chip info" style="background-color: #ffedd5; color: #ea580c;">${escapeHtml(gap.type)} gap</span>
          </div>
          <strong style="color: var(--color-slate-900); font-size: 1rem; display: block; margin-bottom: 0.25rem;">${escapeHtml(gap.title)}</strong>
          <p style="font-size: 0.9rem; color: var(--color-slate-700); margin-bottom: 0.25rem;"><strong>Evidence:</strong> ${escapeHtml(gap.evidence)}</p>
          <div style="font-size: 0.9rem; color: #9a3412; font-weight: 600; margin-top: 0.5rem;"><strong>Recommendation:</strong> ${escapeHtml(gap.recommendation)}</div>
        </div>
        `);
      }
    } else {
      html.push(`<p style="color: var(--color-excellent); font-weight: 600;">✅ No content gaps identified. Your page has complete and aligned copy parameters.</p>`);
    }
    html.push(`
      </div>

      <!-- Section 10: 30-Day Content Calendar -->
      <div>
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">📅 30-Day Content Roadmap</h3>
        <div class="calendar-grid">
          `);
    for (const item of cs.calendar30Days) {
      html.push(`
          <div class="calendar-day">
            <div class="calendar-day-header">Day ${item.day}</div>
            <div class="calendar-day-body">${escapeHtml(item.title)}</div>
            <div class="calendar-day-footer">
              <span style="color: #475569; font-weight: 700; font-size: 0.65rem; background-color: #f1f5f9; padding: 0.1rem 0.25rem; border-radius: 2px;">${escapeHtml(item.format)}</span>
              <span style="color: #64748b;">${escapeHtml(item.intent).split("-")[0]}</span>
            </div>
          </div>
      `);
    }
    html.push(`
        </div>
      </div>
    `);
  } else {
    html.push(`<p style="color: var(--color-text-muted);">No Content Strategy generated.</p>`);
  }

  html.push(`
    </div>

    <!-- Section 11: Ad Strategy -->
    <div class="section-card" id="ad-strategy">
      <div class="section-title">
        <span>🎯 Ad Strategy & Copy Variations</span>
      </div>
      `);

  if (input.adStrategy) {
    const ads = input.adStrategy;
    html.push(`
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
        <strong>Ad Strategy Summary:</strong>
        <p style="margin-top: 0.5rem; color: var(--color-slate-700);">${escapeHtml(ads.summary)}</p>
      </div>

      <!-- Section 12: Audience Segments -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">👥 Targeted Audience Segments</h3>
        <div class="grid-2">
          `);
    for (const seg of ads.audienceSegments) {
      html.push(`
          <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; background-color: #fafafa;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <strong style="color: var(--color-slate-900);">${escapeHtml(seg.name)}</strong>
              <span class="chip good">${escapeHtml(seg.stage)}</span>
            </div>
            <div style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Pain Point:</strong> ${escapeHtml(seg.painPoint)}</div>
            <div style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Outcome:</strong> ${escapeHtml(seg.desiredOutcome)}</div>
            <div style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Message Focus:</strong> ${escapeHtml(seg.messageFocus)}</div>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);"><strong>Platforms:</strong> ${escapeHtml(seg.suggestedPlatforms.join(", "))}</div>
          </div>
      `);
    }
    html.push(`
        </div>
      </div>

      <!-- Value Propositions -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">💡 Value Propositions</h3>
        <div class="grid-3">
          `);
    const valProps = ads.valuePropositions || [];
    for (const vp of valProps) {
      const vClass = vp.strength === "high" ? "excellent" : vp.strength === "medium" ? "fair" : "weak";
      html.push(`
          <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; background-color: #ffffff;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <strong style="color: var(--color-slate-900); font-size: 0.95rem;">${escapeHtml(vp.title)}</strong>
              <span class="chip ${vClass}">${escapeHtml(vp.strength)}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--color-slate-700); margin-bottom: 0.5rem;">${escapeHtml(vp.description)}</p>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);"><em>Evidence: ${escapeHtml(vp.evidence)}</em></div>
          </div>
      `);
    }
    html.push(`
        </div>
      </div>

      <!-- Section 13: Ad Hooks -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">🪝 Ad Hooks (Top 20)</h3>
        <div style="display: grid; grid-template-columns: 1fr; gap: 0.5rem;">
          `);
    const topHooks = ads.hooks ? ads.hooks.slice(0, 20) : [];
    for (const hook of topHooks) {
      html.push(`
          <div style="border: 1px solid #e2e8f0; border-radius: 0.35rem; padding: 0.75rem 1rem; background-color: #fafafa; display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="font-weight: 700; color: var(--color-slate-900);">"${escapeHtml(hook.text)}"</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">
              Family: <strong>${escapeHtml(hook.family)}</strong> | Fits: <strong>${escapeHtml(hook.platformFit.join(", "))}</strong> | <em>${escapeHtml(hook.reason)}</em>
            </div>
          </div>
      `);
    }
    html.push(`
        </div>
      </div>

      <!-- Section 14: Ad Copy Variants -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">📢 Ad Copy Variants (Top 24)</h3>
        <div class="grid-2">
          `);
    const topCopy = ads.adCopyVariants ? ads.adCopyVariants.slice(0, 24) : [];
    for (const copy of topCopy) {
      html.push(`
          <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.25rem; background-color: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
                <strong style="color: #1e3a8a; text-transform: uppercase; font-size: 0.85rem;">Platform: ${escapeHtml(copy.platform)}</strong>
                <div>
                  <span class="chip info" style="background-color: #eff6ff; color: #2563eb; font-size: 0.7rem;">${escapeHtml(copy.stage)}</span>
                  <span class="chip info" style="background-color: #f1f5f9; color: var(--color-text-muted); font-size: 0.7rem;">${escapeHtml(copy.family)}</span>
                </div>
              </div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.5rem;">Headline: ${escapeHtml(copy.headline)}</div>
              ${copy.description ? `<div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Description: ${escapeHtml(copy.description)}</div>` : ""}
              <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-slate-700); margin-bottom: 0.25rem;">Primary Text:</div>
              <pre>${escapeHtml(copy.primaryText)}</pre>
            </div>
            <div style="margin-top: 0.75rem; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; font-size: 0.8rem; color: var(--color-text-muted);">
              <div><strong>CTA Button:</strong> ${escapeHtml(copy.cta)}</div>
              <div style="margin-top: 0.25rem;"><strong>Creative direction:</strong> ${escapeHtml(copy.creativeNote)}</div>
            </div>
          </div>
      `);
    }
    html.push(`
        </div>
      </div>

      <!-- Section 15: Short Video Concepts -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">📹 Short-Form Video / Script Concepts</h3>
        <div class="grid-2">
          `);
    const videos = ads.shortVideoConcepts || [];
    for (const video of videos) {
      html.push(`
          <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.25rem; background-color: #fafafa;">
            <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
              <strong style="color: var(--color-slate-900); font-size: 1rem;">${escapeHtml(video.title)}</strong>
              <span class="chip good">${escapeHtml(video.platformFit.join(", "))}</span>
            </div>
            <div style="font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Opening Hook:</strong> "${escapeHtml(video.hook)}"</div>
            <div style="font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Visual Style:</strong> ${escapeHtml(video.visualDirection)}</div>
            <div style="font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Script Flow:</strong>
              <ol style="margin-left: 1.25rem; margin-top: 0.25rem; font-size: 0.8rem; color: var(--color-slate-700);">
                `);
      for (const step of video.structure) {
        html.push(`
                <li>${escapeHtml(step)}</li>
        `);
      }
      html.push(`
              </ol>
            </div>
            <div style="border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.8rem;">
              <div><strong>Caption Idea:</strong> <em>${escapeHtml(video.captionIdea)}</em></div>
              <div style="margin-top: 0.25rem;"><strong>CTA:</strong> <strong>${escapeHtml(video.cta)}</strong></div>
            </div>
          </div>
      `);
    }
    html.push(`
        </div>
      </div>

      <!-- Section 16: Carousel Concepts -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">🎠 Retargeting Carousel Outlines</h3>
        `);
    const carousels = ads.carouselConcepts || [];
    for (const carousel of carousels) {
      html.push(`
        <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.25rem; background-color: #ffffff; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; margin-bottom: 0.75rem; align-items: center;">
            <strong style="color: var(--color-slate-900); font-size: 1.05rem;">${escapeHtml(carousel.title)}</strong>
            <div>
              <span class="chip good">${escapeHtml(carousel.platformFit.join(", "))}</span>
              <span class="chip info" style="background-color: #f1f5f9; color: var(--color-text-muted);">${carousel.slides.length} slides</span>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 0.75rem;">
            `);
      for (const slide of carousel.slides) {
        html.push(`
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 0.75rem; border-radius: 0.35rem; font-size: 0.8rem;">
              <div style="font-weight: 800; color: var(--color-text-muted); border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; margin-bottom: 0.35rem;">Slide ${slide.slide}</div>
              <div style="font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.25rem;">${escapeHtml(slide.headline)}</div>
              <div style="margin-bottom: 0.25rem; color: var(--color-slate-700);">${escapeHtml(slide.body)}</div>
              <div style="color: var(--color-text-muted); font-size: 0.75rem;"><em>Visual: ${escapeHtml(slide.visualDirection)}</em></div>
            </div>
        `);
      }
      html.push(`
          </div>
          <div style="font-size: 0.85rem; color: var(--color-slate-800);"><strong>CTA:</strong> <strong>${escapeHtml(carousel.cta)}</strong></div>
        </div>
      `);
    }
    html.push(`
      </div>

      <!-- Section 17: Creative Directions -->
      <div>
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-slate-800);">🎨 Creative Directions (Text Briefs)</h3>
        <div class="grid-2">
          `);
    const creativeDirs = ads.creativeDirections || [];
    for (const cd of creativeDirs) {
      html.push(`
          <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.25rem; background-color: #fafafa;">
            <strong style="color: var(--color-slate-900); font-size: 1.05rem; display: block; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">${escapeHtml(cd.mood.split(",")[0])} Aesthetic</strong>
            <div style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Mood:</strong> ${escapeHtml(cd.mood)}</div>
            <div style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Visual Style:</strong> ${escapeHtml(cd.visualStyle)}</div>
            <div style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Composition layout:</strong> ${escapeHtml(cd.composition)}</div>
            <div style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Proof Elements:</strong> ${escapeHtml(cd.proofElements.join(", "))}</div>
            <div style="font-size: 0.85rem; color: #991b1b;"><strong>Avoid:</strong> ${escapeHtml(cd.avoid.join(", "))}</div>
          </div>
      `);
    }
    html.push(`
        </div>
      </div>
    `);
  } else {
    html.push(`<p style="color: var(--color-text-muted);">No Ad Strategy generated.</p>`);
  }

  html.push(`
    </div>

    <!-- Section 18: Recommended Next Steps -->
    <div class="section-card" id="recommended-next-steps">
      <div class="section-title">
        <span>🚀 Prioritised Execution Checklist</span>
      </div>
      <ul style="margin-left: 1.5rem; font-size: 1.05rem; color: var(--color-slate-800);">
        `);
  for (const step of input.nextSteps) {
    html.push(`
        <li style="margin-bottom: 0.5rem;">[ ] ${escapeHtml(step)}</li>
    `);
  }
  html.push(`
      </ul>
    </div>

    <!-- Section 19: Version Notice -->
    <div style="text-align: center; margin-top: 3rem; font-size: 0.8rem; color: var(--color-text-muted); border-top: 1px solid #e2e8f0; padding-top: 1.5rem;">
      <p>This is OpenGrowth v0.6. Standing HTML Report is generated locally without remote fonts or external track assets.</p>
      <p style="margin-top: 0.25rem;">Built with ❤️ by Savior Systems</p>
    </div>

  </div>
</body>
</html>
`);

  return html.join("\n");
}
