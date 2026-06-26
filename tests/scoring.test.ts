/**
 * Unit tests for the v0.3.1 scoring calculator.
 *
 * Tests verify the formula behaviour using controlled rule sets,
 * without relying on the registry (so rule changes don't break scoring tests).
 */

import { describe, it, expect } from "vitest";
import { calculateScore, CATEGORY_WEIGHTS } from "../src/scoring/calculator.js";
import { getAllRules } from "../src/rules/registry.js";
import { runRules } from "../src/rules/runner.js";
import { Rule, RuleResult, RuleCategory } from "../src/rules/types.js";
import { PageData } from "../src/models/page-data.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Build a minimal Rule stub for controlled scoring tests. */
function makeRule(
  id: string,
  category: RuleCategory,
  weight: number,
  passes: boolean,
): Rule {
  return {
    id,
    title: id,
    category,
    severity: "medium",
    weight,
    evaluate(): RuleResult {
      return {
        ruleId: id,
        passed: passes,
        score: passes ? 100 : 0,
        title: id,
        category,
        severity: "medium",
        description: passes ? "Passed." : "Failed.",
        evidence: [],
        recommendation: "Recommendation",
      };
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY_WEIGHTS sanity checks
// ─────────────────────────────────────────────────────────────────────────────

describe("CATEGORY_WEIGHTS", () => {
  it("all seven categories are defined", () => {
    const cats: RuleCategory[] = [
      "seo",
      "content",
      "conversion",
      "trust",
      "technical",
      "offer",
      "ads",
    ];
    for (const cat of cats) {
      expect(CATEGORY_WEIGHTS[cat]).toBeDefined();
    }
  });

  it("all weights sum to 1.0", () => {
    const total = Object.values(CATEGORY_WEIGHTS).reduce((s, w) => s + w, 0);
    expect(total).toBeCloseTo(1.0, 5);
  });

  it("every weight is positive", () => {
    for (const w of Object.values(CATEGORY_WEIGHTS)) {
      expect(w).toBeGreaterThan(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateScore — basic formula
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateScore", () => {
  it("returns 100 overall when all rules pass", () => {
    const rules: Rule[] = [
      makeRule("seo-a", "seo", 50, true),
      makeRule("seo-b", "seo", 50, true),
      makeRule("content-a", "content", 100, true),
      makeRule("conversion-a", "conversion", 100, true),
      makeRule("trust-a", "trust", 100, true),
      makeRule("technical-a", "technical", 100, true),
      makeRule("offer-a", "offer", 100, true),
      makeRule("ads-a", "ads", 100, true),
    ];
    const results = rules.map((r) => r.evaluate());
    const card = calculateScore(results, rules);
    expect(card.overall).toBe(100);
  });

  it("returns 0 overall when all rules fail (excluding categories with 0 rules)", () => {
    const rules: Rule[] = [
      makeRule("seo-a", "seo", 50, false),
      makeRule("seo-b", "seo", 50, false),
      makeRule("content-a", "content", 100, false),
      makeRule("conversion-a", "conversion", 100, false),
      makeRule("trust-a", "trust", 100, false),
      makeRule("technical-a", "technical", 100, false),
      makeRule("offer-a", "offer", 100, false),
      makeRule("ads-a", "ads", 100, false),
    ];
    const results = rules.map((r) => r.evaluate());
    const card = calculateScore(results, rules);
    expect(card.overall).toBe(0);
  });

  it("category score is 50 when exactly half the weight passes", () => {
    const rules: Rule[] = [
      makeRule("seo-pass", "seo", 50, true),
      makeRule("seo-fail", "seo", 50, false),
      makeRule("content-a", "content", 100, true),
      makeRule("conversion-a", "conversion", 100, true),
      makeRule("trust-a", "trust", 100, true),
      makeRule("technical-a", "technical", 100, true),
      makeRule("offer-a", "offer", 100, true),
      makeRule("ads-a", "ads", 100, true),
    ];
    const results = rules.map((r) => r.evaluate());
    const card = calculateScore(results, rules);
    expect(card.categories.seo).toBe(50);
  });

  it("category score uses weight proportionally (25/100 = 25)", () => {
    const rules: Rule[] = [
      makeRule("seo-pass", "seo", 25, true),
      makeRule("seo-fail", "seo", 75, false),
      makeRule("content-a", "content", 100, true),
      makeRule("conversion-a", "conversion", 100, true),
      makeRule("trust-a", "trust", 100, true),
      makeRule("technical-a", "technical", 100, true),
      makeRule("offer-a", "offer", 100, true),
      makeRule("ads-a", "ads", 100, true),
    ];
    const results = rules.map((r) => r.evaluate());
    const card = calculateScore(results, rules);
    expect(card.categories.seo).toBe(25);
  });

  it("returns a ScoreCard with all seven category keys", () => {
    const rules = getAllRules();
    const page: PageData = {
      url: "https://example.com",
      canonicalUrl: "https://example.com",
      title: "Example",
      metaDescription: "A description that is long enough to pass the rule check for length.",
      headings: [{ level: 1, text: "Headline" }, { level: 2, text: "Sub" }, { level: 3, text: "Sub2" }],
      links: [
        { href: "/privacy", text: "privacy policy", isInternal: true },
        { href: "/contact", text: "contact support", isInternal: true }
      ],
      images: [],
      ctas: [
        { text: "Get Started Now", tag: "button" },
        { text: "Learn More", tag: "a" }
      ],
      forms: [],
      bodyText: "Scale your business with ease. We have amazing client testimonials and customer reviews. " + "word ".repeat(300),
      openGraph: { title: "OG Title", description: "OG Desc", image: "img.png" },
      jsonLd: [{}],
      robotsTxtStatus: 200,
      sitemapStatus: 200,
    };
    const results = runRules(page, rules);
    const card = calculateScore(results, rules);
    expect(card.categories).toHaveProperty("seo");
    expect(card.categories).toHaveProperty("content");
    expect(card.categories).toHaveProperty("conversion");
    expect(card.categories).toHaveProperty("trust");
    expect(card.categories).toHaveProperty("technical");
    expect(card.categories).toHaveProperty("offer");
    expect(card.categories).toHaveProperty("ads");
  });

  it("overall score is within 0-100 range for any input", () => {
    const rules = getAllRules();
    const emptyData: PageData = {
      url: "https://example.com",
      headings: [],
      links: [],
      images: [],
      ctas: [],
      forms: [],
      bodyText: "",
      openGraph: {},
      jsonLd: [],
      robotsTxtStatus: 404,
      sitemapStatus: 404,
    };
    const results = runRules(emptyData, rules);
    const card = calculateScore(results, rules);
    expect(card.overall).toBeGreaterThanOrEqual(0);
    expect(card.overall).toBeLessThanOrEqual(100);
  });

  it("overall score reflects weighted category scores (manual calculation check)", () => {
    // seo=100 (0.2), content=100 (0.15), conversion=100 (0.2), trust=100 (0.15), technical=100 (0.05), offer=100 (0.15), ads=0 (0.1)
    // Expected overall = 100*0.2 + 100*0.15 + 100*0.2 + 100*0.15 + 100*0.05 + 100*0.15 + 0*0.1 = 90
    const rules: Rule[] = [
      makeRule("seo-a", "seo", 100, true),
      makeRule("content-a", "content", 100, true),
      makeRule("conversion-a", "conversion", 100, true),
      makeRule("trust-a", "trust", 100, true),
      makeRule("technical-a", "technical", 100, true),
      makeRule("offer-a", "offer", 100, true),
      makeRule("ads-a", "ads", 100, false),
    ];
    const results = rules.map((r) => r.evaluate());
    const card = calculateScore(results, rules);
    expect(card.overall).toBe(90);
  });

  it("category with no rules gets score of 100 (so it does not penalise)", () => {
    // Only seo rules present — other categories should score 100
    const rules: Rule[] = [makeRule("seo-a", "seo", 100, true)];
    const results = rules.map((r) => r.evaluate());
    const card = calculateScore(results, rules);
    expect(card.categories.seo).toBe(100);
    expect(card.categories.offer).toBe(100);
    expect(card.categories.conversion).toBe(100);
    expect(card.categories.content).toBe(100);
    expect(card.categories.trust).toBe(100);
    expect(card.categories.technical).toBe(100);
    expect(card.categories.ads).toBe(100);
  });
});
