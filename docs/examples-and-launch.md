# Examples and Launch Assets Guide

This document outlines the organization of OpenGrowth's curated examples, launch materials, and the guidelines for community outreach.

---

## 1. Directory Structure

```txt
examples/
├─ neutral-saas/            # FlowPilot SaaS Audit demo context and reports
│  ├─ README.md             # How to run and interpret FlowPilot audit
│  ├─ context.txt           # Fictional B2B SaaS context parameters
│  ├─ sample-scorecard.json # Curated demo scorecard output
│  ├─ sample-report.md      # Curated markdown audit findings
│  ├─ sample-content-strategy.md
│  ├─ sample-ad-strategy.md
│  └─ screenshots-plan.md   # Visual dashboard placeholder guide
├─ launch-assets/           # Public launch drafts
│  ├─ README.md             # Launch folder index
│  ├─ demo-script.md        # 90-second product demo video script
│  ├─ screenshot-checklist.md
│  ├─ gif-storyboard.md     # Storyboard for top-level terminal/UI GIF
│  ├─ product-hunt.md       # PH submission copy and makers comments
│  ├─ hacker-news-show-hn.md# Grounded engineering-first Show HN post
│  ├─ reddit-posts.md       # Customized reddit drafts (r/webdev, r/opensource...)
│  ├─ linkedin-post.md      # Builder-centric LinkedIn narrative
│  ├─ x-thread.md           # Features thread for Twitter/X
│  └─ community-outreach.md # List of directories and engagement rules
└─ report-gallery/          # Public report submissions index
   └─ README.md             # Contributing guidelines & anonymization rules
```

---

## 2. Neutral SaaS Demo (FlowPilot)

We have provided a pre-configured audit context for a fictional B2B SaaS tool called **FlowPilot** (Customer feedback & roadmap manager).

To run this audit locally:
- **Bash / zsh**:
  ```bash
  node dist/cli.js audit https://example.com --context "$(cat examples/neutral-saas/context.txt)" --output opengrowth-report
  ```
- **PowerShell (Windows)**:
  ```powershell
  $context = Get-Content examples/neutral-saas/context.txt -Raw
  node dist/cli.js audit https://example.com --context "$context" --output opengrowth-report
  ```

---

## 3. Creating Launch Visuals

### Screenshots
Follow the checklist in [examples/launch-assets/screenshot-checklist.md](../examples/launch-assets/screenshot-checklist.md) to take screenshots. Ensure:
- The terminal color theme is readable (prefer dark mode).
- The web browser window does not show unrelated bookmarks or tabs.
- Images are saved as compressed PNGs or WebP in the assets directory.

### Animated GIFs
Follow the storyboard in [examples/launch-assets/gif-storyboard.md](../examples/launch-assets/gif-storyboard.md) to record a GIF:
- Keep the terminal size standard (e.g., 80x24 characters).
- Record at 15-30 fps.
- Compress the final GIF to keep it under 3MB for fast loading on GitHub.

---

## 4. Submitting to the Report Gallery

We encourage contributors to submit audit reports from diverse web categories. To submit a report:
1. Run `opengrowth audit <your-url>`.
2. Follow the anonymization rules in [examples/report-gallery/README.md](../examples/report-gallery/README.md).
3. Place your output folder in `examples/report-gallery/<site-name>/`.
4. Open a Pull Request using the **Example Report Submission** issue template.

---

## 5. Ethical Promotion Rules

OpenGrowth is committed to transparent, value-driven growth:
- **No Purchased Engagement**: Never buy fake stars, upvotes, or fake accounts to boost traction.
- **Provide Value First**: When posting on forums, discuss a problem solved or architectural decision made, rather than pleading for repository stars.
- **Explicit Affiliation**: Disclose your connection to the Savior-Systems team.
- **No Spam**: Do not cross-post to multiple subreddits without adjusting details for the community's interest.
