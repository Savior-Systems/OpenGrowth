import type { ContentStrategy } from "./types.js";

/**
 * Generate a beautifully formatted Markdown report for the Content Strategy.
 */
export function generateContentStrategyMarkdown(strategy: ContentStrategy): string {
  const lines: string[] = [];

  lines.push("# OpenGrowth Content Strategy");
  lines.push("");
  lines.push(`- **Audited URL:** ${strategy.url}`);
  lines.push(`- **Strategy Date:** ${strategy.generatedAt}`);
  if (strategy.context) {
    lines.push(`- **Business Context:** ${strategy.context}`);
  }
  lines.push("");

  lines.push("## Summary");
  lines.push(strategy.summary);
  lines.push("");

  lines.push("## Extracted Keywords");
  lines.push("");
  lines.push("| Keyword/Phrase | Source | Weight |");
  lines.push("|----------------|--------|--------|");
  strategy.extractedKeywords.forEach((kw) => {
    lines.push(`| ${kw.term} | ${kw.source} | ${kw.weight} |`);
  });
  lines.push("");

  lines.push("## Topic Clusters");
  lines.push("");
  strategy.topicClusters.forEach((cluster) => {
    lines.push(`### 📂 Cluster: ${cluster.name}`);
    lines.push(`- **Search Intent:** ${cluster.intent}`);
    lines.push(`- **Priority:** ${cluster.priority.toUpperCase()}`);
    lines.push(`- **Rationale:** ${cluster.reason}`);
    lines.push(`- **Core Keywords:** ${cluster.keywords.join(", ")}`);
    lines.push("");
    lines.push("#### Suggested Pages:");
    cluster.suggestedPages.forEach((page) => {
      lines.push(`- **Title:** ${page.title}`);
      lines.push(`  - *Format:* ${page.format} | *Intent:* ${page.intent} | *Stage:* ${page.funnelStage}`);
      lines.push(`  - *Angle:* ${page.angle}`);
      lines.push(`  - *Why this matters:* ${page.whyThisMatters}`);
      lines.push(`  - *Suggested Outline:* ${page.suggestedOutline.join(" → ")}`);
    });
    lines.push("");
  });

  lines.push("## Content Gaps");
  lines.push("");
  if (strategy.contentGaps.length === 0) {
    lines.push("🎉 No content gaps detected based on the audit results!");
  } else {
    lines.push("| Severity | Gap Title | Dimension | Recommendation |");
    lines.push("|----------|-----------|-----------|----------------|");
    strategy.contentGaps.forEach((gap) => {
      lines.push(`| ${gap.severity.toUpperCase()} | ${gap.title} | ${gap.type} | ${gap.recommendation} |`);
    });
  }
  lines.push("");

  lines.push("## Landing Page Ideas");
  lines.push("");
  strategy.landingPageIdeas.forEach((lp, idx) => {
    lines.push(`### ${idx + 1}. ${lp.title}`);
    lines.push(`- **Target Keyword:** ${lp.targetKeyword || "N/A"}`);
    lines.push(`- **Funnel Stage:** ${lp.funnelStage} (${lp.intent})`);
    lines.push(`- **Marketing Angle:** ${lp.angle}`);
    lines.push(`- **Suggested Outline:** ${lp.suggestedOutline.join(" → ")}`);
    lines.push("");
  });

  lines.push("## Blog Ideas");
  lines.push("");
  strategy.blogIdeas.forEach((blog, idx) => {
    lines.push(`### ${idx + 1}. ${blog.title}`);
    lines.push(`- **Format:** ${blog.format} | **Target Keyword:** ${blog.targetKeyword || "N/A"}`);
    lines.push(`- **Funnel Stage:** ${blog.funnelStage} (${blog.intent})`);
    lines.push(`- **Marketing Angle:** ${blog.angle}`);
    lines.push(`- **Suggested Outline:** ${blog.suggestedOutline.join(" → ")}`);
    lines.push("");
  });

  lines.push("## FAQ Ideas");
  lines.push("");
  lines.push("| Question | Search Intent | Answer Focus Angle |");
  lines.push("|----------|---------------|-------------------|");
  strategy.faqIdeas.forEach((faq) => {
    lines.push(`| ${faq.question} | ${faq.intent} | ${faq.answerAngle} |`);
  });
  lines.push("");

  lines.push("## Distribution Ideas");
  lines.push("");
  lines.push("| Channel | Content Type | Distribution Focus Angle | Strategic Reason |");
  lines.push("|---------|--------------|--------------------------|------------------|");
  strategy.distributionIdeas.forEach((dist) => {
    lines.push(`| ${dist.channel.toUpperCase()} | ${dist.contentType} | ${dist.angle} | ${dist.reason} |`);
  });
  lines.push("");

  lines.push("## 30-Day Content Calendar");
  lines.push("");
  lines.push("| Day | Action/Title | Format | Intent | Daily Strategic Goal |");
  lines.push("|-----|--------------|--------|--------|----------------------|");
  strategy.calendar30Days.forEach((item) => {
    lines.push(`| Day ${item.day} | ${item.title} | ${item.format} | ${item.intent} | ${item.goal} |`);
  });
  lines.push("");

  lines.push("## Recommended Next Steps");
  lines.push("");
  strategy.nextSteps.forEach((step, idx) => {
    lines.push(`${idx + 1}. ${step}`);
  });
  lines.push("");

  lines.push("## Version Notice");
  lines.push("");
  lines.push(
    "This is OpenGrowth v0.4. Content strategy is generated using deterministic website intelligence, rule results, and business context. No AI or paid API is required."
  );
  lines.push("");

  return lines.join("\n");
}
