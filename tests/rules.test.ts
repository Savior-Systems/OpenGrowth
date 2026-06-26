/**
 * Unit tests for the v0.3.1 rule engine packs.
 *
 * Each test drives a specific rule with a crafted PageData fixture so that
 * all tests are deterministic, self-contained, and have no network calls.
 */

import { describe, it, expect } from "vitest";
import { seoRules } from "../src/rules/packs/seo.js";
import { offerRules } from "../src/rules/packs/offer.js";
import { conversionRules } from "../src/rules/packs/conversion.js";
import { contentRules } from "../src/rules/packs/content.js";
import { adsRules } from "../src/rules/packs/ads.js";
import { trustRules } from "../src/rules/packs/trust.js";
import { getAllRules, getRulesByCategory, getRuleById } from "../src/rules/registry.js";
import { runRules } from "../src/rules/runner.js";
import { PageData } from "../src/models/page-data.js";

// ─────────────────────────────────────────────────────────────────────────────
// Shared fixture factories
// ─────────────────────────────────────────────────────────────────────────────

/** Returns a fully-populated PageData that passes every rule. */
function perfectPage(): PageData {
  return {
    url: "https://example.com",
    canonicalUrl: "https://example.com",
    title: "Best SaaS Tool for Teams",
    metaDescription:
      "A 60-word meta description that is exactly within the ideal length range for search engine snippets and provides full context.",
    headings: [
      { level: 1, text: "Scale Your Team With Ease" },
      { level: 2, text: "Features" },
      { level: 2, text: "Pricing" },
      { level: 3, text: "Enterprise Plans" },
    ],
    links: [
      { href: "https://example.com/about", text: "About Us", isInternal: true },
      { href: "https://example.com/privacy", text: "Privacy Policy", isInternal: true },
      { href: "https://example.com/contact", text: "Contact Support", isInternal: true },
    ],
    images: [
      { src: "hero.png", alt: "Team collaboration dashboard" },
      { src: "logo.png", alt: "Company logo" },
    ],
    ctas: [
      { text: "Start Free Trial", href: "/signup", tag: "a" },
      { text: "Learn More", href: "/features", tag: "a" }
    ],
    forms: [
      {
        action: "/subscribe",
        method: "post",
        inputs: [{ type: "email", name: "email", placeholder: "Enter your email" }],
      },
    ],
    bodyText:
      "Scale your team with ease. We are trusted by thousands of clients. Read their customer reviews and testimonials. " +
      "Lorem ipsum dolor sit amet ".repeat(60) + "consectetur adipiscing elit.", // ~300 words
    openGraph: {
      title: "Best SaaS Tool",
      description: "Scale your team with ease.",
      image: "https://example.com/og-image.png",
    },
    jsonLd: [{ "@type": "Organization", name: "Example" }],
    robotsTxtStatus: 200,
    sitemapStatus: 200,
  };
}

/** Returns a bare-minimum PageData that fails every rule. */
function emptyPage(): PageData {
  return {
    url: "http://empty.example.com", // http URL to fail HTTPS rule
    headings: [],
    links: [],
    images: [],
    ctas: [],
    forms: [],
    bodyText: "",
    openGraph: {},
    jsonLd: [],
    robotsTxtStatus: 404,
    sitemapStatus: 404,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

describe("Rule registry", () => {
  it("getAllRules returns a non-empty array", () => {
    expect(getAllRules().length).toBeGreaterThan(0);
  });

  it("every rule has a unique id", () => {
    const ids = getAllRules().map((r) => r.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every rule has a positive weight", () => {
    for (const rule of getAllRules()) {
      expect(rule.weight).toBeGreaterThan(0);
    }
  });

  it("getRulesByCategory returns only rules for that category", () => {
    const seo = getRulesByCategory("seo");
    expect(seo.length).toBeGreaterThan(0);
    expect(seo.every((r) => r.category === "seo")).toBe(true);
  });

  it("getRuleById returns the correct rule", () => {
    const rule = getRuleById("seo-title-exists");
    expect(rule).toBeDefined();
    expect(rule?.id).toBe("seo-title-exists");
  });

  it("getRuleById returns undefined for unknown id", () => {
    expect(getRuleById("does-not-exist")).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────────────────────────────────────

describe("Rule runner", () => {
  it("returns one result per rule", () => {
    const rules = getAllRules();
    const results = runRules(perfectPage(), rules);
    expect(results.length).toBe(rules.length);
  });

  it("every result carries the matching ruleId", () => {
    const rules = getAllRules();
    const results = runRules(perfectPage(), rules);
    for (let i = 0; i < rules.length; i++) {
      expect(results[i].ruleId).toBe(rules[i].id);
    }
  });

  it("perfect page passes all rules", () => {
    const results = runRules(perfectPage());
    const failed = results.filter((r) => !r.passed);
    expect(failed.length).toBe(0);
  });

  it("empty page fails all rules", () => {
    const results = runRules(emptyPage());
    const passed = results.filter((r) => r.passed);
    // These rules are designed to pass on empty/no-content pages by default
    const expectedPassOnEmpty = [
      "content-image-alt-tags",
      "conversion-form-friction",
      "content-context-alignment",
    ];
    const unexpectedPass = passed.filter((r) => !expectedPassOnEmpty.includes(r.ruleId));
    expect(unexpectedPass.length).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SEO rule pack
// ─────────────────────────────────────────────────────────────────────────────

describe("SEO rules", () => {
  const ruleMap = Object.fromEntries(seoRules.map((r) => [r.id, r]));

  describe("seo-title-exists", () => {
    const rule = ruleMap["seo-title-exists"];

    it("passes when title is present", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when title is missing", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });

    it("evidence contains the title text when present", () => {
      const result = rule.evaluate(perfectPage());
      expect(result.evidence[0].label).toBe("title");
      expect(result.evidence[0].value).toBe("Best SaaS Tool for Teams");
    });
  });

  describe("seo-title-length", () => {
    const rule = ruleMap["seo-title-length"];

    it("passes for a title of 10-60 characters", () => {
      const page = perfectPage();
      page.title = "Exactly 30 characters long!!";
      expect(rule.evaluate(page).passed).toBe(true);
    });

    it("fails for a title shorter than 10 characters", () => {
      const page = perfectPage();
      page.title = "Short";
      expect(rule.evaluate(page).passed).toBe(false);
    });

    it("fails for a title longer than 60 characters", () => {
      const page = perfectPage();
      page.title = "This is an extremely long page title that exceeds the sixty character limit";
      expect(rule.evaluate(page).passed).toBe(false);
    });

    it("fails (not error) when title is missing", () => {
      const result = rule.evaluate(emptyPage());
      expect(result.passed).toBe(false);
      expect(result.description).toContain("No title");
    });
  });

  describe("seo-meta-description-exists", () => {
    const rule = ruleMap["seo-meta-description-exists"];

    it("passes when description is present", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when description is missing", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });

  describe("seo-meta-description-length", () => {
    const rule = ruleMap["seo-meta-description-length"];

    it("passes for a description between 50-160 characters", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails for a description shorter than 50 characters", () => {
      const page = perfectPage();
      page.metaDescription = "Too short";
      expect(rule.evaluate(page).passed).toBe(false);
    });

    it("fails for a description longer than 160 characters", () => {
      const page = perfectPage();
      page.metaDescription = "a".repeat(161);
      expect(rule.evaluate(page).passed).toBe(false);
    });
  });

  describe("seo-canonical-url", () => {
    const rule = ruleMap["seo-canonical-url"];

    it("passes when canonical url is set", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when canonical url is missing", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });

  describe("seo-robots-txt", () => {
    const rule = ruleMap["seo-robots-txt"];

    it("passes when status is 200", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when status is not 200", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });

    it("evidence contains the HTTP status code", () => {
      const result = rule.evaluate(emptyPage());
      expect(result.evidence[0].label).toBe("HTTP status");
      expect(result.evidence[0].value).toBe(404);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Offer rule pack
// ─────────────────────────────────────────────────────────────────────────────

describe("Offer rules", () => {
  const ruleMap = Object.fromEntries(offerRules.map((r) => [r.id, r]));

  describe("offer-single-h1", () => {
    const rule = ruleMap["offer-single-h1"];

    it("passes when exactly one H1 exists", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when no H1 exists", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });

    it("fails when multiple H1s exist", () => {
      const page = perfectPage();
      page.headings = [
        { level: 1, text: "First H1" },
        { level: 1, text: "Second H1" },
      ];
      expect(rule.evaluate(page).passed).toBe(false);
    });

    it("evidence reports the correct H1 count", () => {
      const result = rule.evaluate(perfectPage());
      expect(result.evidence[0].label).toBe("H1 count");
      expect(result.evidence[0].value).toBe(1);
    });
  });

  describe("offer-heading-structure", () => {
    const rule = ruleMap["offer-heading-structure"];

    it("passes when 3 or more headings exist", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when fewer than 3 headings exist", () => {
      const page = perfectPage();
      page.headings = [{ level: 1, text: "Only heading" }];
      expect(rule.evaluate(page).passed).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Conversion rule pack
// ─────────────────────────────────────────────────────────────────────────────

describe("Conversion rules", () => {
  const ruleMap = Object.fromEntries(conversionRules.map((r) => [r.id, r]));

  describe("conversion-cta-present", () => {
    const rule = ruleMap["conversion-cta-present"];

    it("passes when CTAs are present", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when no CTAs are present", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });

  describe("conversion-form-friction", () => {
    const rule = ruleMap["conversion-form-friction"];

    it("passes (friction is fine) when forms are present with <=6 fields", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("passes (friction is fine by default) when no forms are present", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(true);
    });

    it("fails when form has >6 fields", () => {
      const page = perfectPage();
      page.forms[0].inputs = Array(7).fill({ type: "text", name: "field" });
      expect(rule.evaluate(page).passed).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Content rule pack
// ─────────────────────────────────────────────────────────────────────────────

describe("Content rules", () => {
  const ruleMap = Object.fromEntries(contentRules.map((r) => [r.id, r]));

  describe("content-body-depth", () => {
    const rule = ruleMap["content-body-depth"];

    it("passes when word count is 250 or more", () => {
      const page = perfectPage(); // fixture has ~300 words
      expect(rule.evaluate(page).passed).toBe(true);
    });

    it("fails when word count is below 250", () => {
      const page = emptyPage();
      page.bodyText = "Only a few words here.";
      expect(rule.evaluate(page).passed).toBe(false);
    });

    it("evidence reports the word count", () => {
      const result = rule.evaluate(emptyPage());
      expect(result.evidence[0].label).toBe("word count");
      expect(result.evidence[0].value).toBe(0);
    });
  });

  describe("content-image-alt-tags", () => {
    const rule = ruleMap["content-image-alt-tags"];

    it("passes when all images have alt text", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("passes (by default) when no images are present", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(true);
    });

    it("fails when any image is missing alt text", () => {
      const page = perfectPage();
      page.images.push({ src: "no-alt.png", alt: "" });
      expect(rule.evaluate(page).passed).toBe(false);
    });

    it("evidence contains missing/total count when images exist", () => {
      const page = perfectPage();
      page.images = [{ src: "a.png", alt: "good" }, { src: "b.png", alt: "" }];
      const result = rule.evaluate(page);
      expect(result.evidence[0].label).toBe("missing alt");
      expect(result.evidence[0].value).toBe(1);
      expect(result.evidence[1].label).toBe("total images");
      expect(result.evidence[1].value).toBe(2);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Trust rule pack
// ─────────────────────────────────────────────────────────────────────────────

describe("Trust rules", () => {
  const ruleMap = Object.fromEntries(trustRules.map((r) => [r.id, r]));

  describe("trust-policy-links", () => {
    const rule = ruleMap["trust-policy-links"];

    it("passes when policy keywords are found in links", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when no policy keywords are in links", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });

  describe("trust-social-proof-language", () => {
    const rule = ruleMap["trust-social-proof-language"];

    it("passes when social proof language exists", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when no social proof language exists", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });

  describe("trust-contact-signal", () => {
    const rule = ruleMap["trust-contact-signal"];

    it("passes when contact mechanisms are present", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when no contact mechanisms are present", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });

  describe("trust-secure-url", () => {
    const rule = ruleMap["trust-secure-url"];

    it("passes when url uses https", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when url uses http", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Ads rule pack
// ─────────────────────────────────────────────────────────────────────────────

describe("Ads rules", () => {
  const ruleMap = Object.fromEntries(adsRules.map((r) => [r.id, r]));

  describe("ads-open-graph-exists", () => {
    const rule = ruleMap["ads-open-graph-exists"];

    it("passes when OG tags are present", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when no OG tags are present", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });

  describe("ads-open-graph-complete", () => {
    const rule = ruleMap["ads-open-graph-complete"];

    it("passes when title, description, and image are all set", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when any core OG field is missing", () => {
      const page = perfectPage();
      page.openGraph = { title: "Only title" };
      expect(rule.evaluate(page).passed).toBe(false);
    });

    it("evidence lists the fields and their values", () => {
      const page = perfectPage();
      page.openGraph = { title: "Only title" };
      const result = rule.evaluate(page);
      expect(result.evidence.some(e => e.label === "og:title" && e.value === "Only title")).toBe(true);
      expect(result.evidence.some(e => e.label === "og:description" && e.value === "(missing)")).toBe(true);
    });

    it("handles the no-OG case gracefully", () => {
      const result = rule.evaluate(emptyPage());
      expect(result.passed).toBe(false);
      expect(result.description).toContain("Missing OG fields");
    });
  });

  describe("ads-json-ld", () => {
    const rule = ruleMap["ads-json-ld"];

    it("passes when JSON-LD blocks are present", () => {
      expect(rule.evaluate(perfectPage()).passed).toBe(true);
    });

    it("fails when JSON-LD is absent", () => {
      expect(rule.evaluate(emptyPage()).passed).toBe(false);
    });
  });
});
