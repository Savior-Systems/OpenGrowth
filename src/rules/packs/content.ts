/**
 * Content Opportunity rule pack.
 *
 * Evaluates the depth and quality of page content to assess its potential
 * for ranking, engagement, and conversion.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const contentRules: Rule[] = [
  {
    id: "content-word-count",
    title: "Page has sufficient content depth (250+ words)",
    category: "content",
    priority: "medium",
    weight: 60,
    evaluate(page: PageData): RuleResult {
      const wordCount = page.bodyText.split(/\s+/).filter(Boolean).length;
      const passed = wordCount >= 250;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `${wordCount} words found — sufficient content depth.`
          : `Only ~${wordCount} words found. Thin content may struggle to rank and lacks enough context for visitors.`,
        evidence: `${wordCount} words`,
      };
    },
  },

  {
    id: "content-image-alt-tags",
    title: "All images have descriptive alt text",
    category: "content",
    priority: "medium",
    weight: 40,
    evaluate(page: PageData): RuleResult {
      if (page.images.length === 0) {
        // No images — rule passes by default (nothing to fail)
        return {
          ruleId: this.id,
          passed: true,
          title: this.title,
          category: this.category,
          priority: this.priority,
          description: "No images found on the page — alt text rule is not applicable.",
          evidence: "0 images",
        };
      }
      const missing = page.images.filter((img) => !img.alt).length;
      const passed = missing === 0;
      const pct = Math.round((missing / page.images.length) * 100);
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `All ${page.images.length} image(s) have alt text.`
          : `${missing} of ${page.images.length} image(s) (${pct}%) lack alt text, harming accessibility and image SEO.`,
        evidence: `${missing} missing / ${page.images.length} total`,
      };
    },
  },
];
