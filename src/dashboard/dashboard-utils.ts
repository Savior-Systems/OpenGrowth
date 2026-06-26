import { resolve, relative, normalize } from "node:path";

export const ALLOWED_FILENAMES = [
  "scorecard.json",
  "report.md",
  "report.html",
  "page-data.json",
  "rule-results.json",
  "content-strategy.json",
  "content-strategy.md",
  "ad-strategy.json",
  "ad-strategy.md"
];

/**
 * Generate a safe unique ID based on a URL and a timestamp.
 */
export function generateAuditId(url: string): string {
  const cleanUrl = url
    .replace(/^https?:\/\//i, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const timestamp = Date.now();
  const slug = cleanUrl.slice(0, 50);
  return `${timestamp}-${slug}`;
}

/**
 * Validate that the audit ID contains only alphanumeric characters and dashes.
 */
export function isSafeAuditId(id: string): boolean {
  if (!id) return false;
  return /^[a-zA-Z0-9-]+$/.test(id);
}

/**
 * Validate that the filename matches exactly one of the allowed report filenames.
 */
export function isSafeFilename(filename: string): boolean {
  return ALLOWED_FILENAMES.includes(filename);
}

/**
 * Path safety helper to prevent serving arbitrary files outside dashboard data/report directories.
 */
export function isSafeFilePath(baseDir: string, targetPath: string): boolean {
  const resolvedBase = resolve(baseDir);
  const resolvedTarget = resolve(targetPath);
  const rel = relative(resolvedBase, resolvedTarget);
  // Must be within base directory and not contain path traversal indicators
  return !rel.startsWith("..") && !normalize(targetPath).includes("..") && !targetPath.includes("..");
}
