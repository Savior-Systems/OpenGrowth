import type { CreativeDirection, AdInputData } from "./types.js";

/**
 * Generates at least 5 text-based creative directions based on ad inputs.
 */
export function generateCreativeDirections(input: AdInputData): CreativeDirection[] {
  const topic = input.primaryTopic;
  const weakArea = input.weakAreas[0] || "website friction";

  return [
    {
      mood: "Professional, analytical, technical, clean",
      visualStyle: "SaaS dashboard mockup UI layout, dark mode aesthetic, high contrast grids",
      composition: "Central browser mockup displaying simulated growth scores and green checklist indicators for title/SSL tags. Detailed category cards on the sides.",
      proofElements: ["Overall Score badge (e.g. 76/100)", "Checklist checkmarks for SEO/Conversion", "Categorical breakdowns"],
      avoid: ["Generic stock photos of corporate business meetings", "Overly complex flowchart diagrams that reduce readability", "Unprofessional color gradients"],
    },
    {
      mood: "Authentic, direct, organic, developer-focused",
      visualStyle: "Founder/operator workspace setup, natural lighting, high-quality desk layout",
      composition: "Top-down view of a developer desk with a laptop screen displaying a terminal running the audit command. A coffee mug and keyboard are partially visible in soft focus.",
      proofElements: ["Command line terminal text", "Open source GitHub repository indicator badge"],
      avoid: ["Studio-lit model setups", "Perfectly pristine artificial stock environments", "Flashy marketing badges"],
    },
    {
      mood: "Informative, structural, educational, high clarity",
      visualStyle: "Audit report visualization, clean markdown document preview, highlighted text elements",
      composition: "Zoomed view of a structured markdown report document showing findings, prioritized recommendations, and critical severity markers (red/orange).",
      proofElements: ["High priority findings highlights", "Checklist markers for trust and conversion rules"],
      avoid: ["Cartoonish illustrations", "Vague abstract art assets", "Messy, unreadable code snippets"],
    },
    {
      mood: "Problem-solving, direct contrast, transformational",
      visualStyle: "Before/after split screen layout, neon highlighting indicators",
      composition: "Left side: A webpage showing red warning borders highlighting passive CTA labels and missing policy tags. Right side: The optimized version highlighting green borders and active buttons.",
      proofElements: ["Comparison labels", "Friction count reduction indicators"],
      avoid: ["Misleading graphical comparisons", "Extreme, unrealistic transformation curves"],
    },
    {
      mood: "Tactical, action-oriented, simple",
      visualStyle: "Minimal checklist card, flat vector graphic, clean typography",
      composition: "A simple vertical card with a checklist of audit parameters (SEO Title, Secure Connection, Form Fields, CTA Verb) with checkboxes showing a mix of failed/passed states.",
      proofElements: ["Checklist progress bar (e.g. 9/26 passed)", "Bold category tags"],
      avoid: ["Cluttered visual elements", "Small, unreadable font sizes", "Unbranded illustrations"],
    },
  ];
}
