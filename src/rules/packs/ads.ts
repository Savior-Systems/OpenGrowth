/**
 * Ad Readiness rule pack.
 *
 * Evaluates whether the page has the metadata and structured data needed
 * for effective social sharing, paid ads, and rich search results.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const adsRules: Rule[] = [
  {
    id: "ads-open-graph-exists",
    title: "Open Graph (og:) metadata is present",
    category: "ads",
    priority: "medium",
    weight: 50,
    evaluate(page: PageData): RuleResult {
      const ogKeys = Object.keys(page.openGraph);
      const passed = ogKeys.length > 0;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `${ogKeys.length} Open Graph tag(s) found.`
          : "No og: meta tags found. Social shares and link previews will not render rich cards.",
        evidence: `${ogKeys.length} og: tag(s)`,
      };
    },
  },

  {
    id: "ads-open-graph-complete",
    title: "Open Graph has core fields: title, description, and image",
    category: "ads",
    priority: "low",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const ogKeys = Object.keys(page.openGraph);
      const coreKeys = ["title", "description", "image"];
      const missing = coreKeys.filter((k) => !ogKeys.includes(k));
      const passed = missing.length === 0;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? "Open Graph has title, description, and image — complete for social sharing."
          : ogKeys.length === 0
            ? "No Open Graph tags are present to evaluate completeness."
            : `Missing core Open Graph properties: ${missing.map((k) => `og:${k}`).join(", ")}.`,
        evidence:
          missing.length > 0
            ? `Missing: ${missing.map((k) => `og:${k}`).join(", ")}`
            : "All core og: fields present",
      };
    },
  },

  {
    id: "ads-json-ld",
    title: "Structured data (JSON-LD) is present",
    category: "ads",
    priority: "low",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      const passed = page.jsonLd.length > 0;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `${page.jsonLd.length} JSON-LD block(s) found — enables rich search results.`
          : "No JSON-LD structured data found. Adding schema.org markup can unlock rich snippets in search.",
        evidence: `${page.jsonLd.length} JSON-LD block(s)`,
      };
    },
  },
];
