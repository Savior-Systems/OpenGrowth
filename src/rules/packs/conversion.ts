/**
 * Conversion Readiness rule pack — 5 rules.
 *
 * Evaluates whether the page has the structural elements required to
 * guide visitors towards a conversion goal.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

/** CTA action verbs that signal direct intent. */
const ACTION_VERBS = [
  "get",
  "start",
  "try",
  "sign",
  "join",
  "buy",
  "book",
  "demo",
  "download",
  "claim",
  "register",
  "learn",
  "explore",
  "access",
  "request",
  "subscribe",
  "contact",
];

/** Conversion-path keywords to look for in links and copy. */
const CONVERSION_PATHS = [
  "contact",
  "demo",
  "book",
  "trial",
  "signup",
  "sign-up",
  "sign up",
  "pricing",
  "get started",
  "get-started",
  "free",
  "schedule",
];

export const conversionRules: Rule[] = [
  {
    id: "conversion-cta-present",
    title: "Call-to-Action (CTA) elements are present",
    category: "conversion",
    severity: "high",
    weight: 30,
    evaluate(page: PageData): RuleResult {
      const passed = page.ctas.length > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `${page.ctas.length} CTA element(s) found.`
          : "No buttons, form submits, or CTA-style links detected. Visitors have no clear action path.",
        evidence: [{ label: "CTA count", value: page.ctas.length }],
        recommendation: passed
          ? "No action needed."
          : "Add a prominent button or CTA link above the fold and at key section endings.",
      };
    },
  },

  {
    id: "conversion-cta-variety",
    title: "Multiple CTA elements provide varied action paths",
    category: "conversion",
    severity: "low",
    weight: 15,
    evaluate(page: PageData): RuleResult {
      const count = page.ctas.length;
      const passed = count >= 2;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `${count} CTA elements found — good variety.`
          : `Only ${count} CTA element(s) found. Multiple CTAs at different scroll depths improve conversion.`,
        evidence: [{ label: "CTA count", value: count }],
        recommendation: passed
          ? "No action needed."
          : "Add a secondary CTA (e.g. 'Learn more' or 'See pricing') to capture visitors who aren't ready for the primary action.",
      };
    },
  },

  {
    id: "conversion-action-language",
    title: "CTA text uses direct action verbs",
    category: "conversion",
    severity: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      if (page.ctas.length === 0) {
        return {
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          passed: false,
          score: 0,
          title: this.title,
          description: "No CTA elements found — action language cannot be evaluated.",
          evidence: [{ label: "CTA count", value: 0 }],
          recommendation: "Add CTAs with action verbs like 'Get started', 'Try free', or 'Book a demo'.",
        };
      }
      const ctaTexts = page.ctas.map((c) => c.text.toLowerCase());
      const hasActionVerb = ctaTexts.some((text) =>
        ACTION_VERBS.some((verb) => text.includes(verb)),
      );
      const matchedVerbs = ACTION_VERBS.filter((v) =>
        ctaTexts.some((t) => t.includes(v)),
      );
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed: hasActionVerb,
        score: hasActionVerb ? 100 : 0,
        title: this.title,
        description: hasActionVerb
          ? `CTAs use action verbs: ${matchedVerbs.slice(0, 3).join(", ")}.`
          : "CTA text does not contain strong action verbs. Vague CTAs reduce click-through rates.",
        evidence: [
          { label: "CTA texts", value: page.ctas.map((c) => c.text).slice(0, 5) },
        ],
        recommendation: hasActionVerb
          ? "No action needed."
          : "Rewrite CTAs to use direct action verbs: 'Get started', 'Try free', 'Book a demo', etc.",
      };
    },
  },

  {
    id: "conversion-contact-or-demo-path",
    title: "Contact, demo, or trial path is available",
    category: "conversion",
    severity: "medium",
    weight: 20,
    evaluate(page: PageData): RuleResult {
      const allText = [
        ...page.links.map((l) => `${l.href} ${l.text}`.toLowerCase()),
        ...page.ctas.map((c) => `${c.href ?? ""} ${c.text}`.toLowerCase()),
      ].join(" ");
      const found = CONVERSION_PATHS.filter((kw) => allText.includes(kw));
      const passed = found.length > 0;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Conversion path signals found: ${found.slice(0, 3).join(", ")}.`
          : "No contact, demo, trial, or pricing paths detected. Visitors can't easily take the next step.",
        evidence: [{ label: "matched paths", value: found.length > 0 ? found.slice(0, 5) : ["(none)"] }],
        recommendation: passed
          ? "No action needed."
          : "Add clear links or pages for: contact, demo, pricing, or free trial.",
      };
    },
  },

  {
    id: "conversion-form-friction",
    title: "Forms do not have excessive input fields (≤6 fields)",
    category: "conversion",
    severity: "low",
    weight: 15,
    evaluate(page: PageData): RuleResult {
      if (page.forms.length === 0) {
        return {
          ruleId: this.id,
          category: this.category,
          severity: this.severity,
          passed: true,
          score: 100,
          title: this.title,
          description: "No forms found on the page — friction rule is not applicable.",
          evidence: [{ label: "form count", value: 0 }],
          recommendation: "Consider adding a simple lead-capture form with 3 fields or fewer.",
        };
      }
      const maxInputs = Math.max(...page.forms.map((f) => f.inputs.length));
      const passed = maxInputs <= 6;
      return {
        ruleId: this.id,
        category: this.category,
        severity: this.severity,
        passed,
        score: passed ? 100 : 0,
        title: this.title,
        description: passed
          ? `Largest form has ${maxInputs} field(s) — low friction.`
          : `Largest form has ${maxInputs} input fields. High field counts significantly reduce form completions.`,
        evidence: [
          { label: "max fields in a form", value: maxInputs },
          { label: "form count", value: page.forms.length },
        ],
        recommendation: passed
          ? "No action needed."
          : "Reduce form fields to 6 or fewer. Consider progressive disclosure for longer forms.",
      };
    },
  },
];
