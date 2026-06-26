/**
 * SEO Foundation rule pack — 7 rules.
 *
 * Evaluates the basic technical SEO signals that affect crawlability and
 * search-engine indexing. All rules read from PageData with no network calls.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const seoRules: Rule[] = [
  {
    id: "seo-title-exists",
    title: "Title tag is present",
    category: "seo",
    severity: "high",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const passed = Boolean(page.title);
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Title tag found: "${page.title}".`
          : "The page is missing a <title> element, which is critical for SEO.",
        evidence: [{ label: "title", value: page.title ?? "(none)" }],
        recommendation: passed
          ? "No action needed."
          : "Add a <title> tag with a clear, descriptive 10–60 character page title.",
      };
    },
  },

  {
    id: "seo-title-length",
    title: "Title tag length is optimal (10–60 characters)",
    category: "seo",
    severity: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      if (!page.title) {
        return {
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          passed: false,
          score: 0,
          title: this.title,
          description: "No title tag present — length cannot be evaluated.",
          evidence: [{ label: "title", value: "(none)" }],
          recommendation: "Add a title tag first, then ensure it is 10–60 characters.",
        };
      }
      const len = page.title.length;
      const passed = len >= 10 && len <= 60;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Title length is ${len} characters — within the optimal 10–60 range.`
          : `Title length is ${len} characters. Titles should be between 10–60 characters.`,
        evidence: [
          { label: "title", value: page.title },
          { label: "length", value: len },
        ],
        recommendation: passed
          ? "No action needed."
          : len < 10
            ? "Expand the title to be more descriptive (10–60 characters)."
            : "Shorten the title to 60 characters or fewer to avoid truncation in SERPs.",
      };
    },
  },

  {
    id: "seo-meta-description-exists",
    title: "Meta description is present",
    category: "seo",
    severity: "high",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const passed = Boolean(page.metaDescription);
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Meta description found (${page.metaDescription!.length} characters).`
          : "No meta description tag found. Search engines may auto-generate low-quality snippets.",
        evidence: [{ label: "meta description", value: page.metaDescription ?? "(none)" }],
        recommendation: passed
          ? "No action needed."
          : "Add a <meta name=\"description\"> tag with a 50–160 character compelling summary.",
      };
    },
  },

  {
    id: "seo-meta-description-length",
    title: "Meta description length is optimal (50–160 characters)",
    category: "seo",
    severity: "medium",
    weight: 10,
    evaluate(page: PageData): RuleResult {
      if (!page.metaDescription) {
        return {
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          passed: false,
          score: 0,
          title: this.title,
          description: "No meta description present — length cannot be evaluated.",
          evidence: [{ label: "meta description", value: "(none)" }],
          recommendation: "Add a meta description before optimising its length.",
        };
      }
      const len = page.metaDescription.length;
      const passed = len >= 50 && len <= 160;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Meta description is ${len} characters — within the optimal 50–160 range.`
          : `Meta description is ${len} characters. Aim for 50–160 characters.`,
        evidence: [{ label: "length", value: len }],
        recommendation: passed
          ? "No action needed."
          : len < 50
            ? "Expand the meta description to provide more context (50–160 characters)."
            : "Shorten the meta description to 160 characters or fewer.",
      };
    },
  },

  {
    id: "seo-canonical-url",
    title: "Canonical URL is set",
    category: "seo",
    severity: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      const passed = Boolean(page.canonicalUrl);
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Canonical URL found: ${page.canonicalUrl}.`
          : "No canonical link element found. This can cause duplicate-content indexing issues.",
        evidence: [{ label: "canonical URL", value: page.canonicalUrl ?? "(none)" }],
        recommendation: passed
          ? "No action needed."
          : "Add <link rel=\"canonical\" href=\"...\"> to the page <head>.",
      };
    },
  },

  {
    id: "seo-robots-txt",
    title: "robots.txt is reachable (HTTP 200)",
    category: "seo",
    severity: "medium",
    weight: 10,
    evaluate(page: PageData): RuleResult {
      const passed = page.robotsTxtStatus === 200;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? "robots.txt is reachable (HTTP 200)."
          : `robots.txt returned HTTP ${page.robotsTxtStatus ?? "N/A"}. Search crawlers rely on this file.`,
        evidence: [{ label: "HTTP status", value: page.robotsTxtStatus }],
        recommendation: passed
          ? "No action needed."
          : "Ensure a valid robots.txt file is accessible at the root of your domain.",
      };
    },
  },

  {
    id: "seo-sitemap",
    title: "sitemap.xml is reachable (HTTP 200)",
    category: "seo",
    severity: "low",
    weight: 10,
    evaluate(page: PageData): RuleResult {
      const passed = page.sitemapStatus === 200;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? "sitemap.xml is reachable (HTTP 200)."
          : `sitemap.xml returned HTTP ${page.sitemapStatus ?? "N/A"}. Sitemaps help crawlers discover all URLs.`,
        evidence: [{ label: "HTTP status", value: page.sitemapStatus }],
        recommendation: passed
          ? "No action needed."
          : "Create a sitemap.xml file and submit it via Google Search Console.",
      };
    },
  },
];
