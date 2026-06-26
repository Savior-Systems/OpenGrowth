import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { existsSync, rmSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isValidUrl, normalizeUrl } from "../src/utils/url.js";
import {
  runHeuristicAudit,
  generateMarkdownReport,
  runAudit,
} from "../src/commands/audit.js";
import { PageData } from "../src/models/page-data.js";

// Helper dummy PageData
const dummyPageData: PageData = {
  url: "https://example.com",
  canonicalUrl: "https://example.com",
  title: "Example Domain",
  metaDescription: "This domain is for use in illustrative examples in documents.",
  headings: [
    { level: 1, text: "Example Domain" },
    { level: 2, text: "More Information" },
  ],
  links: [
    { href: "https://www.iana.org/domains/reserved", text: "More information...", isInternal: false },
  ],
  images: [],
  ctas: [
    { text: "More information...", href: "https://www.iana.org/domains/reserved", tag: "a" },
  ],
  forms: [],
  bodyText: "Example Domain This domain is for use in illustrative examples in documents. More Information...",
  openGraph: {},
  jsonLd: [],
  robotsTxtStatus: 200,
  sitemapStatus: 404,
};

// ──────────────────────────────────────────────────────────────
// URL Validation
// ──────────────────────────────────────────────────────────────

describe("isValidUrl", () => {
  it("accepts https URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  it("accepts http URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("accepts bare domains (will be normalized)", () => {
    expect(isValidUrl("example.com")).toBe(true);
  });

  it("accepts domains with paths", () => {
    expect(isValidUrl("https://example.com/pricing")).toBe(true);
  });

  it("rejects empty strings", () => {
    expect(isValidUrl("")).toBe(false);
  });

  it("rejects plain words without a dot", () => {
    expect(isValidUrl("notaurl")).toBe(false);
  });

  it("rejects random text", () => {
    expect(isValidUrl("hello world")).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// URL Normalization
// ──────────────────────────────────────────────────────────────

describe("normalizeUrl", () => {
  it("adds https:// to bare domains", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });

  it("preserves existing https://", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("preserves existing http://", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("lowercases the hostname", () => {
    expect(normalizeUrl("https://EXAMPLE.COM")).toBe("https://example.com");
  });

  it("preserves paths", () => {
    expect(normalizeUrl("https://example.com/pricing")).toBe(
      "https://example.com/pricing",
    );
  });
});

// ──────────────────────────────────────────────────────────────
// Heuristic Audit Generation
// ──────────────────────────────────────────────────────────────

describe("runHeuristicAudit", () => {
  it("returns correct tool name", () => {
    const audit = runHeuristicAudit("https://example.com", "", dummyPageData);
    expect(audit.tool).toBe("OpenGrowth");
  });

  it("returns correct version", () => {
    const audit = runHeuristicAudit("https://example.com", "", dummyPageData);
    expect(audit.version).toBe("0.2.0");
  });

  it("includes the provided URL", () => {
    const audit = runHeuristicAudit("https://test.com", "", dummyPageData);
    expect(audit.url).toBe("https://test.com");
  });

  it("includes context when provided", () => {
    const audit = runHeuristicAudit("https://test.com", "SaaS product", dummyPageData);
    expect(audit.context).toBe("SaaS product");
  });

  it("has an overall score calculated from pageData", () => {
    const audit = runHeuristicAudit("https://test.com", "", dummyPageData);
    expect(audit.score.overall).toBeTypeOf("number");
    expect(audit.score.overall).toBeGreaterThanOrEqual(0);
    expect(audit.score.overall).toBeLessThanOrEqual(100);
  });

  it("has all category scores", () => {
    const audit = runHeuristicAudit("https://test.com", "", dummyPageData);
    expect(audit.score.categories.offerClarity).toBeTypeOf("number");
    expect(audit.score.categories.conversionReadiness).toBeTypeOf("number");
    expect(audit.score.categories.seoFoundation).toBeTypeOf("number");
    expect(audit.score.categories.contentOpportunity).toBeTypeOf("number");
    expect(audit.score.categories.adReadiness).toBeTypeOf("number");
  });

  it("has findings array containing heuristic problems", () => {
    const audit = runHeuristicAudit("https://test.com", "", dummyPageData);
    expect(audit.findings).toBeInstanceOf(Array);
    // Since sitemap is 404 and forms are empty, it should have some findings
    expect(audit.findings.length).toBeGreaterThan(0);
  });

  it("includes generatedAt ISO timestamp", () => {
    const audit = runHeuristicAudit("https://test.com", "", dummyPageData);
    expect(audit.generatedAt).toBeTruthy();
    expect(new Date(audit.generatedAt).toISOString()).toBe(audit.generatedAt);
  });
});

// ──────────────────────────────────────────────────────────────
// Markdown Report Generation
// ──────────────────────────────────────────────────────────────

describe("generateMarkdownReport", () => {
  it("includes report title", () => {
    const audit = runHeuristicAudit("https://example.com", "test", dummyPageData);
    const md = generateMarkdownReport(audit);
    expect(md).toContain("# OpenGrowth Audit Report");
  });

  it("includes URL", () => {
    const md = generateMarkdownReport(
      runHeuristicAudit("https://example.com", "test", dummyPageData)
    );
    expect(md).toContain("https://example.com");
  });

  it("includes page summary metrics", () => {
    const audit = runHeuristicAudit("https://example.com", "test", dummyPageData);
    const md = generateMarkdownReport(audit);
    expect(md).toContain("Page Summary");
    expect(md).toContain("Total Headings:");
    expect(md).toContain("Total Links:");
  });
});

// ──────────────────────────────────────────────────────────────
// Audit File Output (integration with mock fetch)
// ──────────────────────────────────────────────────────────────

describe("runAudit file output", () => {
  const testOutputDir = resolve(process.cwd(), ".test-output-temp");
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true });
    }
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true });
    }
  });

  it("creates scorecard.json and report.md by fetching mock HTML", async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mock Page</title>
        <meta name="description" content="A simple test mock page.">
      </head>
      <body>
        <h1>Value Prop Headline</h1>
        <button>Click Here</button>
      </body>
      </html>
    `;

    // Mock fetch for page fetch, robotsTxt check, and sitemap check
    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => "text/html" } as unknown as Headers,
        text: async () => mockHtml,
        url: "https://example.com",
      } as unknown as Response) // Page fetch
      .mockResolvedValueOnce({ status: 200 } as unknown as Response) // robots.txt HEAD status
      .mockResolvedValueOnce({ status: 404 } as unknown as Response); // sitemap HEAD status

    await runAudit({
      url: "https://example.com",
      context: "Test context",
      output: ".test-output-temp",
      format: "json",
    });

    expect(existsSync(resolve(testOutputDir, "scorecard.json"))).toBe(true);
    expect(existsSync(resolve(testOutputDir, "report.md"))).toBe(true);

    const rawScorecard = readFileSync(resolve(testOutputDir, "scorecard.json"), "utf-8");
    const data = JSON.parse(rawScorecard);
    expect(data.tool).toBe("OpenGrowth");
    expect(data.version).toBe("0.2.0");
    expect(data.url).toBe("https://example.com");
    expect(data.pageData).toBeDefined();
    expect(data.pageData.title).toBe("Mock Page");
    expect(data.pageData.headings[0]).toEqual({ level: 1, text: "Value Prop Headline" });
  });
});
