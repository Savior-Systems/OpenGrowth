import * as cheerio from "cheerio";
import {
  PageData,
  Heading,
  LinkData,
  ImageData,
  CtaData,
  FormData,
} from "../models/page-data.js";

const CTA_TEXT_KEYWORDS = [
  "get started",
  "sign up",
  "free trial",
  "subscribe",
  "buy now",
  "join",
  "book a demo",
  "create account",
  "register",
  "download now",
  "get it now",
  "contact us",
  "try for free",
  "try free",
  "get access",
];

/**
 * Resolve a URL relative to a base URL.
 */
function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

/**
 * Check if a resolved URL is internal to the base URL.
 */
function isInternalUrl(resolvedUrl: string, baseUrl: string): boolean {
  try {
    const res = new URL(resolvedUrl);
    const base = new URL(baseUrl);
    return res.hostname === base.hostname;
  } catch {
    // If it's a relative path that couldn't be parsed (shouldn't happen if resolved),
    // or an anchor link/javascript/mailto, treat as not internal unless it starts with #
    return resolvedUrl.startsWith("#") || resolvedUrl.startsWith("/");
  }
}

/**
 * Check if the text matches common CTA phrasing.
 */
function isCtaText(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return false;
  return CTA_TEXT_KEYWORDS.some((kw) => normalized.includes(kw));
}

/**
 * Check if the element's classes look like a CTA/button.
 */
function hasCtaClass(classes: string): boolean {
  if (!classes) return false;
  const list = classes.toLowerCase().split(/\s+/);
  return list.some(
    (cls) => cls.includes("btn") || cls.includes("button") || cls.includes("cta"),
  );
}

/**
 * Parse an HTML document and extract structured PageData.
 */
export function parseHtml(html: string, finalUrl: string): Omit<PageData, "robotsTxtStatus" | "sitemapStatus"> {
  const $ = cheerio.load(html);

  // 1. Basic SEO Metadata
  const title = $("title").text().trim() || undefined;
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || undefined;
  const canonical = $('link[rel="canonical"]').attr("href");
  const canonicalUrl = canonical ? resolveUrl(canonical, finalUrl) : undefined;

  // 2. Headings (h1 - h6)
  const headings: Heading[] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const level = parseInt(el.tagName.substring(1), 10);
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text) {
      headings.push({ level, text });
    }
  });

  // 3. Links
  const links: LinkData[] = [];
  $("a").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    const text = $el.text().replace(/\s+/g, " ").trim();
    
    if (href) {
      const resolved = resolveUrl(href, finalUrl);
      links.push({
        href: resolved,
        text: text || "[No Link Text]",
        isInternal: isInternalUrl(resolved, finalUrl),
        rel: $el.attr("rel")?.trim(),
      });
    }
  });

  // 4. Images
  const images: ImageData[] = [];
  $("img").each((_, el) => {
    const $el = $(el);
    const src = $el.attr("src");
    const alt = $el.attr("alt") || "";
    if (src) {
      images.push({
        src: resolveUrl(src, finalUrl),
        alt: alt.trim(),
      });
    }
  });

  // 5. CTAs (Call to Actions)
  const ctas: CtaData[] = [];
  
  // Scan buttons
  $("button").each((_, el) => {
    const $el = $(el);
    const text = $el.text().replace(/\s+/g, " ").trim();
    if (text) {
      ctas.push({
        text,
        tag: "button",
      });
    }
  });

  // Scan inputs that are buttons
  $('input[type="submit"], input[type="button"]').each((_, el) => {
    const $el = $(el);
    const text = $el.attr("value")?.trim() || "";
    if (text) {
      ctas.push({
        text,
        tag: "input",
      });
    }
  });

  // Scan anchors that look like buttons or have CTA text
  $("a").each((_, el) => {
    const $el = $(el);
    const text = $el.text().replace(/\s+/g, " ").trim();
    const href = $el.attr("href");
    const classes = $el.attr("class") || "";

    if (text && (hasCtaClass(classes) || isCtaText(text))) {
      ctas.push({
        text,
        href: href ? resolveUrl(href, finalUrl) : undefined,
        tag: "a",
      });
    }
  });

  // 6. Forms
  const forms: FormData[] = [];
  $("form").each((_, el) => {
    const $form = $(el);
    const action = $form.attr("action");
    const method = $form.attr("method") || "get";
    const inputs: Array<{ type?: string; name?: string; placeholder?: string }> = [];

    $form.find("input, textarea, select, button").each((_, inputEl) => {
      const $input = $(inputEl);
      const tagName = inputEl.tagName.toLowerCase();
      let type = $input.attr("type") || tagName;
      
      if (tagName === "textarea" || tagName === "select" || tagName === "button") {
        type = tagName;
      }

      inputs.push({
        type,
        name: $input.attr("name") || undefined,
        placeholder: $input.attr("placeholder") || undefined,
      });
    });

    forms.push({
      action: action ? resolveUrl(action, finalUrl) : undefined,
      method: method.toLowerCase(),
      inputs,
    });
  });

  // 7. Open Graph
  const openGraph: Record<string, string> = {};
  $('meta[property^="og:"], meta[name^="og:"]').each((_, el) => {
    const $el = $(el);
    const property = $el.attr("property") || $el.attr("name") || "";
    const key = property.substring(3); // strip "og:"
    const content = $el.attr("content") || "";
    if (key && content) {
      openGraph[key] = content;
    }
  });

  // 8. JSON-LD Structured Data
  const jsonLd: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html();
    if (content) {
      try {
        const parsed = JSON.parse(content.trim());
        jsonLd.push(parsed);
      } catch {
        // Skip invalid JSON-LD
      }
    }
  });

  // 9. Visible Text (extract text from body but exclude scripts, styles, etc.)
  const $textClone = cheerio.load(html);
  $textClone("script, style, noscript, svg, iframe").remove();
  const bodyText = $textClone("body").text().replace(/\s+/g, " ").trim();

  return {
    url: finalUrl,
    canonicalUrl,
    title,
    metaDescription,
    headings,
    links,
    images,
    ctas,
    forms,
    bodyText,
    openGraph,
    jsonLd,
  };
}
