/**
 * Content Opportunity rule pack — 5 rules.
 *
 * Evaluates the depth and quality of page content to assess its potential
 * for ranking, engagement, and conversion.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const contentRules: Rule[] = [
  {
    id: "content-body-depth",
    title: "Page has sufficient content depth (250+ words)",
    category: "content",
    severity: "medium",
    weight: 25,
    evaluate(page: PageData): RuleResult {
      const wordCount = page.bodyText.split(/\s+/).filter(Boolean).length;
      const passed = wordCount >= 250;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : Math.round((wordCount / 250) * 100),
        title: this.title,
        description: passed
          ? `${wordCount} words found — sufficient content depth.`
          : `Only ~${wordCount} words found. Thin content may struggle to rank and lacks enough context for visitors.`,
        evidence: [{ label: "word count", value: wordCount }],
        recommendation: passed
          ? "No action needed."
          : "Expand the page content to at least 250 words. Cover your topic comprehensively.",
      };
    },
  },

  {
    id: "content-heading-depth",
    title: "Page uses a structured heading hierarchy",
    category: "content",
    severity: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      const count = page.headings.length;
      const passed = count >= 3;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `${count} headings detected — good structural depth.`
          : `Only ${count} heading(s) detected. More heading structure improves scannability and SEO signals.`,
        evidence: [{ label: "total headings", value: count }],
        recommendation: passed
          ? "No action needed."
          : "Break content into sections with descriptive H2/H3 headings.",
      };
    },
  },

  {
    id: "content-internal-links",
    title: "Page contains internal links",
    category: "content",
    severity: "low",
    weight: 15,
    evaluate(page: PageData): RuleResult {
      const internalLinks = page.links.filter((l) => l.isInternal);
      const passed = internalLinks.length > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `${internalLinks.length} internal link(s) found — good internal navigation.`
          : "No internal links found. Internal links distribute page authority and improve site navigation.",
        evidence: [
          { label: "internal links", value: internalLinks.length },
          { label: "total links", value: page.links.length },
        ],
        recommendation: passed
          ? "No action needed."
          : "Add 2–5 internal links to related pages, products, or blog posts.",
      };
    },
  },

  {
    id: "content-context-alignment",
    title: "Page content reflects provided business context",
    category: "content",
    severity: "info",
    weight: 20,
    evaluate(page: PageData, context?: string): RuleResult {
      if (!context || context.trim().length < 5) {
        // No context provided — neutral informational result
        return {
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          passed: true,
          score: 100,
          title: this.title,
          description:
            "No business context provided — context alignment check skipped. Use --context to enable this check.",
          evidence: [{ label: "context provided", value: false }],
          recommendation: "Run with --context 'your business description' to check content alignment.",
        };
      }
      const contextWords = context
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);
      const pageContent = (page.bodyText + " " + page.headings.map((h) => h.text).join(" ")).toLowerCase();
      const matchedWords = contextWords.filter((w) => pageContent.includes(w));
      const alignmentPct = contextWords.length > 0
        ? Math.round((matchedWords.length / contextWords.length) * 100)
        : 100;
      const passed = alignmentPct >= 40;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: Math.min(100, alignmentPct),
        title: this.title,
        description: passed
          ? `Content aligns with context at ${alignmentPct}% keyword overlap.`
          : `Content alignment is low (${alignmentPct}% overlap with context keywords). The page may not reflect the stated business focus.`,
        evidence: [
          { label: "alignment", value: `${alignmentPct}%` },
          { label: "matched keywords", value: matchedWords.slice(0, 5) },
        ],
        recommendation: passed
          ? "No action needed."
          : "Ensure key terms from your business context appear naturally in headings and body copy.",
      };
    },
  },

  {
    id: "content-image-alt-tags",
    title: "All images have descriptive alt text",
    category: "content",
    severity: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      if (page.images.length === 0) {
        return {
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          passed: true,
          score: 100,
          title: this.title,
          description: "No images found — alt text rule is not applicable.",
          evidence: [{ label: "image count", value: 0 }],
          recommendation: "When adding images, always include descriptive alt text.",
        };
      }
      const missing = page.images.filter((img) => !img.alt).length;
      const passed = missing === 0;
      const pct = Math.round((missing / page.images.length) * 100);
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : Math.max(0, 100 - pct),
        title: this.title,
        description: passed
          ? `All ${page.images.length} image(s) have alt text.`
          : `${missing} of ${page.images.length} image(s) (${pct}%) lack alt text, harming accessibility and image SEO.`,
        evidence: [
          { label: "missing alt", value: missing },
          { label: "total images", value: page.images.length },
        ],
        recommendation: passed
          ? "No action needed."
          : "Add descriptive alt attributes to all <img> elements. Describe what the image shows.",
      };
    },
  },
];
