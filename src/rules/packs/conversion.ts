/**
 * Conversion Readiness rule pack.
 *
 * Evaluates whether the page has the structural elements required to
 * guide visitors towards a conversion goal.
 */

import { Rule, RuleResult } from "../types.js";
import { PageData } from "../../models/page-data.js";

export const conversionRules: Rule[] = [
  {
    id: "conversion-cta-present",
    title: "Call-to-Action (CTA) elements are present",
    category: "conversion",
    priority: "high",
    weight: 60,
    evaluate(page: PageData): RuleResult {
      const passed = page.ctas.length > 0;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `${page.ctas.length} CTA element(s) found.`
          : "No buttons, form submits, or CTA-style links detected. Visitors have no clear action path.",
        evidence: `${page.ctas.length} CTA(s)`,
      };
    },
  },

  {
    id: "conversion-form-present",
    title: "Lead-capture or contact forms are present",
    category: "conversion",
    priority: "medium",
    weight: 40,
    evaluate(page: PageData): RuleResult {
      const passed = page.forms.length > 0;
      return {
        ruleId: this.id,
        passed,
        title: this.title,
        category: this.category,
        priority: this.priority,
        description: passed
          ? `${page.forms.length} form(s) found.`
          : "No form structures detected. Lead-capture forms significantly improve email opt-in rates.",
        evidence: `${page.forms.length} form(s)`,
      };
    },
  },
];
