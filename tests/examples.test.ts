import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

describe("OpenGrowth v0.9 Examples and Launch Assets", () => {
  const rootDir = resolve(__dirname, "..");
  const examplesDir = resolve(rootDir, "examples");
  const launchAssetsDir = resolve(examplesDir, "launch-assets");
  const neutralSaaSDir = resolve(examplesDir, "neutral-saas");
  const reportGalleryDir = resolve(examplesDir, "report-gallery");

  it("1. neutral SaaS context exists", () => {
    expect(existsSync(resolve(neutralSaaSDir, "context.txt"))).toBe(true);
    const content = readFileSync(resolve(neutralSaaSDir, "context.txt"), "utf-8");
    expect(content).toContain("FlowPilot");
  });

  it("2. neutral SaaS README exists", () => {
    expect(existsSync(resolve(neutralSaaSDir, "README.md"))).toBe(true);
    const content = readFileSync(resolve(neutralSaaSDir, "README.md"), "utf-8");
    expect(content).toContain("FlowPilot");
    expect(content).toContain("opengrowth-report");
  });

  it("3. launch assets README exists", () => {
    expect(existsSync(resolve(launchAssetsDir, "README.md"))).toBe(true);
  });

  it("4. product-hunt.md exists", () => {
    expect(existsSync(resolve(launchAssetsDir, "product-hunt.md"))).toBe(true);
  });

  it("5. hacker-news-show-hn.md exists", () => {
    expect(existsSync(resolve(launchAssetsDir, "hacker-news-show-hn.md"))).toBe(true);
  });

  it("6. reddit-posts.md exists", () => {
    expect(existsSync(resolve(launchAssetsDir, "reddit-posts.md"))).toBe(true);
  });

  it("7. report gallery README exists", () => {
    expect(existsSync(resolve(reportGalleryDir, "README.md"))).toBe(true);
    const content = readFileSync(resolve(reportGalleryDir, "README.md"), "utf-8");
    expect(content).toContain("Anonymise Sensitive Data");
  });

  it("8. example report issue template exists", () => {
    const templatePath = resolve(rootDir, ".github/ISSUE_TEMPLATE/example_report.md");
    expect(existsSync(templatePath)).toBe(true);
    const content = readFileSync(templatePath, "utf-8");
    expect(content).toContain("example-report");
  });

  it("9. README references examples/neutral-saas", () => {
    const readmeContent = readFileSync(resolve(rootDir, "README.md"), "utf-8");
    expect(readmeContent).toContain("examples/neutral-saas");
  });

  it("10. launch drafts do not contain 'guaranteed 1M stars' or 'buy stars'", () => {
    const filesToCheck = [
      "product-hunt.md",
      "hacker-news-show-hn.md",
      "reddit-posts.md",
      "linkedin-post.md",
      "x-thread.md",
      "community-outreach.md",
    ];

    for (const file of filesToCheck) {
      const filePath = resolve(launchAssetsDir, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, "utf-8");
        expect(content.toLowerCase()).not.toContain("guaranteed 1m stars");
        expect(content.toLowerCase()).not.toContain("guaranteed 1 million stars");
        expect(content.toLowerCase()).not.toContain("buy stars");
        expect(content.toLowerCase()).not.toContain("purchase stars");
      }
    }
  });

  it("11. launch drafts include no fake-star strategy", () => {
    const filesToCheck = [
      "product-hunt.md",
      "hacker-news-show-hn.md",
      "reddit-posts.md",
      "linkedin-post.md",
      "x-thread.md",
      "community-outreach.md",
    ];

    for (const file of filesToCheck) {
      const filePath = resolve(launchAssetsDir, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, "utf-8");
        expect(content.toLowerCase()).not.toContain("fake star");
        expect(content.toLowerCase()).not.toContain("buy upvotes");
        expect(content.toLowerCase()).not.toContain("purchased engagement");
      }
    }
  });

  it("12. package version is 1.0.0-rc.1", () => {
    const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf-8"));
    expect(packageJson.version).toBe("1.0.0-rc.1");
  });
});
