import type { AdStrategy } from "./types.js";

/**
 * Generates the Markdown report representation of an AdStrategy.
 */
export function generateAdStrategyMarkdown(strategy: AdStrategy): string {
  const lines: string[] = [];

  lines.push("# OpenGrowth Ad Strategy");
  lines.push("");
  lines.push(`- **URL:** ${strategy.url}`);
  lines.push(`- **Generated At:** ${strategy.generatedAt}`);
  if (strategy.context) {
    lines.push(`- **Business Context:** ${strategy.context}`);
  }
  lines.push("");

  lines.push("## Summary");
  lines.push(strategy.summary);
  lines.push("");

  lines.push("## Audience Segments");
  lines.push("");
  for (const seg of strategy.audienceSegments) {
    lines.push(`### 👥 ${seg.name}`);
    lines.push(`- **Funnel Stage:** ${seg.stage}`);
    lines.push(`- **Pain Point:** ${seg.painPoint}`);
    lines.push(`- **Desired Outcome:** ${seg.desiredOutcome}`);
    lines.push(`- **Message Focus:** ${seg.messageFocus}`);
    lines.push(`- **Suggested Platforms:** ${seg.suggestedPlatforms.join(", ")}`);
    lines.push("");
  }

  lines.push("## Value Propositions");
  lines.push("");
  for (const prop of strategy.valuePropositions) {
    lines.push(`### 💡 ${prop.title} (${prop.strength} strength)`);
    lines.push(`${prop.description}`);
    lines.push(`*Evidence: ${prop.evidence}*`);
    lines.push("");
  }

  lines.push("## Ad Hooks");
  lines.push("");
  for (const hook of strategy.hooks) {
    lines.push(`- **"${hook.text}"**`);
    lines.push(`  *Family: ${hook.family} | Platforms: ${hook.platformFit.join(", ")}*`);
    lines.push(`  *Rationale: ${hook.reason}*`);
    lines.push("");
  }

  lines.push("## Ad Copy Variants");
  lines.push("");
  for (const copy of strategy.adCopyVariants) {
    lines.push(`### 📢 Platform: ${copy.platform.toUpperCase()} (${copy.stage} - ${copy.family})`);
    lines.push(`- **Headline:** ${copy.headline}`);
    if (copy.description) {
      lines.push(`- **Description:** ${copy.description}`);
    }
    lines.push(`- **Primary Text:**`);
    lines.push("  ```");
    lines.push(`  ${copy.primaryText}`);
    lines.push("  ```");
    lines.push(`- **CTA:** ${copy.cta}`);
    lines.push(`- **Creative Note:** ${copy.creativeNote}`);
    lines.push("");
  }

  lines.push("## Short Video Concepts");
  lines.push("");
  for (const video of strategy.shortVideoConcepts) {
    lines.push(`### 📹 Video: ${video.title}`);
    lines.push(`- **Hook:** ${video.hook}`);
    lines.push(`- **CTA:** ${video.cta}`);
    lines.push(`- **Platforms:** ${video.platformFit.join(", ")}`);
    lines.push(`- **Visual Direction:** ${video.visualDirection}`);
    lines.push(`- **Caption Idea:** ${video.captionIdea}`);
    lines.push("- **Outline Structure:**");
    for (const step of video.structure) {
      lines.push(`  1. ${step}`);
    }
    lines.push("");
  }

  lines.push("## Carousel Concepts");
  lines.push("");
  for (const carousel of strategy.carouselConcepts) {
    lines.push(`### 🎠 Carousel: ${carousel.title}`);
    lines.push(`- **CTA:** ${carousel.cta}`);
    lines.push(`- **Platforms:** ${carousel.platformFit.join(", ")}`);
    lines.push("- **Slides:**");
    for (const slide of carousel.slides) {
      lines.push(`  - **Slide ${slide.slide}:** ${slide.headline}`);
      lines.push(`    *Content:* ${slide.body}`);
      lines.push(`    *Visual:* ${slide.visualDirection}`);
    }
    lines.push("");
  }

  lines.push("## Creative Directions");
  lines.push("");
  for (const cd of strategy.creativeDirections) {
    lines.push(`### 🎨 Direction: ${cd.mood.split(",")[0]}`);
    lines.push(`- **Mood:** ${cd.mood}`);
    lines.push(`- **Visual Style:** ${cd.visualStyle}`);
    lines.push(`- **Composition:** ${cd.composition}`);
    lines.push(`- **Proof Elements:** ${cd.proofElements.join(", ")}`);
    lines.push(`- **Avoid:** ${cd.avoid.join(", ")}`);
    lines.push("");
  }

  lines.push("## Recommended Next Steps");
  lines.push("");
  for (const step of strategy.nextSteps) {
    lines.push(`- [ ] ${step}`);
  }
  lines.push("");

  lines.push("## Version Notice");
  lines.push("");
  lines.push(
    "This is OpenGrowth v0.5. Ad strategy is generated using deterministic website intelligence, rule results, scorecard, and content strategy. No AI or paid API is required. Image creative analysis is planned for a future version."
  );

  return lines.join("\n");
}
