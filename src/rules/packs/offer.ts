/**
 * Offer Clarity rule pack — 2 rules.
 *
 * Evaluates whether the page communicates a clear value proposition through
 * heading structure and layout hierarchy.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const offerRules: Rule[] = [
  {
    id: "offer-single-h1",
    title: "Exactly one H1 heading is present",
    category: "offer",
    severity: "high",
    weight: 60,
    evaluate(page: PageData): RuleResult {
      const h1s = page.headings.filter((h) => h.level === 1);
      const passed = h1s.length === 1;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `One H1 heading found: "${h1s[0].text}".`
          : h1s.length === 0
            ? "No H1 heading found. Pages should have exactly one H1 as the primary value proposition."
            : `${h1s.length} H1 headings found. Only one H1 should exist to anchor the page's main message.`,
        evidence: [{ label: "H1 count", value: h1s.length }],
        recommendation: passed
          ? "No action needed."
          : h1s.length === 0
            ? "Add a single, clear H1 tag that states your core value proposition."
            : "Keep only one H1 per page. Promote secondary headings to H2.",
      };
    },
  },

  {
    id: "offer-heading-structure",
    title: "Page has a rich heading hierarchy (3+ headings total)",
    category: "offer",
    severity: "medium",
    weight: 40,
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
          ? `${count} headings found — good structural hierarchy.`
          : `Only ${count} heading(s) found. A richer heading structure improves content scannability and SEO.`,
        evidence: [{ label: "total headings", value: count }],
        recommendation: passed
          ? "No action needed."
          : "Add H2/H3 headings to break up your content into scannable sections.",
      };
    },
  },
];
