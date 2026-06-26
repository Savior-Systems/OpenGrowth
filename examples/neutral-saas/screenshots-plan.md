# Screenshots Plan — FlowPilot Demo

This plan outlines the visual screenshots that can be captured to demonstrate the FlowPilot demo in OpenGrowth's public documentation and launch assets.

## Screenshot Checklist

1. **Terminal CLI Audit**
   * **Action**: Run `node dist/cli.js audit https://example.com --context "$(cat examples/neutral-saas/context.txt)"` in a terminal.
   * **Capture**: The terminal window displaying the growth scorecard block and output files summary.
2. **Dashboard Home View**
   * **Action**: Start the dashboard and navigate to `http://localhost:3007`.
   * **Capture**: The main dashboard page showing the FlowPilot audit in the historical runs table, along with the URL form.
3. **Audit Detail View**
   * **Action**: Click on the FlowPilot audit details link.
   * **Capture**: The scorecard gauge section, category breakdown card, and download list showing all 9 strategy files.
4. **HTML Report view**
   * **Action**: Click the "Open Full HTML Report" button from the details page.
   * **Capture**: The interactive HTML report header, overall score badge, and content cluster blocks.
