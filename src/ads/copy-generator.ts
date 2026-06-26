import type { AdCopyVariant, AdInputData, AudienceSegment, AdHook, ValueProposition } from "./types.js";


/**
 * Generates at least 24 deterministic ad copy variants across Facebook/Instagram,
 * LinkedIn, Google Search, Reddit/X, short-video, and retargeting/conversion categories.
 */
export function generateAdCopyVariants(input: {
  adInputs: AdInputData;
  audiences: AudienceSegment[];
  hooks: AdHook[];
  valueProps: ValueProposition[];
}): AdCopyVariant[] {
  const { adInputs } = input;
  const topic = adInputs.primaryTopic;

  const variants: AdCopyVariant[] = [];

  // 1. Facebook/Instagram (4 variants)
  variants.push({
    platform: "facebook",
    family: "pain-point",
    stage: "awareness",
    primaryText: `Before you double your ad budget, look closely at your page. If it is missing key trust signals or has bad heading layouts, you are losing leads. OpenGrowth runs 26 local rules to audit your ${topic} funnel in seconds. Fix the leaks first.`,
    headline: `Stop Burning Ad Budget on Leaking Funnels`,
    description: `Locate conversion leaks and fix them today.`,
    cta: "Start Free Audit",
    creativeNote: "Split visual showing manual checklist on one side and clean audit scorecard on the other.",
  });
  variants.push({
    platform: "instagram",
    family: "transformation",
    stage: "consideration",
    primaryText: `Guessing what to publish next is exhausting. Switch to a data-driven strategy. OpenGrowth crawls your landing page and generates a complete 30-day content calendar and distribution plan in seconds. Free, local, and private.`,
    headline: `Your 30-Day Content Roadmap is Ready`,
    description: `Automate your content planning.`,
    cta: "Get My Calendar",
    creativeNote: "Carousel showing slide previews of content strategy calendar days 1 to 30.",
  });
  variants.push({
    platform: "facebook",
    family: "proof",
    stage: "conversion",
    primaryText: `Join SaaS founders and operators who use OpenGrowth to diagnose their website conversion hurdles. Get category scores out of 100 for SEO, Content, and Trust. No account signup or API keys needed. Run it offline in your terminal.`,
    headline: `The Lighthouse for Website Growth`,
    description: `Get your categorical growth scorecard.`,
    cta: "Run Local Audit",
    creativeNote: "Image of a terminal showing overall score 76/100 and detailed categories.",
  });
  variants.push({
    platform: "instagram",
    family: "use-case",
    stage: "consideration",
    primaryText: `Are your CTAs using active verbs? Most pages fail this simple check. Crawl your page layout with OpenGrowth to identify weak headings, passive links, and form friction issues automatically.`,
    headline: `How Optimized is Your Page?`,
    description: `Find out in under 3 seconds.`,
    cta: "Verify Page Score",
    creativeNote: "Short video screenshot highlighting red and green borders around button copy.",
  });

  // 2. LinkedIn (4 variants)
  variants.push({
    platform: "linkedin",
    family: "pain-point",
    stage: "awareness",
    primaryText: `Marketing teams are losing pipeline due to simple landing page vulnerabilities—missing canonical URLs, unoptimized heading hierarchies, and passive call-to-actions. OpenGrowth executes 26 compliance audits locally, helping you optimize ${topic} metrics without expensive agencies.`,
    headline: `Diagnose B2B Conversion Bottlenecks Instantly`,
    description: `Evaluate your website conversion readiness.`,
    cta: "Request Demo",
    creativeNote: "Minimalist graphic showing audit score comparisons across common industries.",
  });
  variants.push({
    platform: "linkedin",
    family: "comparison",
    stage: "consideration",
    primaryText: `Spreadsheets are slow. Standard marketing templates are generic. OpenGrowth provides a local, command-line alternative that analyzes your live URL alongside business context to output tailored topic clusters and distribution plans.`,
    headline: `Spreadsheets vs Automated Audits`,
    description: `Automate your SEO and content planning.`,
    cta: "Learn More",
    creativeNote: "Side-by-side comparison diagram showing manual vs automated workflow speeds.",
  });
  variants.push({
    platform: "linkedin",
    family: "proof",
    stage: "conversion",
    primaryText: `Verify your site's trust indicators before launching paid traffic. OpenGrowth checks HTTPS status, privacy policies, contact paths, and social proof elements to calculate an Ad Readiness score. Download the CLI and scan your domain.`,
    headline: `Optimize B2B Ad Readiness Scores`,
    description: `Free, open-source Growth Operating System.`,
    cta: "Download CLI",
    creativeNote: "Detailed screenshot of the report.md checklist sections.",
  });
  variants.push({
    platform: "linkedin",
    family: "objection-handling",
    stage: "conversion",
    primaryText: `You don't need a high budget or third-party cloud tools to audit your website. OpenGrowth runs entirely locally, protecting your company's data privacy with zero external API calls or AI latency.`,
    headline: `100% Local. Zero API Costs. Complete Privacy.`,
    description: `No signups or paid key subscription required.`,
    cta: "Get Started",
    creativeNote: "Graphic showing local directory execution and security compliance lock.",
  });

  // 3. Google Search (4 variants)
  // Strict rule: concise headlines (< 30 chars) and descriptions (< 90 chars).
  variants.push({
    platform: "google-search",
    family: "offer",
    stage: "conversion",
    primaryText: `Free Website Growth Audit. Score conversion, content & SEO. Run locally. No API needed.`,
    headline: `Free Website Growth Audit`,
    description: `Get scorecard, content gaps & 30-day calendar. Run offline.`,
    cta: "Apply Now",
    creativeNote: "Text-only search ad optimized for high conversion intent.",
  });
  variants.push({
    platform: "google-search",
    family: "pain-point",
    stage: "consideration",
    primaryText: `Fix Conversion Leaks. Check your page structure, forms, and trust signals in seconds.`,
    headline: `Fix Website Conversion Leaks`,
    description: `Identify trust gaps & SEO bottlenecks. Get prioritised next steps.`,
    cta: "Learn More",
    creativeNote: "Text search ad targeting terms: website leaks, conversion friction.",
  });
  variants.push({
    platform: "google-search",
    family: "use-case",
    stage: "consideration",
    primaryText: `Create Topic Clusters. Extract keywords and build calendars from your live URL.`,
    headline: `Generate Topic Clusters`,
    description: `Deterministic local keyword extractor. Output Markdown reports.`,
    cta: "Download CLI",
    creativeNote: "Text search ad targeting: keyword strategy, topic clustering tools.",
  });
  variants.push({
    platform: "google-search",
    family: "proof",
    stage: "conversion",
    primaryText: `Lighthouse for Growth. Test SEO, content, and trust with open-source rule runner.`,
    headline: `Lighthouse for Website Growth`,
    description: `26-rule automated check. 100% free and offline.`,
    cta: "Get Started",
    creativeNote: "Text search ad targeting: page auditor, Lighthouse marketing alternative.",
  });

  // 4. Reddit/X (4 variants)
  // Focus: conversational, transparent, less polished, developer-friendly.
  variants.push({
    platform: "reddit",
    family: "founder-story",
    stage: "awareness",
    primaryText: `Tired of slow, paid marketing platforms that require expensive subscriptions just to tell you your title tag is too long? I built OpenGrowth — a local, open-source growth operating system. It parses your page, runs 26 strict rules, and builds your strategy. Zero AI, zero cost. Let me know what you think.`,
    headline: `Built a local, open-source growth auditor in TypeScript`,
    description: "Run audits offline directly in your terminal.",
    cta: "View Source",
    creativeNote: "Raw terminal execution screen showing a quick crawl of example.com.",
  });
  variants.push({
    platform: "x",
    family: "objection-handling",
    stage: "consideration",
    primaryText: `AI content generators write generic templates. OpenGrowth uses deterministic, weighted rules to extract actual keywords from your page and build custom topic calendars. No LLM calls. No latency. Check out the roadmap.`,
    headline: `Deterministic heuristics over black-box AI generators`,
    cta: "Read Roadmap",
    creativeNote: "Minimal design card showing the roadmap progress checklist.",
  });
  variants.push({
    platform: "reddit",
    family: "pain-point",
    stage: "awareness",
    primaryText: `If you are running paid ads to a page without a privacy policy or with broken canonical URLs, you are leaking cash. Run a quick local check before scaling budgets. OpenGrowth is free, local, and runs via npm.`,
    headline: `Before scaling ad budgets, run this 26-rule local check`,
    description: "Detect conversion bottlenecks in under 3 seconds.",
    cta: "Get CLI",
    creativeNote: "Split screen of manual audit checklist vs terminal scorecard output.",
  });
  variants.push({
    platform: "x",
    family: "proof",
    stage: "conversion",
    primaryText: `Lighthouse for website growth is here. 26 rules check SEO, content depth, forms, active CTAs, and trust indicators. Terminal-formatted tables and markdown exports. npm install and run offline.`,
    headline: `Lighthouse for Growth is Open-Source`,
    cta: "Install CLI",
    creativeNote: "Code block showing installation command: npm i -g @savior-systems/opengrowth.",
  });

  // 5. Short Video / Script Concepts (4 variants)
  variants.push({
    platform: "youtube-shorts",
    family: "education",
    stage: "awareness",
    primaryText: `Watch how this simple heading change can impact your search traffic. We crawl a site, find heading hierarchy errors, and fix them.`,
    headline: `Fix Your Heading Structure in Seconds`,
    cta: "Watch Now",
    creativeNote: "Video concept showing red highlighting on headings, switching to green.",
  });
  variants.push({
    platform: "tiktok",
    family: "urgency",
    stage: "awareness",
    primaryText: `This missing file could get your B2B ad account suspended. We show you why robots.txt and privacy policies are crucial for ad readiness.`,
    headline: `Is Your Site Ready for Paid Traffic?`,
    cta: "Verify URL",
    creativeNote: "Warning notification graphic overlaid on video.",
  });
  variants.push({
    platform: "instagram",
    family: "transformation",
    stage: "consideration",
    primaryText: `Building a content calendar manually takes hours. Watch this tool extract keywords and layout 30 days of ideas instantly.`,
    headline: `Fast-Track Content Planning`,
    cta: "See Calendar",
    creativeNote: "Time-lapse of markdown report text rendering on screen.",
  });
  variants.push({
    platform: "tiktok",
    family: "pain-point",
    stage: "awareness",
    primaryText: `Passive buttons like 'Submit' cost you conversions. See why active verb CTAs keep users engaged.`,
    headline: `Stop Using Passive Buttons`,
    cta: "Audit CTA Buttons",
    creativeNote: "Zoom in on button change from 'Submit' to 'Get Strategy Plan'.",
  });

  // 6. Retargeting / Conversion BOFU (4 variants)
  variants.push({
    platform: "linkedin",
    family: "proof",
    stage: "conversion",
    primaryText: `Ready to fix the leaks identified in your growth report? OpenGrowth maps exactly where users bounce. Fix your critical conversion and trust findings today to prepare for scaling.`,
    headline: `Fix the Conversion Leaks in Your Report`,
    cta: "View Audit Results",
    creativeNote: "Checklist card showing prioritized findings categorized by severity.",
  });
  variants.push({
    platform: "facebook",
    family: "offer",
    stage: "conversion",
    primaryText: `Download OpenGrowth to run local website audits. 100% free, MIT licensed, offline-first. Generate scorecard.json, report.md, content strategy maps, and ad angles without sharing any user data.`,
    headline: `Get the Free Growth Operating System CLI`,
    cta: "Download Source",
    creativeNote: "Stylized mockup of the open-source repository page and download badges.",
  });
  variants.push({
    platform: "linkedin",
    family: "use-case",
    stage: "conversion",
    primaryText: `Running B2B client audits? Save hours of manual checklist compiling. OpenGrowth CLI generates clean scorecard reports and strategy exports for clients in seconds.`,
    headline: `The Agency Audit Tool that Fits Your Terminal`,
    cta: "Start Free Trial",
    creativeNote: "Premium mockup of a consultant presenting an OpenGrowth markdown report to clients.",
  });
  variants.push({
    platform: "facebook",
    family: "objection-handling",
    stage: "conversion",
    primaryText: `Secure connection checks, robots.txt confirmation, heading tags, form fields, and content strategy calendar. OpenGrowth provides B2B-grade audits with zero cloud dependencies or subscriptions.`,
    headline: `Complete Strategy Audits. Offline. Privacy Secured.`,
    cta: "Get Scorecard",
    creativeNote: "Checklist checklist card with lock emblem.",
  });

  return variants;
}
