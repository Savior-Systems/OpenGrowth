/**
 * URL validation and normalization utilities.
 */

/**
 * Check if a string is a valid URL (http or https).
 * Bare domains like "example.com" are considered valid (will be normalized).
 */
export function isValidUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  // Try as-is first (already has protocol)
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    // Fall through — might be a bare domain
  }

  // Try with https:// prefix (bare domain)
  try {
    const url = new URL(`https://${trimmed}`);
    // Must have a dot in hostname to be a real domain
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

/**
 * Normalize a URL string:
 * - Add https:// if no protocol
 * - Remove trailing slash from pathname
 * - Lowercase the hostname
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();

  let urlString = trimmed;
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }

  const url = new URL(urlString);
  url.hostname = url.hostname.toLowerCase();

  // Remove trailing slash (but keep "/" for root)
  let result = url.toString();
  if (result.endsWith("/") && url.pathname === "/") {
    result = result.slice(0, -1);
  }

  return result;
}
