/**
 * SEO Foundation rule pack.
 *
 * Evaluates the basic technical SEO signals that affect crawlability and
 * search-engine indexing. All rules read from PageData and have no
 * external dependencies.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const seoRules: Rule[] = [
  {
    id: "seo-title-exists",
    title: "Title tag is present",
    category: "seo",
    priority: "high",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const passed = Boolean(page.title);
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `Title tag found: "${page.title}".`
          : "The page is missing a <title> element, which is critical for SEO.",
        evidence: page.title ?? undefined,
      };
    },
  },

  {
    id: "seo-title-length",
    title: "Title tag length is optimal (10–60 characters)",
    category: "seo",
    priority: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      if (!page.title) {
        return {
          ruleId: this.id,
          passed: false,
          title: this.title,
          category: this.category,
          priority: this.priority,
          description: "No title tag present — length cannot be evaluated.",
        };
      }
      const len = page.title.length;
      const passed = len >= 10 && len <= 60;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `Title length is ${len} characters — within the optimal 10–60 range.`
          : `Title length is ${len} characters. Titles should be between 10–60 characters for search snippets.`,
        evidence: `${len} characters`,
      };
    },
  },

  {
    id: "seo-meta-description-exists",
    title: "Meta description is present",
    category: "seo",
    priority: "high",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const passed = Boolean(page.metaDescription);
      const preview = page.metaDescription
        ? `"${page.metaDescription.slice(0, 60)}${page.metaDescription.length > 60 ? "…" : ""}"`
        : "";
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `Meta description found: ${preview}.`
          : "No meta description tag found. Search engines may auto-generate low-quality snippets.",
        evidence: page.metaDescription ?? undefined,
      };
    },
  },

  {
    id: "seo-meta-description-length",
    title: "Meta description length is optimal (50–160 characters)",
    category: "seo",
    priority: "medium",
    weight: 10,
    evaluate(page: PageData): RuleResult {
      if (!page.metaDescription) {
        return {
          ruleId: this.id,
          passed: false,
          title: this.title,
          category: this.category,
          priority: this.priority,
          description: "No meta description present — length cannot be evaluated.",
        };
      }
      const len = page.metaDescription.length;
      const passed = len >= 50 && len <= 160;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `Meta description is ${len} characters — within the optimal 50–160 range.`
          : `Meta description is ${len} characters. Aim for 50–160 characters for ideal search snippets.`,
        evidence: `${len} characters`,
      };
    },
  },

  {
    id: "seo-canonical-url",
    title: "Canonical URL is set",
    category: "seo",
    priority: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      const passed = Boolean(page.canonicalUrl);
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `Canonical URL found: ${page.canonicalUrl}.`
          : "No canonical link element found. This can cause duplicate-content indexing issues.",
        evidence: page.canonicalUrl ?? undefined,
      };
    },
  },

  {
    id: "seo-robots-txt",
    title: "robots.txt is reachable (HTTP 200)",
    category: "seo",
    priority: "medium",
    weight: 10,
    evaluate(page: PageData): RuleResult {
      const passed = page.robotsTxtStatus === 200;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? "robots.txt is reachable (HTTP 200)."
          : `robots.txt returned HTTP ${page.robotsTxtStatus ?? "N/A"}. Search crawlers rely on this file.`,
        evidence: `HTTP ${page.robotsTxtStatus}`,
      };
    },
  },

  {
    id: "seo-sitemap",
    title: "sitemap.xml is reachable (HTTP 200)",
    category: "seo",
    priority: "low",
    weight: 10,
    evaluate(page: PageData): RuleResult {
      const passed = page.sitemapStatus === 200;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? "sitemap.xml is reachable (HTTP 200)."
          : `sitemap.xml returned HTTP ${page.sitemapStatus ?? "N/A"}. Sitemaps help crawlers discover all URLs.`,
        evidence: `HTTP ${page.sitemapStatus}`,
      };
    },
  },
];
