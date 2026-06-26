# OpenGrowth Demo Script (90 Seconds)

A guided voiceover and visual storyboard for a quick, engaging product walkthrough.

---

### **[0:00 - 0:15] The Hook & Problem**
* **Visual**: screen starts on a typical cluttered website with scattered landing pages. Cursor scrolls through a plain text document of unstructured customer feedback notes.
* **Audio (Voiceover)**: "As developers, founders, or marketers, launching a website is only step one. The real challenge? Growth. How do you audit your SEO, conversion copy, messaging, and trust signals without paying hundreds of dollars for proprietary SaaS tools or sharing private data with external AI endpoints?"

### **[0:15 - 0:30] CLI Auditing**
* **Visual**: transitions to a clean terminal. The speaker types:
  `node dist/cli.js audit https://flowpilot.io --context "B2B SaaS feedback tool" --output my-report`
  The command runs, showcasing a clean progress bar, then prints a success scorecard summary.
* **Audio (Voiceover)**: "Meet OpenGrowth—an open-source, local-first growth operating system. With one simple command, OpenGrowth crawls your site, parses your copy, and runs a comprehensive set of deterministic, rule-based audits across SEO, content, trust, and ads."

### **[0:30 - 0:45] Beautiful Reports (HTML & Markdown)**
* **Visual**: transitions to a beautiful single-file HTML report loaded in a browser. The cursor points to the scorecard gauges (SEO: 76, Content: 68, Conversion: 70).
* **Audio (Voiceover)**: "The audit generates a single, standalone HTML report. It highlights exactly what rules passed, where your conversion leaks are, and how your trust signals stack up—all offline, with no third-party scripts or API keys required."

### **[0:45 - 1:05] Content & Ad Strategies**
* **Visual**: browser scrolls to the content blueprint and ad angle generator panels. Shows topic clusters, a 7-day marketing calendar, and ad hooks like pain/gain variations.
* **Audio (Voiceover)**: "OpenGrowth doesn't just diagnose; it maps out your execution. It automatically extracts keywords, identifies content gaps, recommends a 30-day topic calendar, and generates ready-to-use ad copy angles, hooks, and creative variations tailored to your specific audience segments."

### **[1:05 - 1:20] Self-Hosted Dashboard & GitHub Action**
* **Visual**: screen shifts to the local self-hosted dashboard at `http://localhost:3007`, demonstrating how to trigger a new audit from the GUI. Then briefly overlays a GitHub PR screen showing the OpenGrowth Action check outputting a step summary.
* **Audio (Voiceover)**: "Want a visual interface? Spin up the self-hosted local dashboard. Want to prevent regression? Drop the OpenGrowth composite GitHub Action into your CI pipeline to block pull requests if a build drops your conversion or SEO score below your custom threshold."

### **[1:20 - 1:30] The Call to Action**
* **Visual**: displays the OpenGrowth GitHub Repository URL, with the star button highlighted.
* **Audio (Voiceover)**: "OpenGrowth is fully free, deterministic, and 100% open-source. Help us shape the future of transparent growth engineering. Visit Savior-Systems on GitHub to star, fork, or submit your own audit rule packs today!"
