import { describe, it, expect } from "vitest";
import type { PageData } from "../src/models/page-data.js";
import type { RuleResult } from "../src/rules/types.js";
import type { ScoreCard } from "../src/scoring/calculator.js";
import type { ContentStrategy } from "../src/strategy/types.js";
import { extractAdInputs } from "../src/ads/angle-extractor.js";
import { generateAdStrategy } from "../src/ads/ad-angle-generator.js";
import { generateAdStrategyMarkdown } from "../src/ads/markdown.js";

// Mock PageData
const mockPageData: PageData = {
  url: "https://feedbacktool.com",
  canonicalUrl: "https://feedbacktool.com",
  title: "FeedbackTool - Customer Feedback Management Platform",
  metaDescription: "Collect, analyze, and organize client feedback for B2B SaaS teams.",
  headings: [
    { level: 1, text: "Customer Feedback Management" },
    { level: 2, text: "Automate Your Workflows" },
    { level: 2, text: "Pricing & Integrations" },
  ],
  links: [
    { href: "/privacy", text: "Privacy Policy", isInternal: true },
  ],
  images: [],
  ctas: [
    { text: "Start Free Trial", href: "/signup", tag: "a" },
  ],
  forms: [],
  bodyText: "FeedbackTool helps you organize B2B client testimonials and feedback. Slow processes cost time.",
  openGraph: {},
  jsonLd: [],
  robotsTxtStatus: 200,
  sitemapStatus: 200,
};

// Mock scorecard and rules
const mockScorecard: ScoreCard = {
  overall: 78,
  categories: {
    seo: 80,
    content: 75,
    conversion: 70,
    trust: 65, // Failed trust signals triggers weakArea
    technical: 90,
    offer: 85,
    ads: 70,
  },
};

const mockRuleResults: RuleResult[] = [
  { ruleId: "trust-privacy-policy", passed: false, category: "trust", severity: "high", title: "Privacy Policy Presence", description: "No privacy policy found.", recommendation: "Add it." },
  { ruleId: "seo-title", passed: true, category: "seo", severity: "medium", title: "Title tag optimal", description: "Good title.", recommendation: "None." },
];

// Mock ContentStrategy
const mockContentStrategy: ContentStrategy = {
  generatedAt: new Date().toISOString(),
  url: "https://feedbacktool.com",
  context: "SaaS feedback management",
  summary: "Content summary.",
  extractedKeywords: [
    { term: "feedback management", source: "title", weight: 15 },
    { term: "saas", source: "context", weight: 10 },
  ],
  topicClusters: [],
  contentGaps: [],
  landingPageIdeas: [],
  blogIdeas: [],
  faqIdeas: [],
  distributionIdeas: [],
  calendar30Days: [],
  nextSteps: [],
};

describe("Ad Angle Generator", () => {
  describe("extractAdInputs", () => {
    it("extracts primaryTopic from contentStrategy keywords", () => {
      const inputs = extractAdInputs({
        page: mockPageData,
        context: "SaaS feedback management",
        scorecard: mockScorecard,
        ruleResults: mockRuleResults,
        contentStrategy: mockContentStrategy,
      });

      expect(inputs.primaryTopic).toBe("feedback management");
    });

    it("returns graceful fallbacks without context or strategy keywords", () => {
      const emptyStrategy: ContentStrategy = {
        ...mockContentStrategy,
        extractedKeywords: [],
      };
      const emptyPage: PageData = {
        ...mockPageData,
        title: "",
        headings: [],
        bodyText: "",
        ctas: [],
        metaDescription: "",
      };

      const inputs = extractAdInputs({
        page: emptyPage,
        scorecard: mockScorecard,
        ruleResults: [],
        contentStrategy: emptyStrategy,
      });

      expect(inputs.primaryTopic).toBe("growth system");
      expect(inputs.audienceTerms).toContain("growth-focused teams");
      expect(inputs.problemTerms).toContain("unclear growth priorities");
    });
  });

  describe("generateAdStrategy", () => {
    const strategy = generateAdStrategy({
      page: mockPageData,
      context: "SaaS feedback management",
      scorecard: mockScorecard,
      ruleResults: mockRuleResults,
      contentStrategy: mockContentStrategy,
    });

    it("returns at least 5 audience segments", () => {
      expect(strategy.audienceSegments.length).toBeGreaterThanOrEqual(5);
    });

    it("returns at least 5 value propositions", () => {
      expect(strategy.valuePropositions.length).toBeGreaterThanOrEqual(5);
    });

    it("returns at least 20 hooks", () => {
      expect(strategy.hooks.length).toBeGreaterThanOrEqual(20);
    });

    it("returns at least 24 ad copy variants", () => {
      expect(strategy.adCopyVariants.length).toBeGreaterThanOrEqual(24);
    });

    it("returns at least 8 short video concepts", () => {
      expect(strategy.shortVideoConcepts.length).toBeGreaterThanOrEqual(8);
    });

    it("returns at least 5 carousel concepts, each with at least 5 slides", () => {
      expect(strategy.carouselConcepts.length).toBeGreaterThanOrEqual(5);
      for (const concept of strategy.carouselConcepts) {
        expect(concept.slides.length).toBeGreaterThanOrEqual(5);
      }
    });

    it("returns at least 5 creative directions", () => {
      expect(strategy.creativeDirections.length).toBeGreaterThanOrEqual(5);
    });

    it("avoids guaranteed-result blacklist words in generated copy", () => {
      const blacklist = ["guaranteed", "instant success", "100% results", "make millions", "risk-free"];

      for (const copy of strategy.adCopyVariants) {
        const fullText = (copy.primaryText + " " + copy.headline + " " + (copy.description || "")).toLowerCase();
        for (const word of blacklist) {
          expect(fullText).not.toContain(word);
        }
      }
    });

    it("includes required platform variants", () => {
      const platforms = strategy.adCopyVariants.map((c) => c.platform);
      expect(platforms).toContain("facebook");
      expect(platforms).toContain("instagram");
      expect(platforms).toContain("linkedin");
      expect(platforms).toContain("google-search");
      expect(platforms).toContain("youtube-shorts");
    });

    it("output is deterministic for same input", () => {
      const s1 = generateAdStrategy({
        page: mockPageData,
        context: "SaaS feedback management",
        scorecard: mockScorecard,
        ruleResults: mockRuleResults,
        contentStrategy: mockContentStrategy,
      });

      const s2 = generateAdStrategy({
        page: mockPageData,
        context: "SaaS feedback management",
        scorecard: mockScorecard,
        ruleResults: mockRuleResults,
        contentStrategy: mockContentStrategy,
      });

      s1.generatedAt = "mock-date";
      s2.generatedAt = "mock-date";
      expect(s1).toEqual(s2);
    });
  });

  describe("Markdown Export", () => {
    it("includes required sections in the Markdown report", () => {
      const strategy = generateAdStrategy({
        page: mockPageData,
        context: "SaaS feedback management",
        scorecard: mockScorecard,
        ruleResults: mockRuleResults,
        contentStrategy: mockContentStrategy,
      });

      const md = generateAdStrategyMarkdown(strategy);

      expect(md).toContain("# OpenGrowth Ad Strategy");
      expect(md).toContain("## Summary");
      expect(md).toContain("## Audience Segments");
      expect(md).toContain("## Value Propositions");
      expect(md).toContain("## Ad Hooks");
      expect(md).toContain("## Ad Copy Variants");
      expect(md).toContain("## Short Video Concepts");
      expect(md).toContain("## Carousel Concepts");
      expect(md).toContain("## Creative Directions");
      expect(md).toContain("## Recommended Next Steps");
      expect(md).toContain("## Version Notice");
    });
  });
});
