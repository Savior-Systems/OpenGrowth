import type { PageData } from "../models/page-data.js";
import type { RuleResult } from "../rules/types.js";
import type { ScoreCard } from "../scoring/calculator.js";
import type { ContentStrategy } from "../strategy/types.js";
import { extractAdInputs } from "./angle-extractor.js";
import { generateAdCopyVariants } from "./copy-generator.js";
import { generateCreativeDirections } from "./creative-direction.js";
import type {
  AdStrategy,
  AdHook,
  AudienceSegment,
  ValueProposition,
  CarouselConcept,
  ShortVideoConcept,
  AdInputData,
} from "./types.js";

/**
 * Capitalizes the first letter of a string.
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates at least 5 customized audience segments.
 */
export function generateAudienceSegments(input: AdInputData): AudienceSegment[] {
  const topic = input.primaryTopic;
  const capTopic = capitalize(topic);
  const problem = input.problemTerms[0] || "unclear prioritization";
  const outcome = input.outcomeTerms[0] || "accelerate growth";

  return [
    {
      name: "Founder / Operator",
      stage: "awareness",
      painPoint: `Overwhelmed with manual tasks and lacks clear direction to optimize ${topic}.`,
      desiredOutcome: `Gain absolute clarity on growth bottlenecks and automate their ${topic} playbook.`,
      messageFocus: `Show the contrast between manual chaos and a clear, structured ${topic} audit.`,
      suggestedPlatforms: ["linkedin", "x", "facebook"],
    },
    {
      name: "Marketing Team / Growth Manager",
      stage: "consideration",
      painPoint: `Struggling to scale traffic and hit conversion targets due to ${problem}.`,
      desiredOutcome: `Deploy a deterministic system to boost conversion rates and drive ${outcome}.`,
      messageFocus: `Focus on evidence-based checklists, data structure, and page audit optimizations.`,
      suggestedPlatforms: ["linkedin", "facebook", "instagram"],
    },
    {
      name: "Agencies & Consultants",
      stage: "conversion",
      painPoint: `Spending too much time manually analyzing client sites and compiling audit reports.`,
      desiredOutcome: `Instantly generate white-label growth scorecards, content maps, and ad copy plans.`,
      messageFocus: `Emphasize time savings, standard workflows, and professional growth deliverables.`,
      suggestedPlatforms: ["linkedin", "email" as any], // Cast email since it fits standard campaigns
    },
    {
      name: "Developer-Founder",
      stage: "awareness",
      painPoint: `Great at building features but struggles with marketing hooks and conversion pathways.`,
      desiredOutcome: `Use a rule-based, Lighthouse-like tool for growth, content, and trust indicators.`,
      messageFocus: `Speak directly in code/developer terms, emphasizing transparent rules and zero-AI templates.`,
      suggestedPlatforms: ["x", "reddit", "linkedin"],
    },
    {
      name: "Corporate Decision-Maker / Enterprise Buyer",
      stage: "conversion",
      painPoint: `Requires rigorous compliance, enterprise-grade trust signals, and proven performance proof.`,
      desiredOutcome: `Audit the public face of their platform to ensure full SEO and trust compliance.`,
      messageFocus: `Focus on security rules, HTTPS, strict privacy policy checks, and risk mitigation.`,
      suggestedPlatforms: ["linkedin", "google-search"],
    },
  ];
}

/**
 * Generates at least 5 value propositions based on inputs.
 */
export function generateValuePropositions(input: AdInputData): ValueProposition[] {
  const topic = input.primaryTopic;
  const capTopic = capitalize(topic);
  const weakArea = input.weakAreas[0] || "Growth bottlenecks";

  return [
    {
      title: "Clarity & Instant Diagnosis",
      description: `Locate conversion leaks, trust gaps, and SEO vulnerabilities on your page in under 3 seconds.`,
      evidence: `Identified weak categories: ${input.weakAreas.join(", ")}.`,
      strength: "high",
    },
    {
      title: "Time-Saving Automation",
      description: `Turn a single crawled URL into a fully-structured 30-day content calendar and distribution plan.`,
      evidence: `Extracted topic terms like: ${input.outcomeTerms.join(", ")}.`,
      strength: "high",
    },
    {
      title: "Trust & Compliance Safeguards",
      description: `Audit essential trust indicators like SSL, privacy policies, and contact information before scaling ad spend.`,
      evidence: `Audited trust and technical security checks.`,
      strength: "medium",
    },
    {
      title: "Deterministic, Local Architecture",
      description: `Operates completely locally with no paid API keys, no external calls, and 100% transparent rules.`,
      evidence: `No OpenAI, Gemini, or external network dependencies.`,
      strength: "high",
    },
    {
      title: "Frictionless Conversion Optimization",
      description: `Analyze heading structure, forms, and CTA verbs to reduce user fatigue and bounce rates.`,
      evidence: `Weak area flagged: ${weakArea}.`,
      strength: "medium",
    },
  ];
}

/**
 * Generates at least 20 hooks across different ad angle families.
 */
export function generateHooks(input: AdInputData): AdHook[] {
  const topic = input.primaryTopic;
  const capTopic = capitalize(topic);
  const problem = input.problemTerms[0] || "manual setup";
  const outcome = input.outcomeTerms[0] || "improve conversion";
  const audience = input.audienceTerms[0] || "growth teams";
  const weakArea = input.weakAreas[0] || "conversion leaks";

  return [
    // Pain-Point (4)
    {
      text: `Your website is not the problem. Your ${topic} system is missing.`,
      family: "pain-point",
      platformFit: ["facebook", "instagram", "linkedin"],
      reason: "Reframes the problem from a vague site issue to a missing specific system.",
    },
    {
      text: `Still doing ${topic} manually? Here is the developer way.`,
      family: "pain-point",
      platformFit: ["x", "reddit", "linkedin"],
      reason: "Appeals directly to builders and developers who hate manual tasks.",
    },
    {
      text: `Before you spend another dollar on ads, fix these ${weakArea} issues.`,
      family: "pain-point",
      platformFit: ["facebook", "instagram", "linkedin", "x"],
      reason: "Creates immediate financial urgency to stop losing ad budget.",
    },
    {
      text: `Is your landing page leaking trust before users even read your CTA?`,
      family: "pain-point",
      platformFit: ["linkedin", "reddit"],
      reason: "Raises anxiety about hidden conversion friction.",
    },
    // Transformation (4)
    {
      text: `Turn one simple website crawl into a 30-day growth roadmap.`,
      family: "transformation",
      platformFit: ["facebook", "instagram", "linkedin"],
      reason: "Promises immediate tangible value from a single action.",
    },
    {
      text: `How to go from zero content calendar to a complete topic cluster in seconds.`,
      family: "transformation",
      platformFit: ["linkedin", "x"],
      reason: "Appeals to marketing managers looking to streamline work.",
    },
    {
      text: `Upgrade your ${topic} from static text to a conversion engine.`,
      family: "transformation",
      platformFit: ["facebook", "instagram"],
      reason: "Clear benefit-driven hook for product owners.",
    },
    {
      text: `Shift from guessing what to write to executing a data-driven strategy.`,
      family: "transformation",
      platformFit: ["linkedin", "x"],
      reason: "Highlights structural clarity over guesswork.",
    },
    // Proof & Urgency (4)
    {
      text: `The 26-rule growth audit checklist the top SaaS startups use.`,
      family: "proof",
      platformFit: ["linkedin", "x"],
      reason: "Curiosity-driven hook implying industry standards.",
    },
    {
      text: `Don't scale your ad budget if your site is missing a privacy policy.`,
      family: "urgency",
      platformFit: ["facebook", "instagram"],
      reason: "Highlights compliance risk that suspends ad accounts.",
    },
    {
      text: `Are your CTAs using active verbs? Most pages fail this simple check.`,
      family: "education",
      platformFit: ["linkedin", "reddit"],
      reason: "Educational hook that prompts users to check their own sites.",
    },
    {
      text: `Stop ignoring the Trust Score of your website.`,
      family: "urgency",
      platformFit: ["facebook", "linkedin", "x"],
      reason: "Highlights a score that decision-makers care about.",
    },
    // Comparison & Objection-handling (4)
    {
      text: `${capTopic} vs Spreadsheets: Why your team is losing momentum.`,
      family: "comparison",
      platformFit: ["linkedin", "x", "reddit"],
      reason: "Compares the tool against the most common manual alternative.",
    },
    {
      text: `You don't need a costly agency to audit your ${capTopic}.`,
      family: "objection-handling",
      platformFit: ["facebook", "linkedin"],
      reason: "Addresses the cost objection upfront.",
    },
    {
      text: `Deterministic code wins over black-box AI generators.`,
      family: "objection-handling",
      platformFit: ["x", "reddit"],
      reason: "Appeals to developers tired of generic AI outputs.",
    },
    {
      text: `No paid APIs. No external calls. 100% local growth audit.`,
      family: "offer",
      platformFit: ["reddit", "x", "linkedin"],
      reason: "Emphasizes the privacy and zero cost of local execution.",
    },
    // Founder / Use-Case (4)
    {
      text: `I built a tool to diagnose website growth in seconds. Here is why.`,
      family: "founder-story",
      platformFit: ["linkedin", "x"],
      reason: "Personal storytelling hook that drives engagement.",
    },
    {
      text: `The exact layout checklist we use to test SaaS landing pages.`,
      family: "use-case",
      platformFit: ["linkedin", "facebook"],
      reason: "Positions the tool as an expert workflow resource.",
    },
    {
      text: `How ${audience} scale their traffic without hiring writers.`,
      family: "use-case",
      platformFit: ["linkedin", "facebook", "instagram"],
      reason: "Leverages peer comparison to drive interest.",
    },
    {
      text: `Need to ${outcome}? Start with your page headings first.`,
      family: "education",
      platformFit: ["linkedin", "x"],
      reason: "Simple, tactical, immediate actionable advice.",
    },
  ];
}

/**
 * Generates at least 8 short video/reel concepts.
 */
export function generateShortVideoConcepts(input: AdInputData): ShortVideoConcept[] {
  const topic = input.primaryTopic;
  const problem = input.problemTerms[0] || "unclear growth prioritisation";
  const weakArea = input.weakAreas[0] || "trust signals";

  return [
    {
      title: "Website Trust Leak Check",
      hook: "Before you spend $1 on ads, check if your page has this...",
      structure: [
        "Hook: Show a screen recording of an ad manager budget scaling up.",
        "Problem: Point to a page missing HTTPS or clear policy links.",
        "Audit: Run OpenGrowth and highlight the Trust Score falling to 20.",
        "Fix: Add simple compliance links and show score rising.",
        "CTA: Link to download OpenGrowth CLI to run a local trust audit.",
      ],
      visualDirection: "Split screen: top is founder talking, bottom is terminal running audit command.",
      captionIdea: `Don't let missing trust elements suspend your ad accounts. Run a local audit first.`,
      cta: "Get OpenGrowth CLI",
      platformFit: ["tiktok", "instagram", "youtube-shorts"],
    },
    {
      title: "SaaS SEO Heading Fix",
      hook: "Why your H1 headings are killing your search rank.",
      structure: [
        "Hook: Zoom in on a SaaS landing page with 'Welcome to our site' H1.",
        "Explain: Search engines need keyword structure, not generic greetings.",
        "Analyze: Show OpenGrowth flagging Heading Hierarchy and SEO density.",
        "Solve: Replace with target keyword phrase H1.",
        "CTA: Crawl your landing page locally today.",
      ],
      visualDirection: "Fast-paced screen record with neon markup highlighting text edits.",
      captionIdea: `Is your H1 optimized for humans and robots? Let's check.`,
      cta: "Test Your URL",
      platformFit: ["instagram", "youtube-shorts", "linkedin"],
    },
    {
      title: "Content Calendar in 3 Seconds",
      hook: "How to generate a 30-day content calendar in 3 seconds.",
      structure: [
        "Hook: Typing a command into terminal.",
        "Show: The generator outputting content-strategy.json and content-strategy.md.",
        "Explain: It parses your website and creates topic clusters locally.",
        "CTA: Run `opengrowth audit` on your site.",
      ],
      visualDirection: "Up-close keyboard typing, transitioning to terminal output scroll.",
      captionIdea: `Zero AI. Zero API costs. A complete content roadmap built entirely locally.`,
      cta: "Try OpenGrowth",
      platformFit: ["tiktok", "youtube-shorts", "x"],
    },
    {
      title: "The CTA Active Verb Check",
      hook: "Most landing page CTAs fail this simple test.",
      structure: [
        "Hook: Screenshot of 'Submit' and 'Click Here' buttons.",
        "Explain: Why passive buttons kill conversion rates.",
        "Show: Running OpenGrowth audit highlighting failed CTA Rule.",
        "Solution: Change CTA to active phrase ('Get Started', 'Start Free Trial').",
        "CTA: Audit your page elements locally.",
      ],
      visualDirection: "Bright red circles drawn on passive buttons, switching to green for active.",
      captionIdea: `Passive CTAs cost conversions. Update yours today using our rule check.`,
      cta: "Analyze Your Site",
      platformFit: ["instagram", "linkedin"],
    },
    {
      title: "The Slow Growth Scorecard",
      hook: "Why your growth scorecard is lower than you think.",
      structure: [
        "Hook: Show a developer reacting to a 34/100 score.",
        "Breakdown: Explain category breakdown: SEO, Content, Conversion, Trust.",
        "Explain: Failed rules accumulate and reveal growth bottlenecks.",
        "CTA: Get your free growth audit scorecard.",
      ],
      visualDirection: "Real person talking, overlaying the CLI score card table on screen.",
      captionIdea: `Lighthouse for growth. Get your score in seconds.`,
      cta: "Run Audit",
      platformFit: ["youtube-shorts", "tiktok"],
    },
    {
      title: "Local vs API Generation",
      hook: "Stop paying for OpenAI keys to generate your marketing calendar.",
      structure: [
        "Hook: Cross out OpenAI API subscription bill.",
        "Explain: Rules and heuristics are faster, free, and deterministic.",
        "Show: OpenGrowth content strategy generator creating ideas instantly.",
        "CTA: Run the tool offline.",
      ],
      visualDirection: "Juxtaposition of loading spinner on web browser vs instantaneous CLI output.",
      captionIdea: `No keys, no latency, no cost. Run your audits offline.`,
      cta: "Install CLI",
      platformFit: ["x", "tiktok", "youtube-shorts"],
    },
    {
      title: "SaaS Content Gaps Revealed",
      hook: "Finding the hidden content gaps on your product page.",
      structure: [
        "Hook: Show blank scroll areas of a landing page.",
        "Explain: Missing authority signals means lost rankings and low trust.",
        "Show: OpenGrowth Content Gaps table output.",
        "CTA: Uncover your page content gaps.",
      ],
      visualDirection: "Crawl down a webpage with highlight indicators pointing to empty sections.",
      captionIdea: `What is your website missing? Find out with a local content gap audit.`,
      cta: "Crawl Page",
      platformFit: ["linkedin", "instagram"],
    },
    {
      title: "Ad Readiness Verification",
      hook: "Are you ready to run ads? Let's check this scorecard.",
      structure: [
        "Hook: Show an ad account dashboard.",
        "Explain: Running ads to a leaking funnel is burning cash.",
        "Show: OpenGrowth scorecard showing Ad Readiness category score.",
        "CTA: Fix your landing page leaks before scaling.",
      ],
      visualDirection: "Close-up of ad spend numbers, changing to local report markdown layout.",
      captionIdea: `Fix your landing page leaks first. Check your Ad Readiness score today.`,
      cta: "Verify Ad Readiness",
      platformFit: ["linkedin", "facebook"],
    },
  ];
}

/**
 * Generates at least 5 carousel concepts.
 */
export function generateCarouselConcepts(input: AdInputData): CarouselConcept[] {
  const topic = input.primaryTopic;
  const capTopic = capitalize(topic);
  const weakArea = input.weakAreas[0] || "conversion leaks";

  return [
    {
      title: "5 Landing Page Mistakes Killing Your Conversion Rate",
      slides: [
        { slide: 1, headline: "Stop Guessing", body: `Why most SaaS landing pages leak conversions, and how to fix them.`, visualDirection: "Bold text: 'Mistakes checklist' with warning icon." },
        { slide: 2, headline: "1. Passive CTAs", body: `Using 'Submit' or 'Click Here' fatigue users. Use action-driven active verbs.`, visualDirection: "Comparison of bad vs good button labels." },
        { slide: 3, headline: "2. Missing Trust Signals", body: `No privacy policy link or unsecure connections raise immediate buyer friction.`, visualDirection: "Mock browser showing padlock icon and footer links." },
        { slide: 4, headline: "3. Thin Content Depth", body: `Pages with less than 250 words struggle to rank or build domain authority.`, visualDirection: "Infographic demonstrating text volume indicators." },
        { slide: 5, headline: "4. Poor Heading Structure", body: `Missing H1 or scattered H2 tags confuse search engines and readers.`, visualDirection: "Highlighted HTML heading tags layout." },
        { slide: 6, headline: "Get Your Scorecard", body: `Crawl your page locally and locate all leaks in seconds using OpenGrowth.`, visualDirection: "Scorecard CLI table preview." },
      ],
      cta: "Download CLI",
      platformFit: ["linkedin", "instagram", "facebook"],
    },
    {
      title: "How to Build a Content Strategy in 3 Steps",
      slides: [
        { slide: 1, headline: "Content Map in Seconds", body: `Generate topic clusters and a 30-day calendar locally, for free.`, visualDirection: "Clean graphic showing interconnected content blocks." },
        { slide: 2, headline: "Step 1: Extract Keywords", body: `OpenGrowth parses Title, Headings, and Context to define primary semantic keywords.`, visualDirection: "Term list sorted by weight indicators." },
        { slide: 3, headline: "Step 2: Detect Gaps", body: `Maps audit rule failures directly to SEO, conversion, and authority gaps.`, visualDirection: "Table of gaps with severity tags." },
        { slide: 4, headline: "Step 3: Calendar Distribution", body: `Structures a 30-day sequence from awareness, authority, trust, to social distribution.`, visualDirection: "Calendar calendar view showing Days 1 to 30." },
        { slide: 5, headline: "Start Executing", body: `Run a local audit and get your Markdown exports instantly.`, visualDirection: "strategy markdown file screenshot." },
      ],
      cta: "Run Audit",
      platformFit: ["linkedin", "instagram"],
    },
    {
      title: "Is Your Landing Page Ad-Ready?",
      slides: [
        { slide: 1, headline: "Before You Scale Ads", body: `Verify your site's conversion and trust parameters to maximize ad ROI.`, visualDirection: "Chart showing ad cost vs conversion rate." },
        { slide: 2, headline: "The Ad-Readiness Audit", body: `OpenGrowth runs 26 core rules checking technical, SEO, offer, and conversion metrics.`, visualDirection: "Checkbox list showing audit rules." },
        { slide: 3, headline: "Fixing Critical Gaps First", body: `Prioritize resolving trust leaks and technical issues before buying traffic.`, visualDirection: "Scorecard categories breakdown visual." },
        { slide: 4, headline: "Get The Generator", body: `Unlock deterministic hooks, audience segments, and copy variations instantly.`, visualDirection: "Ad copy layout previews." },
        { slide: 5, headline: "Launch With Confidence", body: `Ensure your messaging matches user expectations and has zero trust hurdles.`, visualDirection: "Checklist with passed trust badges." },
      ],
      cta: "Audit Landing Page",
      platformFit: ["linkedin", "facebook"],
    },
    {
      title: "Spreadsheet vs Local Audit Tool",
      slides: [
        { slide: 1, headline: "Still Auditing Manually?", body: `Why spreadsheets cost you hours of manual reporting.`, visualDirection: "Messy spreadsheet sheet mockup with red X." },
        { slide: 2, headline: "Instant Crawl", body: `Crawl page elements, headings, CTAs, and metadata in under 1 second.`, visualDirection: "CLI crawler terminal execution animation." },
        { slide: 3, headline: "Deterministic Scoring", body: `Consistent rules calculate category scores out of 100 with zero guesswork.`, visualDirection: "Gauge charts showing categories." },
        { slide: 4, headline: "Local and Private", body: `No data shared, no API key required, runs offline in your terminal.`, visualDirection: "Secure terminal logo." },
        { slide: 5, headline: "Automated Strategy", body: `Get a 30-day calendar and ad copy variants instantly with a single command.`, visualDirection: "Strategy report file mock." },
      ],
      cta: "Install OpenGrowth",
      platformFit: ["linkedin", "x"],
    },
    {
      title: "The SaaS Growth Audit Checklist",
      slides: [
        { slide: 1, headline: "The 26-Point Growth Checklist", body: `Lighthouse for marketing, conversion, and trust compliance.`, visualDirection: "Premium list illustration." },
        { slide: 2, headline: "SEO and Headings check", body: `Ensuring heading hierarchy is consistent and tags are optimized.`, visualDirection: "Checklist: H1 Presence, H2 Structure." },
        { slide: 3, headline: "Conversion checks", body: `Checking for direct CTA paths and form field complexity parameters.`, visualDirection: "Checklist: CTA Presence, Active Verbs." },
        { slide: 4, headline: "Trust check", body: `Verifying HTTPS, policy links, and customer proof placements.`, visualDirection: "Checklist: Secure SSL, Policy presence." },
        { slide: 5, headline: "Run Your Free Audit", body: `Audit any URL from your terminal. Get scoring and strategy templates.`, visualDirection: "CLI complete screenshot." },
      ],
      cta: "Get Scorecard",
      platformFit: ["linkedin", "instagram", "facebook"],
    },
  ];
}

/**
 * Main Ad Strategy Orchestrator.
 */
export function generateAdStrategy(input: {
  page: PageData;
  context?: string;
  scorecard: ScoreCard;
  ruleResults: RuleResult[];
  contentStrategy: ContentStrategy;
}): AdStrategy {
  const { page, context = "", scorecard, ruleResults, contentStrategy } = input;

  // 1. Extract inputs
  const adInputs = extractAdInputs({ page, context, scorecard, ruleResults, contentStrategy });

  // 2. Generate Audiences
  const audienceSegments = generateAudienceSegments(adInputs);

  // 3. Generate Value Props
  const valuePropositions = generateValuePropositions(adInputs);

  // 4. Generate Hooks
  const hooks = generateHooks(adInputs);

  // 5. Generate Copy Variants
  const adCopyVariants = generateAdCopyVariants({ adInputs, audiences: audienceSegments, hooks, valueProps: valuePropositions });

  // 6. Generate Short Videos
  const shortVideoConcepts = generateShortVideoConcepts(adInputs);

  // 7. Generate Carousels
  const carouselConcepts = generateCarouselConcepts(adInputs);

  // 8. Generate Creative Directions
  const creativeDirections = generateCreativeDirections(adInputs);

  // 9. Summary and Next Steps
  const weakArea = adInputs.weakAreas[0] || "conversion leaks";
  const primaryTopic = adInputs.primaryTopic;
  const bestAudience = audienceSegments[0].name;
  const strongestAngle = hooks[0].text;

  const summary = `Based on our audit of ${page.url}, we suggest targeting the "${bestAudience}" audience focusing on "${primaryTopic}" solutions. The strongest initial ad hook is "${strongestAngle}". The biggest ad-readiness bottleneck is "${weakArea}", which should be optimized before scaling paid traffic.`;

  const nextSteps = [
    `Fix critical trust and conversion leaks in "${weakArea}" before starting ad campaigns.`,
    `Set up initial test campaigns targeting the "${bestAudience}" audience.`,
    `A/B test at least 3-5 different hook families (e.g. pain-point, transformation, comparison).`,
    `Launch at least one short video concept (e.g., "${shortVideoConcepts[0].title}") to test TikTok/Reels placement.`,
    `Implement a retargeting carousel campaign showing proof elements and a mistakes checklist.`,
    "Manually monitor campaign cost-per-click (CPC) and click-through-rates (CTR) to determine winning creative direction.",
  ];

  return {
    generatedAt: new Date().toISOString(),
    url: page.url,
    context,
    summary,
    audienceSegments,
    valuePropositions,
    hooks,
    adCopyVariants,
    shortVideoConcepts,
    carouselConcepts,
    creativeDirections,
    nextSteps,
  };
}
