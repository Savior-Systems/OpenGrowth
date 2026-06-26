# OpenGrowth GitHub Action

Run OpenGrowth website growth audits in CI/CD pipelines to monitor SEO foundations, content strategies, and conversion scores automatically.

## Description

The OpenGrowth GitHub Action audits a given website, writes detailed growth reports (JSON, Markdown, and a standalone HTML file), generates a job step summary, and optionally fails if the site growth score is below a defined threshold.

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `url` | Website URL to audit (e.g., `https://mysaas.com`). | **Yes** | N/A |
| `context` | Plain-text business context for strategy and copy generation. | No | `""` |
| `output` | Output directory for audit reports. | No | `opengrowth-report` |
| `min-score` | Minimum acceptable OpenGrowth overall score. Set to `0` to disable threshold failure. | No | `"0"` |

## Outputs

| Output | Description |
|--------|-------------|
| `overall-score` | Overall OpenGrowth score (0–100). |
| `rules-passed` | Number of check rules passed. |
| `rules-total` | Total number of rules evaluated. |
| `high-priority-findings` | Number of findings flagged with `critical` or `high` severity. |
| `report-path` | Path to the generated standalone HTML report (e.g. `opengrowth-report/report.html`). |
| `output-directory` | Directory containing all generated report files. |

## Basic Usage

To run an audit and save report files as workflow artifacts:

```yaml
name: OpenGrowth Audit

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run OpenGrowth
        uses: Savior-Systems/OpenGrowth@v1
        with:
          url: https://example.com
          context: "SaaS feedback tool for product managers"
          output: opengrowth-report

      - name: Upload Report Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: opengrowth-report
          path: opengrowth-report/
```

## Enforcing Scores (Threshold Check)

To block a pull request or fail a deployment job if the score falls below a target:

```yaml
      - name: Run OpenGrowth with Score Threshold
        uses: Savior-Systems/OpenGrowth@v1
        with:
          url: https://example.com
          min-score: 75
```

## Security & Isolation

* **Safe Execution:** Inputs are passed to commands via environment variables, preventing shell injection vulnerabilities.
* **No Telemetry:** All auditing is performed locally on the runner with no external data transmission or paid AI API dependencies.
