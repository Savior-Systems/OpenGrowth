import type { PageData } from "../models/page-data.js";
import type { ExtractedKeyword } from "./types.js";

// Common English stopwords to filter out
const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could",
  "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for",
  "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "heres",
  "hes", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt",
  "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off",
  "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant",
  "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the",
  "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll",
  "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt",
  "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when", "whens", "where", "wheres", "which",
  "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll",
  "youre", "youve", "your", "yours", "yourselves", "yourself", "us", "our", "get", "use", "make", "take"
]);

/**
 * Clean a string by lowercasing and removing punctuation.
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ") // replace punctuation with spaces
    .replace(/\s+/g, " ")      // normalize spaces
    .trim();
}

/**
 * Tokenize a clean string into words, filtering out short words and stopwords.
 */
function tokenizeWords(cleanTextStr: string): string[] {
  return cleanTextStr
    .split(" ")
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
}

/**
 * Extract 2-word and 3-word phrases from a clean string where all components are non-stopwords.
 */
function extractPhrases(cleanTextStr: string): string[] {
  const words = cleanTextStr.split(" ").filter((w) => w.length > 0);
  const phrases: string[] = [];

  for (let i = 0; i < words.length; i++) {
    // 2-word phrases
    if (i < words.length - 1) {
      const w1 = words[i];
      const w2 = words[i + 1];
      if (
        w1.length >= 3 && !STOPWORDS.has(w1) &&
        w2.length >= 3 && !STOPWORDS.has(w2)
      ) {
        phrases.push(`${w1} ${w2}`);
      }
    }
    // 3-word phrases
    if (i < words.length - 2) {
      const w1 = words[i];
      const w2 = words[i + 1];
      const w3 = words[i + 2];
      if (
        w1.length >= 3 && !STOPWORDS.has(w1) &&
        w2.length >= 3 && !STOPWORDS.has(w2) &&
        w3.length >= 3 && !STOPWORDS.has(w3)
      ) {
        phrases.push(`${w1} ${w2} ${w3}`);
      }
    }
  }

  return phrases;
}

/**
 * Extract keywords and phrases from page data and business context.
 * Returns sorted list of unique terms/phrases and their weights.
 */
export function extractKeywords(input: {
  page: PageData;
  context?: string;
  limit?: number;
}): ExtractedKeyword[] {
  const { page, context, limit = 20 } = input;
  const keywordWeights: Record<string, { term: string; source: ExtractedKeyword["source"]; weight: number }> = {};

  const addTerm = (term: string, source: ExtractedKeyword["source"], weight: number) => {
    const cleanTerm = term.trim();
    if (!cleanTerm || cleanTerm.length < 3) return;

    if (keywordWeights[cleanTerm]) {
      keywordWeights[cleanTerm].weight += weight;
    } else {
      keywordWeights[cleanTerm] = { term: cleanTerm, source, weight };
    }
  };

  const processContent = (text: string, source: ExtractedKeyword["source"], baseWeight: number) => {
    const clean = cleanText(text);
    // Add individual words
    tokenizeWords(clean).forEach((word) => addTerm(word, source, baseWeight));
    // Add 2-word and 3-word phrases
    extractPhrases(clean).forEach((phrase) => addTerm(phrase, source, baseWeight * 1.5));
  };

  // 1. Business Context (Highest Priority)
  if (context && context.trim().length > 0) {
    processContent(context, "context", 10);
  }

  // 2. Title
  if (page.title) {
    processContent(page.title, "title", 10);
  }

  // 3. Meta Description
  if (page.metaDescription) {
    processContent(page.metaDescription, "meta", 5);
  }

  // 4. Headings
  page.headings.forEach((h) => {
    let weight = 4;
    if (h.level === 1) weight = 8;
    else if (h.level === 2) weight = 6;
    processContent(h.text, "heading", weight);
  });

  // 5. CTAs
  page.ctas.forEach((cta) => {
    processContent(cta.text, "cta", 5);
  });

  // 6. Links
  page.links.forEach((link) => {
    processContent(link.text, "link", 1);
  });

  // 7. Body Text
  if (page.bodyText) {
    processContent(page.bodyText, "body", 1);
  }

  // Sort by weight descending
  const sorted = Object.values(keywordWeights)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);

  return sorted;
}
