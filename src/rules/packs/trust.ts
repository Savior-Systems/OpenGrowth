/**
 * Trust Signals rule pack — 4 rules.
 *
 * Evaluates the presence of on-page signals that build visitor trust and
 * reduce conversion friction. Trust signals include policy links, social
 * proof language, contact information, and HTTPS usage.
 *
 * All rules read from existing PageData fields — no extra network calls.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

/** Link text or href keywords that signal policy/legal pages. */
const POLICY_KEYWORDS = [
  "privacy",
  "policy",
  "terms",
  "tos",
  "refund",
  "return",
  "security",
  "gdpr",
  "legal",
  "disclaimer",
  "cookie",
];

/** Body text / heading keywords that indicate social proof. */
const SOCIAL_PROOF_KEYWORDS = [
  "testimonial",
  "review",
  "customer",
  "case study",
  "case-study",
  "client",
  "trusted by",
  "trusted",
  "rating",
  "star",
  "success story",
  "success",
  "featured",
  "award",
  "certified",
  "partner",
];

/** Keywords that indicate a contact or support mechanism. */
const CONTACT_KEYWORDS = [
  "contact",
  "email",
  "phone",
  "support",
  "address",
  "chat",
  "help",
  "reach us",
  "reach out",
  "get in touch",
  "talk to",
];

export const trustRules: Rule[] = [
  {
    id: "trust-policy-links",
    title: "Policy links (privacy, terms, refund) are present",
    category: "trust",
    severity: "medium",
    weight: 25,
    evaluate(page: PageData): RuleResult {
      const linkText = page.links
        .map((l) => `${l.href} ${l.text}`.toLowerCase())
        .join(" ");
      const found = POLICY_KEYWORDS.filter((kw) => linkText.includes(kw));
      const passed = found.length > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Policy links detected: ${found.slice(0, 3).join(", ")}.`
          : "No policy, terms, or refund links found. Missing policy links erode visitor trust.",
        evidence: [{ label: "matched policy signals", value: found.length > 0 ? found.slice(0, 5) : ["(none)"] }],
        recommendation: passed
          ? "No action needed."
          : "Add links to a Privacy Policy and Terms of Service in the footer. A Refund Policy is recommended for e-commerce sites.",
      };
    },
  },

  {
    id: "trust-social-proof-language",
    title: "Social proof language or signals are present",
    category: "trust",
    severity: "medium",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const pageText = (
        page.bodyText +
        " " +
        page.headings.map((h) => h.text).join(" ")
      ).toLowerCase();
      const found = SOCIAL_PROOF_KEYWORDS.filter((kw) => pageText.includes(kw));
      const passed = found.length > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Social proof signals found: ${found.slice(0, 3).join(", ")}.`
          : "No social proof language detected (testimonials, reviews, client mentions). Trust signals reduce conversion hesitation.",
        evidence: [{ label: "matched signals", value: found.length > 0 ? found.slice(0, 5) : ["(none)"] }],
        recommendation: passed
          ? "No action needed."
          : "Add testimonials, customer reviews, case studies, or 'Trusted by' logos to the page.",
      };
    },
  },

  {
    id: "trust-contact-signal",
    title: "A contact or support mechanism is present",
    category: "trust",
    severity: "medium",
    weight: 25,
    evaluate(page: PageData): RuleResult {
      const pageText = (
        page.bodyText +
        " " +
        page.links.map((l) => `${l.href} ${l.text}`).join(" ") +
        " " +
        page.headings.map((h) => h.text).join(" ")
      ).toLowerCase();
      const found = CONTACT_KEYWORDS.filter((kw) => pageText.includes(kw));
      const passed = found.length > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Contact signals found: ${found.slice(0, 3).join(", ")}.`
          : "No contact, support, or help signals detected. Visitors who can't reach you are less likely to convert.",
        evidence: [{ label: "matched contact signals", value: found.length > 0 ? found.slice(0, 5) : ["(none)"] }],
        recommendation: passed
          ? "No action needed."
          : "Add a contact page link, email address, chat widget, or support link.",
      };
    },
  },

  {
    id: "trust-secure-url",
    title: "Page is served over HTTPS",
    category: "trust",
    severity: "high",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      const url = page.url ?? "";
      const passed = url.toLowerCase().startsWith("https://");
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? "Page URL uses HTTPS — secure connection confirmed."
          : "Page URL does not use HTTPS. HTTP pages display security warnings in browsers and rank lower in search.",
        evidence: [{ label: "URL", value: url }],
        recommendation: passed
          ? "No action needed."
          : "Migrate to HTTPS immediately. Obtain a TLS certificate (Let's Encrypt is free) and redirect all HTTP traffic.",
      };
    },
  },
];
