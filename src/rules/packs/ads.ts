/**
 * Ad Readiness rule pack — 3 rules.
 *
 * Evaluates lightweight readiness signals that determine how well the page
 * can support paid traffic campaigns (social ads, display, retargeting).
 *
 * Note: Full ad angle generation is planned for v0.5.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const adsRules: Rule[] = [
  {
    id: "ads-open-graph-exists",
    title: "Open Graph (og:) metadata is present",
    category: "ads",
    severity: "medium",
    weight: 50,
    evaluate(page: PageData): RuleResult {
      const og = page.openGraph ?? {};
      const hasAny = Object.keys(og).length > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed: hasAny,
        score: hasAny ? 100 : 0,
        title: this.title,
        description: hasAny
          ? "Open Graph tags detected — page is ready for social sharing."
          : "No Open Graph tags found. Social platforms will render generic, unoptimised previews.",
        evidence: [{ label: "OG fields found", value: Object.keys(og).join(", ") || "(none)" }],
        recommendation: hasAny
          ? "No action needed."
          : "Add og:title, og:description, og:image, and og:url to the <head>.",
      };
    },
  },

  {
    id: "ads-open-graph-complete",
    title: "Core Open Graph fields (title, description, image) are all set",
    category: "ads",
    severity: "low",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const og = page.openGraph ?? {};
      const missing = (["title", "description", "image"] as const).filter(
        (k) => !og[k],
      );
      const passed = missing.length === 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : Math.round(((3 - missing.length) / 3) * 100),
        title: this.title,
        description: passed
          ? "All core OG fields are present (title, description, image)."
          : `Missing OG fields: ${missing.join(", ")}. Incomplete OG degrades social previews.`,
        evidence: [
          { label: "og:title", value: og.title ?? "(missing)" },
          { label: "og:description", value: og.description ?? "(missing)" },
          { label: "og:image", value: og.image ?? "(missing)" },
        ],
        recommendation: passed
          ? "No action needed."
          : `Add the missing Open Graph fields: ${missing.map((f) => `og:${f}`).join(", ")}.`,
      };
    },
  },

  {
    id: "ads-json-ld",
    title: "JSON-LD structured data is present",
    category: "ads",
    severity: "low",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      const count = (page.jsonLd ?? []).length;
      const passed = count > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `${count} JSON-LD block(s) found. Structured data enables rich results in SERPs.`
          : "No JSON-LD structured data found. Missing structured data reduces eligibility for rich SERP features.",
        evidence: [{ label: "JSON-LD blocks", value: count }],
        recommendation: passed
          ? "No action needed."
          : "Add a JSON-LD block with Organization, Product, or Article schema to enable rich results.",
      };
    },
  },
];
