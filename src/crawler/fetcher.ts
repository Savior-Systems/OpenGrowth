/**
 * HTTP Crawler Fetcher.
 * Retrieves page content and checks robots/sitemaps.
 */

export interface FetchResult {
  html: string;
  finalUrl: string;
  status: number;
}

const USER_AGENT = "OpenGrowthCrawler/0.2.0 (GitHub OpenGrowth)";

/**
 * Fetch HTML content from a URL.
 */
export async function fetchPage(
  url: string,
  options: { timeoutMs?: number } = {},
): Promise<FetchResult> {
  const timeoutMs = options.timeoutMs ?? 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error(`Invalid content type: "${contentType}". Only HTML pages can be audited.`);
    }

    const html = await response.text();
    return {
      html,
      finalUrl: response.url || url,
      status: response.status,
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Perform a lightweight HTTP check (status code only) for a URL.
 * Tries HEAD first, falls back to GET if HEAD fails.
 */
export async function getUrlStatus(
  url: string,
  options: { timeoutMs?: number } = {},
): Promise<number> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Try HEAD first to avoid downloading full files (e.g. sitemaps can be large)
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": USER_AGENT,
      },
      signal: controller.signal,
    });
    
    // Some servers block HEAD or return 405/404 erroneously, fallback to GET if so
    if (response.status >= 400 && response.status !== 404) {
      throw new Error("HEAD failed, trying GET");
    }
    
    return response.status;
  } catch {
    try {
      const getController = new AbortController();
      const getTimeoutId = setTimeout(() => getController.abort(), timeoutMs);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": USER_AGENT,
          },
          signal: getController.signal,
        });
        return response.status;
      } finally {
        clearTimeout(getTimeoutId);
      }
    } catch {
      return 0; // Unreachable
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
