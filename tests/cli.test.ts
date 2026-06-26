import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, rmSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isValidUrl, normalizeUrl } from "../src/utils/url.js";
import {
  generatePlaceholderAudit,
  generateMarkdownReport,
  runAudit,
} from "../src/commands/audit.js";

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
// Placeholder Audit Generation
// ──────────────────────────────────────────────────────────────

describe("generatePlaceholderAudit", () => {
  it("returns correct tool name", () => {
    const audit = generatePlaceholderAudit("https://example.com", "");
    expect(audit.tool).toBe("OpenGrowth");
  });

  it("returns correct version", () => {
    const audit = generatePlaceholderAudit("https://example.com", "");
    expect(audit.version).toBe("0.1.0");
  });

  it("includes the provided URL", () => {
    const audit = generatePlaceholderAudit("https://test.com", "");
    expect(audit.url).toBe("https://test.com");
  });

  it("includes context when provided", () => {
    const audit = generatePlaceholderAudit("https://test.com", "SaaS product");
    expect(audit.context).toBe("SaaS product");
  });

  it("has an overall score", () => {
    const audit = generatePlaceholderAudit("https://test.com", "");
    expect(audit.score.overall).toBeTypeOf("number");
    expect(audit.score.overall).toBeGreaterThanOrEqual(0);
    expect(audit.score.overall).toBeLessThanOrEqual(100);
  });

  it("has all category scores", () => {
    const audit = generatePlaceholderAudit("https://test.com", "");
    expect(audit.score.categories.offerClarity).toBeTypeOf("number");
    expect(audit.score.categories.conversionReadiness).toBeTypeOf("number");
    expect(audit.score.categories.seoFoundation).toBeTypeOf("number");
    expect(audit.score.categories.contentOpportunity).toBeTypeOf("number");
    expect(audit.score.categories.adReadiness).toBeTypeOf("number");
  });

  it("has findings array", () => {
    const audit = generatePlaceholderAudit("https://test.com", "");
    expect(audit.findings).toBeInstanceOf(Array);
    expect(audit.findings.length).toBeGreaterThan(0);
  });

  it("has nextSteps array", () => {
    const audit = generatePlaceholderAudit("https://test.com", "");
    expect(audit.nextSteps).toBeInstanceOf(Array);
    expect(audit.nextSteps.length).toBeGreaterThan(0);
  });

  it("includes generatedAt ISO timestamp", () => {
    const audit = generatePlaceholderAudit("https://test.com", "");
    expect(audit.generatedAt).toBeTruthy();
    // Should be parseable as a date
    expect(new Date(audit.generatedAt).toISOString()).toBe(audit.generatedAt);
  });
});

// ──────────────────────────────────────────────────────────────
// Markdown Report Generation
// ──────────────────────────────────────────────────────────────

describe("generateMarkdownReport", () => {
  it("includes report title", () => {
    const audit = generatePlaceholderAudit("https://example.com", "test");
    const md = generateMarkdownReport(audit);
    expect(md).toContain("# OpenGrowth Audit Report");
  });

  it("includes URL", () => {
    const audit = generatePlaceholderAudit("https://example.com", "test");
    const md = generateMarkdownReport(audit);
    expect(md).toContain("https://example.com");
  });

  it("includes version notice", () => {
    const audit = generatePlaceholderAudit("https://example.com", "test");
    const md = generateMarkdownReport(audit);
    expect(md).toContain("v0.1 placeholder audit");
  });

  it("includes category scores table", () => {
    const audit = generatePlaceholderAudit("https://example.com", "test");
    const md = generateMarkdownReport(audit);
    expect(md).toContain("Offer Clarity");
    expect(md).toContain("SEO Foundation");
  });
});

// ──────────────────────────────────────────────────────────────
// Audit File Output (integration)
// ──────────────────────────────────────────────────────────────

describe("runAudit file output", () => {
  const testOutputDir = resolve(process.cwd(), ".test-output-temp");

  beforeEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true });
    }
  });

  it("creates scorecard.json", () => {
    runAudit({
      url: "https://example.com",
      context: "Test context",
      output: ".test-output-temp",
      format: "json",
    });
    expect(existsSync(resolve(testOutputDir, "scorecard.json"))).toBe(true);
  });

  it("creates report.md", () => {
    runAudit({
      url: "https://example.com",
      context: "Test context",
      output: ".test-output-temp",
      format: "json",
    });
    expect(existsSync(resolve(testOutputDir, "report.md"))).toBe(true);
  });

  it("scorecard.json contains valid audit data", () => {
    runAudit({
      url: "https://example.com",
      context: "Test context",
      output: ".test-output-temp",
      format: "json",
    });
    const raw = readFileSync(
      resolve(testOutputDir, "scorecard.json"),
      "utf-8",
    );
    const data = JSON.parse(raw);
    expect(data.tool).toBe("OpenGrowth");
    expect(data.version).toBe("0.1.0");
    expect(data.url).toBe("https://example.com");
    expect(data.score.overall).toBeTypeOf("number");
  });
});
