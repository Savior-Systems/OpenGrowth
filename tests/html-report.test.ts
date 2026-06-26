import { describe, it, expect } from "vitest";
import { escapeHtml, clampScore, scoreLabel } from "../src/report/html-utils.js";
import { generateHtmlReport, HtmlReportInput } from "../src/report/html.js";
import { PageData } from "../src/models/page-data.js";
import { RuleResult } from "../src/rules/types.js";

// Helper fixture factories
function testPage(): PageData {
  return {
    url: "https://mysaastool.com",
    canonicalUrl: "https://mysaastool.com",
    title: "Best SaaS Feedback Tool for Growing Teams",
    metaDescription: "An optimized platform to collect customer feedback and manage product roadmaps.",
    headings: [
      { level: 1, text: "Automate Customer Feedback Management" },
      { level: 2, text: "Align Product Roadmaps" },
      { level: 3, text: "Integrate with Slack" },
    ],
    links: [
      { href: "/pricing", text: "View Pricing Plans", isInternal: true },
      { href: "https://twitter.com/mysaas", text: "Twitter Profile", isInternal: false },
    ],
    images: [{ src: "dashboard.png", alt: "Feedback dashboard illustration" }],
    ctas: [
      { text: "Get Started Free", tag: "button" },
      { text: "Book a Demo Now", tag: "a" },
    ],
    forms: [],
    bodyText: "Scale your workflow with user comments.",
    openGraph: {},
    jsonLd: [],
    robotsTxtStatus: 200,
    sitemapStatus: 200,
  };
}

const mockRuleResults: RuleResult[] = [
  {
    ruleId: "seo-title-exists",
    category: "seo",
    severity: "high",
    passed: true,
    score: 100,
    title: "Title tag is present",
    description: "Title is set.",
    evidence: [{ label: "tag found", value: "yes" }],
    recommendation: "None",
  },
  {
    ruleId: "conversion-cta-present",
    category: "conversion",
    severity: "high",
    passed: false,
    score: 0,
    title: "Call to Action is missing",
    description: "No clear CTA buttons were detected.",
    evidence: [{ label: "CTA count", value: 0 }],
    recommendation: "Add at least one primary Call-to-Action button above the fold.",
  },
];

const mockInput: HtmlReportInput = {
  tool: "OpenGrowth",
  version: "0.6.0",
  url: "https://mysaastool.com",
  context: "SaaS customer feedback platform",
  generatedAt: "2026-06-27T00:00:00.000Z",
  score: {
    overall: 80,
    categories: {
      seo: 100,
      content: 85,
      conversion: 60,
      trust: 70,
      technical: 90,
      offer: 80,
      ads: 75,
    },
  },
  findings: [
    {
      category: "conversion",
      severity: "high",
      title: "Call to Action is missing",
      description: "No clear CTA buttons were detected.",
      recommendation: "Add at least one primary Call-to-Action button above the fold.",
    },
  ],
  ruleResults: mockRuleResults,
  nextSteps: ["Fix: Call to Action is missing", "Improve heading layout"],
  pageData: testPage(),
  contentStrategy: {
    summary: "Standard content strategic summary",
    extractedKeywords: ["feedback", "product roadmap", "customer feedback"],
    topicClusters: [
      {
        name: "Feedback Collection",
        intent: "informational",
        priority: "high",
        reason: "Primary value prop",
        keywords: ["feedback", "comments"],
        suggestedPages: [],
      },
    ],
    contentGaps: [
      {
        type: "competitor-gap",
        severity: "medium",
        title: "Integration details",
        evidence: "No Slack integration page",
        recommendation: "Add integrations page",
      },
    ],
    calendar30Days: [
      {
        day: 1,
        title: "Introduction to Feedback Loops",
        format: "Blog Post",
        intent: "education",
        priority: "medium",
        goal: "Engage early leads",
      },
    ],
  },
  adStrategy: {
    summary: "Ad strategy summary",
    audienceSegments: [
      {
        name: "Product Managers",
        stage: "Awareness",
        painPoint: "Scattered feedback",
        desiredOutcome: "Centralized roadmap",
        messageFocus: "Save hours",
        suggestedPlatforms: ["LinkedIn"],
      },
    ],
    hooks: [
      {
        text: "Still managing feedback in spreadsheets?",
        family: "Question Hook",
        platformFit: ["LinkedIn"],
        reason: "Targets pain point",
      },
    ],
    adCopyVariants: [
      {
        platform: "LinkedIn",
        family: "Direct",
        stage: "ToFu",
        primaryText: "Streamline customer feedback.",
        headline: "Centralize Your Product Roadmap",
        cta: "Sign Up",
        creativeNote: "Show dashboard",
      },
    ],
  },
};

describe("HTML Report Utilities", () => {
  it("escapeHtml escapes all dangerous characters", () => {
    expect(escapeHtml("<div>Hello & Welcome 'User' & \"Admin\"</div>")).toBe(
      "&lt;div&gt;Hello &amp; Welcome &#39;User&#39; &amp; &quot;Admin&quot;&lt;/div&gt;"
    );
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(123)).toBe("123");
  });

  it("clampScore clamps and rounds values", () => {
    expect(clampScore(85.4)).toBe(85);
    expect(clampScore(85.6)).toBe(86);
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(105)).toBe(100);
    expect(clampScore(NaN)).toBe(0);
  });

  it("scoreLabel returns expected labels", () => {
    expect(scoreLabel(20)).toBe("critical");
    expect(scoreLabel(50)).toBe("weak");
    expect(scoreLabel(70)).toBe("fair");
    expect(scoreLabel(80)).toBe("good");
    expect(scoreLabel(95)).toBe("excellent");
  });
});

describe("HTML Report Generator", () => {
  it("generateHtmlReport returns a full HTML document with <!doctype html>", () => {
    const report = generateHtmlReport(mockInput);
    expect(report.trim().toLowerCase().startsWith("<!doctype html>")).toBe(true);
  });

  it("HTML report includes all key audit sections", () => {
    const report = generateHtmlReport(mockInput);
    expect(report).toContain("OpenGrowth Audit Report");
    expect(report).toContain("Category Scores");
    expect(report).toContain("High Priority Findings");
    expect(report).toContain("Content Strategy");
    expect(report).toContain("30-Day Content Calendar");
    expect(report).toContain("Ad Strategy");
    expect(report).toContain("Ad Copy Variants");
  });

  it("HTML report escapes malicious page title/context/rule evidence", () => {
    const maliciousInput: HtmlReportInput = {
      ...mockInput,
      url: "https://example.com/<script>alert('xss1')</script>",
      context: "Context <script>alert('xss2')</script>",
      findings: [
        {
          category: "conversion",
          severity: "high",
          title: "Title with <script>alert('xss3')</script>",
          description: "Desc <script>alert('xss4')</script>",
          recommendation: "Rec <script>alert('xss5')</script>",
        },
      ],
      ruleResults: [
        {
          ruleId: "xss-test",
          category: "conversion",
          severity: "high",
          passed: false,
          score: 0,
          title: "XSS Title <script>alert('xss6')</script>",
          description: "XSS Desc <script>alert('xss7')</script>",
          evidence: [{ label: "XSS Label <script>alert('xss8')</script>", value: "XSS Val <script>alert('xss9')</script>" }],
          recommendation: "XSS Rec <script>alert('xss10')</script>",
        },
      ],
    };

    const report = generateHtmlReport(maliciousInput);
    expect(report).not.toContain("<script>alert('xss");
    expect(report).toContain("&lt;script&gt;alert(&#39;xss1&#39;)&lt;/script&gt;");
    expect(report).toContain("&lt;script&gt;alert(&#39;xss2&#39;)&lt;/script&gt;");
    expect(report).toContain("&lt;script&gt;alert(&#39;xss3&#39;)&lt;/script&gt;");
    expect(report).toContain("&lt;script&gt;alert(&#39;xss6&#39;)&lt;/script&gt;");
    expect(report).toContain("&lt;script&gt;alert(&#39;xss8&#39;)&lt;/script&gt;");
    expect(report).toContain("&lt;script&gt;alert(&#39;xss9&#39;)&lt;/script&gt;");
  });

  it("HTML report includes embedded CSS and has no external CSS/JS/CDN references", () => {
    const report = generateHtmlReport(mockInput);
    expect(report).toContain("<style>");
    expect(report).toContain("body {");
    expect(report).not.toContain("<link rel=\"stylesheet\"");
    expect(report).not.toContain("<script src=");
    expect(report).not.toContain("https://cdnjs.cloudflare.com");
    expect(report).not.toContain("https://cdn.jsdelivr.net");
    expect(report).not.toContain("googleapi");
  });

  it("generated output is deterministic", () => {
    const report1 = generateHtmlReport(mockInput);
    const report2 = generateHtmlReport(mockInput);
    expect(report1).toBe(report2);
  });
});
