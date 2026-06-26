# FlowPilot Neutral SaaS Demo

This directory contains a fictional B2B SaaS business context file (`context.txt`) and curated sample reports. It demonstrates how to run OpenGrowth website audits using predefined business details to generate tailored content and ad angle strategies.

## About FlowPilot
FlowPilot is a customer feedback and roadmap management software that centralizes scattered feature requests from multiple communication channels and automates backlog prioritization.

## How to Run the Audit

You can run an OpenGrowth audit against any target landing page using the FlowPilot context:

### macOS / Linux (bash)

```bash
# Audit a target URL using the context file content
node dist/cli.js audit https://example.com --context "$(cat examples/neutral-saas/context.txt)" --output opengrowth-report
```

### Windows (PowerShell)

```powershell
# Read context content and run audit
$context = Get-Content examples/neutral-saas/context.txt -Raw
node dist/cli.js audit https://example.com --context "$context" --output opengrowth-report
```

## Generated Outputs
Running the audit creates a folder named `opengrowth-report/` containing 9 output files:
1. `scorecard.json` — Aggregated metrics scorecard.
2. `report.md` — Priority findings and next steps checklist.
3. `report.html` — Offline-ready interactive dashboard report.
4. `page-data.json` — Raw data crawled from the landing page.
5. `rule-results.json` — Detailed list of pass/fail states for all 26+ rules.
6. `content-strategy.json` — Content plan data models.
7. `content-strategy.md` — 30-day topic cluster calendar.
8. `ad-strategy.json` — Structured ad copy templates and segment schemas.
9. `ad-strategy.md` — Ready-to-copy ad hooks and creative outline concepts.

## How to Utilize the Results

* **For Founders**: Check the `scorecard.json` overall score to audit conversion readiness. Use `ad-strategy.md` hooks to draft initial landing page copy adjustments.
* **For Marketers & Copywriters**: Copy the 30-day calendar from `content-strategy.md` to feed your blog production. Customize platform-specific copy variants from `ad-strategy.md` to launch LinkedIn or Twitter/X ad campaigns.
* **For Developers**: Open `report.html` to find and fix failed SEO metadata, structural HTML, or canonical URL rule violations.
