/**
 * HTML Report Utility Functions
 */

/**
 * Escapes special characters for safe insertion into HTML markup.
 * Handled targets: &, <, >, ", '
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Clamps a score value to an integer between 0 and 100.
 */
export function clampScore(score: number): number {
  if (typeof score !== "number" || isNaN(score)) {
    return 0;
  }
  const rounded = Math.round(score);
  return Math.max(0, Math.min(100, rounded));
}

/**
 * Maps scorecard numeric score to a visual rating category.
 */
export function scoreLabel(score: number): "critical" | "weak" | "fair" | "good" | "excellent" {
  const clamped = clampScore(score);
  if (clamped < 40) return "critical";
  if (clamped < 60) return "weak";
  if (clamped < 75) return "fair";
  if (clamped < 90) return "good";
  return "excellent";
}

/**
 * Returns a formatted visual representation of a string list up to a limit.
 */
export function formatList(items: string[], limit?: number): string {
  if (!items || items.length === 0) {
    return "";
  }
  const sliced = typeof limit === "number" ? items.slice(0, limit) : items;
  return sliced.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
}

/**
 * Generates an HTML id-safe slug from a string.
 */
export function slugify(value: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}
