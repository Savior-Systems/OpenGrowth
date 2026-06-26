import type { PageData } from "../models/page-data.js";
import type { RuleResult } from "../rules/types.js";
import type { ScoreCard } from "../scoring/calculator.js";
import type { ContentStrategy } from "../strategy/types.js";
import type { AdInputData } from "./types.js";

/**
 * Normalizes text by lowercasing and stripping punctuation.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts words and multi-word matches of a search list from targeted text content.
 */
function extractMatches(text: string, searchTerms: string[]): string[] {
  const normText = normalizeText(text);
  const found = new Set<string>();

  for (const term of searchTerms) {
    // Escape term for regex, match whole words/phrases
    const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normText)) {
      found.add(term);
    }
  }

  return Array.from(found);
}

/**
 * Heuristically extracts deterministic ad inputs from crawled page data, business context,
 * rule engine results, scorecard, and generated content strategy.
 */
export function extractAdInputs(input: {
  page: PageData;
  context?: string;
  scorecard: ScoreCard;
  ruleResults: RuleResult[];
  contentStrategy: ContentStrategy;
}): AdInputData {
  const { page, context = "", ruleResults, contentStrategy } = input;

  // 1. Primary Topic (from top content strategy keywords, title, or fallback)
  let primaryTopic = "growth system";
  if (contentStrategy.extractedKeywords && contentStrategy.extractedKeywords.length > 0) {
    primaryTopic = contentStrategy.extractedKeywords[0].term;
  } else if (page.title) {
    const cleanTitle = page.title.split(/[-|]/)[0].trim();
    if (cleanTitle.length > 3) {
      primaryTopic = cleanTitle.toLowerCase();
    }
  }

  // Aggregate all textual content from the page for search matching
  const headingText = page.headings.map((h) => h.text).join(" ");
  const ctaText = page.ctas.map((c) => c.text).join(" ");
  const combinedText = [
    page.title || "",
    page.metaDescription || "",
    headingText,
    ctaText,
    page.bodyText || "",
    context,
  ].join(" ");

  // 2. Audience Terms Extraction
  const targetAudienceList = [
    "teams",
    "founders",
    "marketers",
    "agencies",
    "developers",
    "startups",
    "ecommerce",
    "saas",
    "creators",
    "operators",
    "small businesses",
    "enterprises",
    "product managers",
    "consultants",
  ];
  let audienceTerms = extractMatches(combinedText, targetAudienceList);
  if (audienceTerms.length === 0) {
    audienceTerms = ["growth-focused teams"];
  }

  // 3. Problem Terms Extraction
  const targetProblemList = [
    "slow",
    "manual",
    "confusing",
    "missing",
    "weak",
    "hard",
    "expensive",
    "scattered",
    "conversion",
    "trust",
    "content",
    "reporting",
    "workflow",
    "friction",
    "objections",
    "leaks",
    "overwhelm",
    "growth bottlenecks",
  ];
  let problemTerms = extractMatches(combinedText, targetProblemList);

  // Add problems derived from failed rule descriptions
  const failedRules = ruleResults.filter((r) => !r.passed);
  for (const r of failedRules) {
    const normTitle = r.title.toLowerCase();
    if (normTitle.includes("title") || normTitle.includes("meta")) {
      problemTerms.push("seo metadata optimization");
    } else if (normTitle.includes("cta") || normTitle.includes("form")) {
      problemTerms.push("funnel friction");
    } else if (normTitle.includes("trust") || normTitle.includes("policy") || normTitle.includes("secure")) {
      problemTerms.push("trust signals");
    }
  }
  problemTerms = Array.from(new Set(problemTerms)).sort();
  if (problemTerms.length === 0) {
    problemTerms = ["unclear growth priorities"];
  }

  // 4. Outcome Terms Extraction
  const targetOutcomeList = [
    "grow",
    "automate",
    "improve",
    "convert",
    "save time",
    "simplify",
    "scale",
    "launch",
    "organize",
    "track",
    "understand",
    "optimize",
    "revenue expansion",
    "visibility",
  ];
  let outcomeTerms = extractMatches(combinedText, targetOutcomeList);
  outcomeTerms = Array.from(new Set(outcomeTerms)).sort();
  if (outcomeTerms.length === 0) {
    outcomeTerms = ["a clearer growth system"];
  }

  // 5. Proof Terms Extraction
  const targetProofList = [
    "testimonial",
    "review",
    "customer",
    "case study",
    "trusted",
    "secure",
    "guarantee",
    "rating",
    "reviews",
    "testimonials",
    "partners",
    "compliance",
  ];
  let proofTerms = extractMatches(combinedText, targetProofList);
  proofTerms = Array.from(new Set(proofTerms)).sort();

  // 6. CTA Terms Extraction
  let ctaTerms: string[] = [];
  if (page.ctas && page.ctas.length > 0) {
    ctaTerms = Array.from(new Set(page.ctas.map((c) => c.text.toLowerCase().trim()))).filter(
      (text) => text.length > 2 && text.length < 30
    );
  }
  if (ctaTerms.length === 0) {
    ctaTerms = ["get started", "learn more", "book a demo"];
  }
  ctaTerms = ctaTerms.sort();

  // 7. Weak Areas Extraction (based on failed rules and category scores)
  const weakAreas = new Set<string>();
  const scoreCategories = input.scorecard.categories;
  if (scoreCategories.seo < 70) weakAreas.add("SEO Foundations");
  if (scoreCategories.content < 70) weakAreas.add("Content Depth and Authority");
  if (scoreCategories.conversion < 70) weakAreas.add("Funnel and CTA Friction");
  if (scoreCategories.trust < 70) weakAreas.add("Trust & Social Proof Signals");
  if (scoreCategories.technical < 70) weakAreas.add("Technical Page Performance");
  if (scoreCategories.offer < 70) weakAreas.add("Value Prop & Offer Clarity");
  if (scoreCategories.ads < 70) weakAreas.add("Ad Readiness & Landing Pages");

  // Fallback if score categories are high but rules failed
  if (weakAreas.size === 0 && failedRules.length > 0) {
    for (const r of failedRules.slice(0, 3)) {
      weakAreas.add(r.category.toUpperCase() + " Optimizations");
    }
  }
  if (weakAreas.size === 0) {
    weakAreas.add("Conversion Rate Optimization");
  }

  return {
    primaryTopic,
    audienceTerms,
    problemTerms,
    outcomeTerms,
    proofTerms,
    ctaTerms,
    weakAreas: Array.from(weakAreas).sort(),
  };
}
