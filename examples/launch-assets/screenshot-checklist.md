# OpenGrowth Launch Screenshot Checklist

High-resolution screenshots are crucial for the README and launch platforms. Use this checklist to capture clean, professional images.

## Terminal / CLI
- [ ] **CLI Audit Execution**: Capture the terminal screen while running `node dist/cli.js audit https://flowpilot.io --context "SaaS feedback"`. Highlight the colorized progress, success scorecard table, and output path.
- [ ] **Output Directory Structure**: Capture the file tree showing the 9 output files in the terminal or file manager:
  ```txt
  my-report/
  ├── scorecard.json
  ├── report.md
  ├── report.html
  ├── page-data.json
  ├── rule-results.json
  ├── content-strategy.json
  ├── content-strategy.md
  ├── ad-strategy.json
  └── ad-strategy.md
  ```

## HTML Report
- [ ] **Report Hero Section**: Open `report.html` in a web browser. Capture the top portion showcasing the URL audited, date, and overall score gauge.
- [ ] **Scorecard Metrics**: Capture the category grid displaying gauges or progress bars for SEO, Content, Conversion, Trust, and Ads.
- [ ] **Findings & Recommendations**: Capture a detailed rule failure block showing severity levels (critical/warning), evidence, and recommendations.
- [ ] **Marketing Calendar**: Capture the visual 7-day marketing calendar grid from the HTML report content strategy section.
- [ ] **Ad Angle Hooks**: Capture the formatted table of pain/gain hooks and platform ad copy variations.

## Local Dashboard
- [ ] **Dashboard Home Page**: Capture `http://localhost:3007` homepage showing the audit run form (URL, context fields) and a table of historical audits.
- [ ] **Audit Detail View**: Capture a detailed history report page displaying the overall scores, crawler metadata, and categories.

## GitHub Actions Integration
- [ ] **Pull Request Check Summary**: Capture the GitHub Actions "Step Summary" page inside a repository, demonstrating the OpenGrowth audit results output directly on the build dashboard.
