# OpenGrowth Dashboard

OpenGrowth provides a lightweight, local-first, self-hosted web dashboard for managing your audits, launching new audits via a graphical user interface, and viewing completed or historical audit blueprints.

## Key Features

1. **Lightweight & Local-First**: Written in pure Node.js using native HTTP wrappers, without heavy client-side JavaScript frameworks or external databases.
2. **Audit Execution**: Run audits directly from your browser by entering a target URL and business context.
3. **Historical Log**: Access a list of past audit runs, overall scores, and key metrics.
4. **Report Explorer**: Seamlessly link to generated JSON, HTML, and Markdown reports.
5. **Scorecard Visualizer**: Inspect category breakdown scores and prioritised recommendations.

## CLI Usage

Start the dashboard locally:

```bash
# Build the CLI project
npm run build

# Start the dashboard on the default port (3007)
node dist/cli.js dashboard

# Start on a custom port and data directory
node dist/cli.js dashboard --port 3007 --data .opengrowth-data
```

Once started, open your browser and navigate to `http://localhost:3007`.

## Data Storage

All dashboard records and reports are stored inside a local folder (by default `.opengrowth-data/` at the root of the project).
* **Metadata Store**: `.opengrowth-data/audits.json` houses the historical run list, status indicators, and overall scores.
* **Report Artifacts**: `.opengrowth-data/reports/<audit-id>/` contains all 9 generated files for each run (scorecards, markdown reports, ad-strategy files, etc.).

This directory is marked as gitignored to ensure local audit records are never committed to version control.

## Security and Path Safety Model

To keep the local server safe and robust:
* **Strict Filename Allowlist**: Only files exactly matching the allowlist (`scorecard.json`, `report.html`, `report.md`, `page-data.json`, `rule-results.json`, `content-strategy.json`, `content-strategy.md`, `ad-strategy.json`, `ad-strategy.md`) can be served from the local file system.
* **Path Traversal Mitigation**: The server verifies that all resolved paths remain strictly inside the local audit reports directory, rejecting `..` traversal attempts with a `403 Forbidden` error.
* **HTML Escaping**: All inputs derived from the web crawler (like page title, headings) and the dashboard forms (like context, URL parameters) are sanitised using `escapeHtml` before rendering.

## Future Dashboard Roadmap

* **Filters and Search**: Search and filter past audits by target domain name or category score.
* **Compare Audits**: Select two historical runs of the same URL to compare score improvements.
* **Offline Rules Customizer**: Toggle active rules or adjust category weights directly from the dashboard settings tab.
