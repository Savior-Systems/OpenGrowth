import { describe, it, expect } from "vitest";
import { PageData } from "../src/models/page-data.js";
import { RuleResult } from "../src/rules/types.js";
import { ScoreCard } from "../src/scoring/calculator.js";
import { extractKeywords } from "../src/strategy/keyword-extractor.js";
import {
  generateContentStrategy,
  detectContentGaps,
  generateTopicClusters,
} from "../src/strategy/content-strategy.js";
import { generateContentCalendar } from "../src/strategy/calendar.js";
import { generateContentStrategyMarkdown } from "../src/strategy/markdown.js";

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
      { href: "/privacy", text: "Privacy Policy Link", isInternal: true },
    ],
    images: [{ src: "dashboard.png", alt: "Feedback dashboard illustration" }],
    ctas: [
      { text: "Get Started Free", tag: "button" },
      { text: "Book a Demo Now", tag: "a" },
    ],
    forms: [],
    bodyText: "Scale your workflow with user comments and review mechanisms. We help teams collaborate on requests.",
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
    evidence: [],
    recommendation: "None",
  },
  {
    ruleId: "conversion-cta-present",
    category: "conversion",
    severity: "high",
    passed: false,
    score: 0,
    title: "Call-to-Action (CTA) elements are present",
    description: "No CTAs found on the page.",
    evidence: [],
    recommendation: "Add prominent buttons.",
  },
];

const mockScorecard: ScoreCard = {
  overall: 70,
  categories: {
    seo: 100,
    content: 100,
    conversion: 50,
    trust: 100,
    technical: 100,
    offer: 100,
    ads: 100,
  },
};

describe("Content Strategy Generator", () => {
  describe("extractKeywords", () => {
    it("extracts keywords and phrases from title/headings/context", () => {
      const keywords = extractKeywords({
        page: testPage(),
        context: "SaaS customer feedback management platform",
      });

      expect(keywords.length).toBeGreaterThan(0);
      // Ensure it captures important phrases or words
      const terms = keywords.map((k) => k.term);
      expect(terms).toContain("feedback");
      expect(terms).toContain("customer feedback");
    });

    it("removes stopwords and short terms", () => {
      const keywords = extractKeywords({ page: testPage() });
      const terms = keywords.map((k) => k.term);
      expect(terms).not.toContain("and");
      expect(terms).not.toContain("the");
      expect(terms).not.toContain("for");
      expect(terms.every((t) => t.length >= 3)).toBe(true);
    });
  });

  describe("detectContentGaps", () => {
    it("generates gaps from failed rule results", () => {
      const gaps = detectContentGaps({
        page: testPage(),
        ruleResults: mockRuleResults,
        scorecard: mockScorecard,
      });

      expect(gaps.length).toBe(1);
      expect(gaps[0].type).toBe("conversion");
      expect(gaps[0].severity).toBe("high");
      expect(gaps[0].recommendation).toBe("Add prominent buttons.");
    });
  });

  describe("generateTopicClusters", () => {
    it("returns at least 5 topic clusters, each with suggested pages", () => {
      const keywords = extractKeywords({ page: testPage() });
      const clusters = generateTopicClusters({
        page: testPage(),
        keywords,
        gaps: [],
      });

      expect(clusters.length).toBeGreaterThanOrEqual(5);
      clusters.forEach((c) => {
        expect(c.suggestedPages.length).toBeGreaterThanOrEqual(3);
        c.suggestedPages.forEach((p) => {
          expect(p.title).toBeTruthy();
          expect(p.angle).toBeTruthy();
          expect(p.whyThisMatters).toBeTruthy();
          expect(p.suggestedOutline.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("generateContentStrategy", () => {
    it("returns a complete ContentStrategy object", () => {
      const strategy = generateContentStrategy({
        page: testPage(),
        context: "Neutral SaaS platform",
        ruleResults: mockRuleResults,
        scorecard: mockScorecard,
      });

      expect(strategy.url).toBe("https://mysaastool.com");
      expect(strategy.context).toBe("Neutral SaaS platform");
      expect(strategy.summary).toBeTruthy();
      expect(strategy.landingPageIdeas.length).toBeGreaterThanOrEqual(5);
      expect(strategy.blogIdeas.length).toBeGreaterThanOrEqual(10);
      expect(strategy.faqIdeas.length).toBeGreaterThanOrEqual(10);
      expect(strategy.distributionIdeas.length).toBeGreaterThanOrEqual(8);
      expect(strategy.calendar30Days.length).toBe(30);
      expect(strategy.nextSteps.length).toBeGreaterThan(0);
    });

    it("works without business context", () => {
      const strategy = generateContentStrategy({
        page: testPage(),
        ruleResults: mockRuleResults,
        scorecard: mockScorecard,
      });

      expect(strategy.context).toBe("");
      expect(strategy.calendar30Days.length).toBe(30);
    });

    it("output is deterministic for same input", () => {
      const s1 = generateContentStrategy({
        page: testPage(),
        context: "test",
        ruleResults: mockRuleResults,
        scorecard: mockScorecard,
      });
      const s2 = generateContentStrategy({
        page: testPage(),
        context: "test",
        ruleResults: mockRuleResults,
        scorecard: mockScorecard,
      });

      expect(s1).toEqual(s2);
    });
  });

  describe("Markdown Export", () => {
    it("includes required sections in the Markdown report", () => {
      const strategy = generateContentStrategy({
        page: testPage(),
        ruleResults: mockRuleResults,
        scorecard: mockScorecard,
      });
      const md = generateContentStrategyMarkdown(strategy);

      expect(md).toContain("# OpenGrowth Content Strategy");
      expect(md).toContain("## Summary");
      expect(md).toContain("## Extracted Keywords");
      expect(md).toContain("## Topic Clusters");
      expect(md).toContain("## Content Gaps");
      expect(md).toContain("## Landing Page Ideas");
      expect(md).toContain("## Blog Ideas");
      expect(md).toContain("## FAQ Ideas");
      expect(md).toContain("## Distribution Ideas");
      expect(md).toContain("## 30-Day Content Calendar");
      expect(md).toContain("## Recommended Next Steps");
      expect(md).toContain("## Version Notice");
    });
  });
});
