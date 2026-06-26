import type { PageData } from "../models/page-data.js";
import type { RuleResult } from "../rules/types.js";
import type { ScoreCard } from "../scoring/calculator.js";
import { extractKeywords } from "./keyword-extractor.js";
import { generateContentCalendar } from "./calendar.js";
import type {
  ContentGap,
  TopicCluster,
  ContentIdea,
  FAQIdea,
  DistributionIdea,
  ContentStrategy,
  SearchIntent,
  ContentFormat,
} from "./types.js";

/**
 * Identify content gaps from audit rule failures.
 */
export function detectContentGaps(input: {
  page: PageData;
  context?: string;
  ruleResults: RuleResult[];
  scorecard: ScoreCard;
}): ContentGap[] {
  const { ruleResults } = input;
  const gaps: ContentGap[] = [];

  ruleResults.forEach((r) => {
    if (!r.passed) {
      let gapType: ContentGap["type"] = "seo";
      if (r.category === "conversion") gapType = "conversion";
      else if (r.category === "trust") gapType = "trust";
      else if (r.category === "content") gapType = "education";
      else if (r.category === "offer") gapType = "authority";

      gaps.push({
        type: gapType,
        severity: r.severity === "critical" || r.severity === "high" ? "high" : r.severity === "medium" ? "medium" : "low",
        title: `Gap: Missing or weak ${r.title.toLowerCase()}`,
        evidence: r.description,
        recommendation: r.recommendation,
      });
    }
  });

  return gaps;
}

/**
 * Generate topic clusters based on keywords and business context.
 */
export function generateTopicClusters(input: {
  page: PageData;
  context?: string;
  keywords: { term: string; source: string; weight: number }[];
  gaps: ContentGap[];
}): TopicCluster[] {
  const { keywords } = input;

  // Extract core concepts
  const primaryTopic = keywords[0]?.term || "growth optimization";
  const secondaryTopic = keywords[1]?.term || "conversion design";
  const audience = keywords[2]?.term || "users";

  // Helper to capitalise first letter
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const t = cap(primaryTopic);
  const st = cap(secondaryTopic);
  const aud = cap(audience);

  // We will generate 6 topic clusters to cover all requirements
  const clusters: TopicCluster[] = [
    {
      name: `${t} Problem Solving`,
      intent: "informational",
      priority: "high",
      reason: `Addresses primary pain points associated with ${primaryTopic} identified in your content profile.`,
      keywords: [primaryTopic, audience],
      suggestedPages: [
        {
          title: `Why ${aud} Struggle with ${t} — and How to Fix It`,
          format: "blog",
          intent: "informational",
          priority: "high",
          funnelStage: "awareness",
          targetKeyword: `${primaryTopic} struggles`,
          angle: "Identify the critical mistakes preventing users from achieving desired results.",
          whyThisMatters: "Builds early authority by speaking directly to key user frustrations.",
          suggestedOutline: ["Introduction: The hidden cost of friction", "Top 3 reasons for failure", "Step-by-step remediation", "Conclusion"],
        },
        {
          title: `Common ${t} Mistakes to Avoid in 2026`,
          format: "blog",
          intent: "informational",
          priority: "medium",
          funnelStage: "awareness",
          targetKeyword: `${primaryTopic} mistakes`,
          angle: "A list of pitfalls that drain marketing budget and how to bypass them.",
          whyThisMatters: "Highly clickable headline that drives awareness referral traffic.",
          suggestedOutline: ["Introduction", "Pitfall 1: Poor navigation", "Pitfall 2: Vague CTA tags", "Remediation guide"],
        },
        {
          title: `How to Build a Seamless ${t} Strategy`,
          format: "guide",
          intent: "informational",
          priority: "high",
          funnelStage: "consideration",
          targetKeyword: `${primaryTopic} strategy`,
          angle: "Comprehensive blueprint for team leaders planning new digital campaigns.",
          whyThisMatters: "Captures buyers in the active research phase evaluating frameworks.",
          suggestedOutline: ["Executive Summary", "Goal alignment checklist", "Execution roadmap", "Metrics for success"],
        },
      ],
    },
    {
      name: `${t} Product & Use Cases`,
      intent: "commercial",
      priority: "high",
      reason: `Demonstrates the value proposition of ${primaryTopic} and maps it to target customer segments.`,
      keywords: [primaryTopic, secondaryTopic],
      suggestedPages: [
        {
          title: `${t} Best Practices for Growing Teams`,
          format: "blog",
          intent: "informational",
          priority: "medium",
          funnelStage: "consideration",
          targetKeyword: `${primaryTopic} best practices`,
          angle: "Actionable tips for aligning cross-functional teams around marketing benchmarks.",
          whyThisMatters: "Helps users organize their internal workflow using your approach.",
          suggestedOutline: ["Aligning expectations", "Role assignments", "Review checkpoints", "Action plan"],
        },
        {
          title: `Scaling ${t} with Automation and Tools`,
          format: "guide",
          intent: "commercial",
          priority: "high",
          funnelStage: "consideration",
          targetKeyword: `automate ${primaryTopic}`,
          angle: "How technology helps teams scale operations without increasing headcount.",
          whyThisMatters: "Attracts high-value customers looking to improve efficiency.",
          suggestedOutline: ["Introduction", "Identifying manual bottlenecks", "Choosing automation software", "Implementation playbook"],
        },
        {
          title: `How ${aud} Uses ${t} to Drive 10x ROI`,
          format: "case-study",
          intent: "trust-building",
          priority: "high",
          funnelStage: "consideration",
          targetKeyword: `${primaryTopic} case study`,
          angle: "A step-by-step case study of customer success built on verified results.",
          whyThisMatters: "Crucial proof that builds confidence and eases buyer conversion friction.",
          suggestedOutline: ["The challenge", "The solution applied", "Quantified results", "Key takeaways"],
        },
      ],
    },
    {
      name: `${t} Comparison & Alternatives`,
      intent: "comparison",
      priority: "medium",
      reason: "Targets buyers looking to compare options before completing a purchase.",
      keywords: [primaryTopic, "best"],
      suggestedPages: [
        {
          title: `Best ${t} Tools and Software in 2026`,
          format: "comparison-page",
          intent: "comparison",
          priority: "high",
          funnelStage: "consideration",
          targetKeyword: `best ${primaryTopic} software`,
          angle: "An honest breakdown comparing market leaders on features, support, and price.",
          whyThisMatters: "Captures transactional search traffic from buyers with active intent.",
          suggestedOutline: ["Market overview", "Comparison matrix", "Detailed reviews", "Recommendation summary"],
        },
        {
          title: `${t} vs Spreadsheet: Which is Better for Small Businesses?`,
          format: "comparison-page",
          intent: "comparison",
          priority: "medium",
          funnelStage: "consideration",
          targetKeyword: `${primaryTopic} vs spreadsheet`,
          angle: "Contrast manual workflows with dedicated systems to highlight productivity gains.",
          whyThisMatters: "Addresses the 'build vs buy' status quo bottleneck.",
          suggestedOutline: ["Introduction", "Spreadsheet limitations", "Platform advantages", "ROI analysis"],
        },
        {
          title: `Top 5 ${t} Alternatives to Consider`,
          format: "comparison-page",
          intent: "comparison",
          priority: "low",
          funnelStage: "consideration",
          targetKeyword: `${primaryTopic} alternatives`,
          angle: "A clean overview of alternative options for specific niche requirements.",
          whyThisMatters: "Draws search traffic targeting competitor brand terms.",
          suggestedOutline: ["Why look for alternatives?", "Option A vs Option B", "Niche alignment guide", "Verdict"],
        },
      ],
    },
    {
      name: `${t} Educational Guide`,
      intent: "informational",
      priority: "medium",
      reason: `Builds long-term search traffic and educates users on the fundamentals of ${primaryTopic}.`,
      keywords: [primaryTopic, "guide"],
      suggestedPages: [
        {
          title: `The Complete ${t} Implementation Checklist`,
          format: "checklist",
          intent: "informational",
          priority: "high",
          funnelStage: "awareness",
          targetKeyword: `${primaryTopic} checklist`,
          angle: "A downloadable, step-by-step checklist to ensure compliance with best practices.",
          whyThisMatters: "Excellent lead magnet for email lists and top-of-funnel opt-ins.",
          suggestedOutline: ["Pre-launch requirements", "Setup sequence", "Testing guidelines", "Launch review"],
        },
        {
          title: `What is ${t}? The Ultimate Beginner's Guide`,
          format: "guide",
          intent: "informational",
          priority: "medium",
          funnelStage: "awareness",
          targetKeyword: `what is ${primaryTopic}`,
          angle: "A plain-English guide deconstructing complex terminology for beginners.",
          whyThisMatters: "Builds comprehensive authority and acts as the pillar page for links.",
          suggestedOutline: ["Introduction to core concepts", "Why it matters", "Key pillars explained", "Next steps"],
        },
        {
          title: `Measuring the True ROI of ${t}`,
          format: "blog",
          intent: "commercial",
          priority: "high",
          funnelStage: "consideration",
          targetKeyword: `${primaryTopic} roi`,
          angle: "How to translate operations metrics into bottom-line business value.",
          whyThisMatters: "Helps champions justify budget approval to executive leadership.",
          suggestedOutline: ["The metrics that matter", "Calculating direct savings", "Indirect growth multipliers", "Executive dashboard template"],
        },
      ],
    },
    {
      name: `${t} Trust & Success`,
      intent: "trust-building",
      priority: "high",
      reason: "Addresses trust gaps on the page by highlighting policies, secure signals, and success records.",
      keywords: [primaryTopic, "case study"],
      suggestedPages: [
        {
          title: `Why We Built a Trust-First ${t} System`,
          format: "blog",
          intent: "trust-building",
          priority: "medium",
          funnelStage: "consideration",
          targetKeyword: `${primaryTopic} trust`,
          angle: "Our values, data security, and commitment to transparency.",
          whyThisMatters: "Addresses trust rule failures by explicitly outlining policy alignment.",
          suggestedOutline: ["Our vision", "Data handling principles", "Compliance checkpoints", "Trust roadmap"],
        },
        {
          title: `Customer Story: How ${aud} Reduced Friction by 40%`,
          format: "case-study",
          intent: "trust-building",
          priority: "high",
          funnelStage: "conversion",
          targetKeyword: `${primaryTopic} customer success`,
          angle: "Real-world implementation that resolved key checkout conversion leaks.",
          whyThisMatters: "Validates product effectiveness for high-intent visitors.",
          suggestedOutline: ["The baseline audit", "Applied changes", "Friction reduction statistics", "Testimonial"],
        },
        {
          title: `Security Checklist for ${t} Deployments`,
          format: "checklist",
          intent: "trust-building",
          priority: "high",
          funnelStage: "consideration",
          targetKeyword: `secure ${primaryTopic}`,
          angle: "HTTPS protocols, secure headers, and policy checklist to protect customer data.",
          whyThisMatters: "Assures enterprise clients that technical compliance is fully audited.",
          suggestedOutline: ["HTTPS guidelines", "Data encryption checklist", "Policy template links", "Security review"],
        },
      ],
    },
    {
      name: `${t} Conversion Optimization`,
      intent: "transactional",
      priority: "high",
      reason: `Directly drives signups and trial registrations for ${primaryTopic}.`,
      keywords: [primaryTopic, "cta"],
      suggestedPages: [
        {
          title: `How to Choose the Right ${t} Platform for Your Needs`,
          format: "guide",
          intent: "commercial",
          priority: "high",
          funnelStage: "conversion",
          targetKeyword: `choose ${primaryTopic} platform`,
          angle: "A neutral evaluation matrix to help buyers choose based on size and budget.",
          whyThisMatters: "Captures buyers ready to pick a vendor.",
          suggestedOutline: ["Key requirements checklist", "Pricing comparison", "Feature matrices", "Final decision checklist"],
        },
        {
          title: `${t} Pricing, Plans, and Integration Steps`,
          format: "guide",
          intent: "transactional",
          priority: "high",
          funnelStage: "conversion",
          targetKeyword: `${primaryTopic} pricing`,
          angle: "A transparent breakdown of pricing options, trial duration, and installation steps.",
          whyThisMatters: "Minimizes decision friction for high-intent traffic.",
          suggestedOutline: ["Pricing tiers compared", "Trial activation steps", "API & dashboard integrations", "FAQ"],
        },
        {
          title: `Get Started with ${t} — Free Trial Sign-up`,
          format: "landing-page",
          intent: "transactional",
          priority: "high",
          funnelStage: "conversion",
          targetKeyword: `free trial ${primaryTopic}`,
          angle: "High-converting landing page optimized with action verbs, low form friction, and clear value prop.",
          whyThisMatters: "The primary destination for paid ads and organic search traffic.",
          suggestedOutline: ["Headline (H1)", "Lead Form (<= 3 inputs)", "Features summary", "Testimonials"],
        },
      ],
    },
  ];

  return clusters;
}

/**
 * Generate a complete, deterministic Content Strategy.
 */
export function generateContentStrategy(input: {
  page: PageData;
  context?: string;
  ruleResults: RuleResult[];
  scorecard: ScoreCard;
}): ContentStrategy {
  const { page, context = "", ruleResults, scorecard } = input;

  // 1. Extract Keywords
  const keywords = extractKeywords({ page, context });

  // 2. Detect Gaps
  const gaps = detectContentGaps({ page, context, ruleResults, scorecard });

  // 3. Generate Topic Clusters
  const clusters = generateTopicClusters({ page, context, keywords, gaps });

  // 4. Assemble ideas arrays
  const landingPageIdeas: ContentIdea[] = [];
  const blogIdeas: ContentIdea[] = [];
  const faqIdeas: FAQIdea[] = [];
  const distributionIdeas: DistributionIdea[] = [];

  // Extract from clusters
  clusters.forEach((cluster) => {
    cluster.suggestedPages.forEach((pageIdea) => {
      if (pageIdea.format === "landing-page") {
        landingPageIdeas.push(pageIdea);
      } else {
        blogIdeas.push(pageIdea);
      }
    });
  });

  // Ensure we have at least 5 landing page ideas
  const topic = keywords[0]?.term || "growth";
  const capTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  const primaryTopic = capTopic;

  while (landingPageIdeas.length < 5) {
    const id = landingPageIdeas.length + 1;
    landingPageIdeas.push({
      title: `${capTopic} Solution for Enterprise Clients (LP ${id})`,
      format: "landing-page",
      intent: "transactional",
      priority: "high",
      funnelStage: "conversion",
      targetKeyword: `enterprise ${topic}`,
      angle: `A conversion-focused landing page targeting enterprise teams looking for ${topic} scaling.`,
      whyThisMatters: "Captures high-value search intent.",
      suggestedOutline: ["Value prop", "Enterprise features", "Security parameters", "Demo CTA Form"],
    });
  }

  // Ensure we have at least 10 blog ideas
  while (blogIdeas.length < 10) {
    const id = blogIdeas.length + 1;
    blogIdeas.push({
      title: `The Future of ${capTopic} in digital marketing (Part ${id})`,
      format: "blog",
      intent: "informational",
      priority: "medium",
      funnelStage: "awareness",
      targetKeyword: `future of ${topic}`,
      angle: `Analyzing trends shaping the ${topic} industry.`,
      whyThisMatters: "Drives top-of-funnel thought leadership.",
      suggestedOutline: ["Introduction", "Current trends", "Predictions for next year", "Conclusion"],
    });
  }

  // Generate 10 FAQ ideas
  const faqTemplates = [
    `What is ${capTopic}?`,
    `How does ${capTopic} improve conversion rates?`,
    `Is ${capTopic} compliant with privacy policies?`,
    `What are the best tools for ${capTopic}?`,
    `How much does a ${capTopic} setup cost?`,
    `Can I run ${capTopic} on a static website?`,
    `What is the difference between ${capTopic} and traditional marketing?`,
    `How do we measure the success of ${capTopic}?`,
    `How many form fields should a ${capTopic} landing page have?`,
    `Does ${capTopic} require an HTTPS connection?`,
  ];

  faqTemplates.forEach((q, idx) => {
    faqIdeas.push({
      question: q,
      intent: idx === 2 || idx === 9 ? "trust-building" : idx === 4 ? "commercial" : "informational",
      answerAngle: `Address this question directly on the page. Highlight how your platform resolves this issue with zero friction.`,
    });
  });

  // Generate 8 distribution ideas
  const distributionChannels: DistributionIdea["channel"][] = [
    "linkedin", "x", "reddit", "email", "blog", "youtube", "short-video", "community"
  ];
  distributionChannels.forEach((channel) => {
    let contentType = "Social Post";
    let angle = `Share the key findings from the ${capTopic} audit.`;
    let reason = `Target professional audiences interested in scaling operations.`;

    if (channel === "reddit") {
      contentType = "Community Discussion";
      angle = `Ask the community how they solve ${topic} bottlenecks.`;
      reason = "Uncovers genuine audience objections and builds organic backlinks.";
    } else if (channel === "email") {
      contentType = "Newsletter Campaign";
      angle = "Provide a 5-step checklist based on our content roadmap.";
      reason = "Directly nurtures lead-capture subscribers towards trial activation.";
    } else if (channel === "youtube") {
      contentType = "Video Tutorial";
      angle = `Walkthrough on implementing ${topic} from scratch.`;
      reason = "Visual proof drives significant informational search traffic.";
    } else if (channel === "short-video") {
      contentType = "Quick Tips Reels";
      angle = `3 tips to optimize your ${topic} layout.`;
      reason = "Engages mobile users on TikTok and YouTube Shorts.";
    }

    distributionIdeas.push({
      channel,
      contentType,
      angle,
      reason,
    });
  });

  // 5. Generate 30-Day Content Calendar
  const calendar30Days = generateContentCalendar({
    clusters,
    blogIdeas,
    landingPageIdeas,
    faqIdeas,
    gaps,
  });

  // 6. Summary and Next Steps
  const overallScore = scorecard.overall;
  let summary = `We audited ${page.url} and calculated a Growth Score of ${overallScore}/100. `;
  if (gaps.length > 0) {
    const mainGap = gaps[0];
    summary += `The biggest growth opportunity is to address "${mainGap.title}" (${mainGap.severity} severity). `;
  }
  summary += `We recommend establishing content authority on "${primaryTopic}" to drive search traffic and conversions.`;

  const nextSteps = [
    "Fix critical conversion and trust gaps (e.g. secure connection, clear policy links).",
    `Launch the primary landing page: "${landingPageIdeas[0]?.title || "Lead Capture"}".`,
    `Publish Week 1 awareness blogs to build foundational index authority for "${primaryTopic}".`,
    "Add structured FAQ elements on-page using the 10 suggested FAQ templates.",
    "Repurpose published guides into LinkedIn/X distribution threads as outlined in Week 4.",
    "Audit page performance and link loops after 30 days of calendar execution.",
  ];

  return {
    generatedAt: new Date().toISOString(),
    url: page.url,
    context,
    summary,
    extractedKeywords: keywords.map((k) => ({ term: k.term, source: k.source, weight: k.weight })),
    topicClusters: clusters,
    contentGaps: gaps,
    landingPageIdeas,
    blogIdeas,
    faqIdeas,
    distributionIdeas,
    calendar30Days,
    nextSteps,
  };
}
