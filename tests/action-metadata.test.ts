import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("GitHub Action Metadata & Configuration", () => {
  const actionYmlPath = resolve(process.cwd(), "action.yml");

  it("action.yml exists", () => {
    expect(existsSync(actionYmlPath)).toBe(true);
  });

  it("contains name: OpenGrowth Audit", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("name: 'OpenGrowth Audit'");
  });

  it("contains inputs: url, context, output, min-score", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("url:");
    expect(content).toContain("context:");
    expect(content).toContain("output:");
    expect(content).toContain("min-score:");
  });

  it("contains outputs: overall-score, report-path", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("overall-score:");
    expect(content).toContain("report-path:");
  });

  it("contains using: composite", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("using: 'composite'");
  });

  it("contains actions/setup-node@v4", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("actions/setup-node@v4");
  });

  it("contains GITHUB_OUTPUT", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("GITHUB_OUTPUT");
  });

  it("contains GITHUB_STEP_SUMMARY", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("GITHUB_STEP_SUMMARY");
  });

  it("contains min-score threshold logic", () => {
    const content = readFileSync(actionYmlPath, "utf-8");
    expect(content).toContain("process.env.MIN_SCORE");
    expect(content).toContain("overallScore < minScore");
  });

  it("example workflow files exist", () => {
    const basicYml = resolve(process.cwd(), "examples/github-action/basic.yml");
    const thresholdYml = resolve(process.cwd(), "examples/github-action/threshold.yml");
    const scheduledYml = resolve(process.cwd(), "examples/github-action/scheduled-audit.yml");

    expect(existsSync(basicYml)).toBe(true);
    expect(existsSync(thresholdYml)).toBe(true);
    expect(existsSync(scheduledYml)).toBe(true);
  });

  it("examples use actions/upload-artifact@v4", () => {
    const basicContent = readFileSync(resolve(process.cwd(), "examples/github-action/basic.yml"), "utf-8");
    const thresholdContent = readFileSync(resolve(process.cwd(), "examples/github-action/threshold.yml"), "utf-8");
    const scheduledContent = readFileSync(resolve(process.cwd(), "examples/github-action/scheduled-audit.yml"), "utf-8");

    expect(basicContent).toContain("actions/upload-artifact@v4");
    expect(thresholdContent).toContain("actions/upload-artifact@v4");
    expect(scheduledContent).toContain("actions/upload-artifact@v4");
  });
});
