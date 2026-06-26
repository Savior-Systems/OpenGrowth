import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseHtml } from "../src/crawler/parser.js";
import { fetchPage, getUrlStatus } from "../src/crawler/fetcher.js";

// Load fixture
const fixturePath = resolve(process.cwd(), "tests/fixtures/example.html");
const fixtureHtml = readFileSync(fixturePath, "utf-8");

describe("Parser (parseHtml)", () => {
  const basePageUrl = "https://saasify.demo";
  
  it("extracts basic SEO metadata", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    expect(data.url).toBe("https://saasify.demo");
    expect(data.title).toBe("SaaSify - Grow your business faster");
    expect(data.metaDescription).toBe(
      "SaaSify is a growth platform designed for modern software startups to optimize pipelines and boost retention."
    );
    expect(data.canonicalUrl).toBe("https://saasify.demo/pricing");
  });

  it("extracts headings structure preserving level and content", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    expect(data.headings).toHaveLength(5);
    expect(data.headings[0]).toEqual({ level: 1, text: "Supercharge Your Startup Growth" });
    expect(data.headings[1]).toEqual({ level: 2, text: "Advanced Features" });
    expect(data.headings[2]).toEqual({ level: 3, text: "Smart Analytics" });
    expect(data.headings[3]).toEqual({ level: 2, text: "Simple Pricing" });
    expect(data.headings[4]).toEqual({ level: 2, text: "Join our newsletter" });
  });

  it("extracts links and correctly classifies internal vs external", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    
    // Total links: 2 headers + 2 heroes + 2 footers + 1 in nav (duplicate or similar)
    // nav: /features, #pricing, https://saasify.demo/pricing
    // hero: /signup, /demo
    // footer: https://twitter.com/saasify, https://github.com/saasify
    expect(data.links.length).toBe(7);

    const internalLinks = data.links.filter((l) => l.isInternal);
    const externalLinks = data.links.filter((l) => !l.isInternal);

    expect(internalLinks).toHaveLength(5);
    expect(externalLinks).toHaveLength(2);

    expect(internalLinks.map((l) => l.href)).toContain("https://saasify.demo/features");
    expect(internalLinks.map((l) => l.href)).toContain("https://saasify.demo/#pricing");
    expect(internalLinks.map((l) => l.href)).toContain("https://saasify.demo/pricing");
    expect(internalLinks.map((l) => l.href)).toContain("https://saasify.demo/signup");
    expect(internalLinks.map((l) => l.href)).toContain("https://saasify.demo/demo");

    expect(externalLinks.map((l) => l.href)).toContain("https://twitter.com/saasify");
    expect(externalLinks.map((l) => l.href)).toContain("https://github.com/saasify");
  });

  it("extracts images resolving src relative to base URL", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    expect(data.images).toHaveLength(2);

    expect(data.images[0]).toEqual({
      src: "https://saasify.demo/images/logo.png",
      alt: "",
    });
    expect(data.images[1]).toEqual({
      src: "https://saasify.demo/images/hero.png",
      alt: "SaaSify Dashboard Mockup",
    });
  });

  it("extracts CTAs using class heuristics and phrase matching", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    
    // We expect:
    // 1. "Start Free Trial" (button tag)
    // 2. "Subscribe" (form submit button tag) - wait, we only scan "button" and "input[type=submit/button]" and anchor
    //    Newsletter has <button type="submit">Subscribe</button>, which matches button tag.
    // 3. "Sign up today" (anchor with cta class and text)
    // 4. "Book a Demo" (anchor with CTA phrase)
    expect(data.ctas.length).toBeGreaterThanOrEqual(4);

    const texts = data.ctas.map((c) => c.text);
    expect(texts).toContain("Start Free Trial");
    expect(texts).toContain("Subscribe");
    expect(texts).toContain("Sign up today");
    expect(texts).toContain("Book a Demo");
  });

  it("extracts form fields, methods and actions", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    expect(data.forms).toHaveLength(1);
    expect(data.forms[0].action).toBe("https://saasify.demo/subscribe");
    expect(data.forms[0].method).toBe("post");
    expect(data.forms[0].inputs).toHaveLength(2);
    expect(data.forms[0].inputs[0]).toEqual({
      type: "email",
      name: "email",
      placeholder: "Enter your email",
    });
    expect(data.forms[0].inputs[1]).toEqual({
      type: "button", // <button type="submit"> resolves to "button" since tag is button
      name: undefined,
      placeholder: undefined,
    });
  });

  it("extracts Open Graph properties", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    expect(data.openGraph).toEqual({
      title: "SaaSify Growth Platform",
      description: "Supercharge your startup's conversion rates today.",
      image: "https://saasify.demo/og-image.jpg",
    });
  });

  it("extracts and parses JSON-LD structured data", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    expect(data.jsonLd).toHaveLength(1);
    expect(data.jsonLd[0]["@type"]).toBe("SoftwareApplication");
    expect(data.jsonLd[0].name).toBe("SaaSify");
  });

  it("extracts visible body text without scripts/styles tags", () => {
    const data = parseHtml(fixtureHtml, basePageUrl);
    expect(data.bodyText).toContain("Supercharge Your Startup Growth");
    expect(data.bodyText).toContain("Simple Pricing");
    expect(data.bodyText).not.toContain("SoftwareApplication"); // shouldn't contain JSON-LD script contents
  });
});

describe("Fetcher (fetchPage & getUrlStatus)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetchPage retrieves html and returns finalUrl on success", async () => {
    const mockHtml = "<html><body>Hello World</body></html>";
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => "text/html; charset=utf-8",
      } as unknown as Headers,
      text: async () => mockHtml,
      url: "https://final-destination.com",
    } as unknown as Response);

    const result = await fetchPage("https://initial-url.com");
    expect(result.html).toBe(mockHtml);
    expect(result.finalUrl).toBe("https://final-destination.com");
    expect(result.status).toBe(200);
    expect(globalThis.fetch).toHaveBeenCalledWith("https://initial-url.com", expect.any(Object));
  });

  it("fetchPage throws an error on non-ok status codes", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as unknown as Response);

    await expect(fetchPage("https://missing.com")).rejects.toThrow("HTTP error! Status: 404");
  });

  it("fetchPage throws on invalid content types", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => "application/pdf",
      } as unknown as Headers,
    } as unknown as Response);

    await expect(fetchPage("https://site.com/doc.pdf")).rejects.toThrow(
      'Invalid content type: "application/pdf". Only HTML pages can be audited.'
    );
  });

  it("getUrlStatus sends HEAD request and falls back to GET on non-404 failure", async () => {
    // 1st call: HEAD fails with 500 (throws or returns bad code)
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      status: 500,
    } as unknown as Response);
    
    // 2nd call: GET succeeds with 200
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      status: 200,
    } as unknown as Response);

    const status = await getUrlStatus("https://example.com/sitemap.xml");
    expect(status).toBe(200);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(vi.mocked(globalThis.fetch).mock.calls[0][1]).toMatchObject({ method: "HEAD" });
    expect(vi.mocked(globalThis.fetch).mock.calls[1][1]).toMatchObject({ method: "GET" });
  });

  it("getUrlStatus returns status 404 immediately from HEAD without GET fallback", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      status: 404,
    } as unknown as Response);

    const status = await getUrlStatus("https://example.com/missing.xml");
    expect(status).toBe(404);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(vi.mocked(globalThis.fetch).mock.calls[0][1]).toMatchObject({ method: "HEAD" });
  });
});
