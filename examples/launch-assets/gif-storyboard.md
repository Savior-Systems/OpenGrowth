# OpenGrowth Landing Page GIF Storyboard

A 20-30 second high-framerate animated GIF demonstrating the core user flow, loop-playable, for the top of the README.md.

---

## Storyboard Outline

### **Frame 1: Command Initiation [0s - 3s]**
- **Visual**: A clean dark terminal window. A cursor quickly types the audit command:
  ```bash
  node dist/cli.js audit https://example.com --context "Product feedback tracker" --output report
  ```
- **Action**: User presses Enter. The prompt shows a loading spinner or brief progress output.

### **Frame 2: Audit Completion [3s - 6s]**
- **Visual**: The CLI outputs the color-coded scoring table representing the five categories (SEO, Content, Conversion, Trust, Ads) along with the final success summary.
- **Action**: Cursor highlights the scorecard table briefly.

### **Frame 3: Open report.html [6s - 12s]**
- **Visual**: Screen transitions (via slide or quick cut) to a web browser loading the generated `report.html` page locally.
- **Action**: Smooth scroll down past the overall score gauge (e.g., 72), down to the findings category, and hover over a failing trust rule recommendation.

### **Frame 4: Content & Ad strategy scroll [12s - 18s]**
- **Visual**: Rapid but legible scroll through the content marketing cluster calendar and generated ad hooks table.
- **Action**: Focuses briefly on the ready-to-copy ad copy lines.

### **Frame 5: Self-Hosted Dashboard in Action [18s - 23s]**
- **Visual**: Transitions to the self-hosted dashboard (`http://localhost:3007`).
- **Action**: A user clicks the "Run Audit" button on the UI, and the screen displays the audit details updating in real-time.

### **Frame 6: End Card [23s - 26s]**
- **Visual**: A clean, animated text card:
  ```txt
  OpenGrowth
  Free • Local-First • Extensible
  Star it on GitHub 🚀
  ```
- **Action**: Fades out, looping back smoothly to Frame 1.
