/**
 * Type definitions for normalized crawled web page data.
 */

export interface Heading {
  level: number;
  text: string;
}

export interface LinkData {
  href: string;
  text: string;
  isInternal: boolean;
  rel?: string;
}

export interface ImageData {
  src: string;
  alt: string;
}

export interface CtaData {
  text: string;
  href?: string;
  tag: "a" | "button" | "input";
}

export interface FormData {
  action?: string;
  method?: string;
  inputs: Array<{
    type?: string;
    name?: string;
    placeholder?: string;
  }>;
}

export interface PageData {
  url: string;
  canonicalUrl?: string;
  title?: string;
  metaDescription?: string;
  headings: Heading[];
  links: LinkData[];
  images: ImageData[];
  ctas: CtaData[];
  forms: FormData[];
  bodyText: string;
  openGraph: Record<string, string>;
  jsonLd: unknown[];
  robotsTxtStatus: number;
  sitemapStatus: number;
}
