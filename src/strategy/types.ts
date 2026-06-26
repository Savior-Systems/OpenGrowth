
export type SearchIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational"
  | "comparison"
  | "local"
  | "trust-building";

export type ContentFormat =
  | "blog"
  | "landing-page"
  | "comparison-page"
  | "faq"
  | "case-study"
  | "guide"
  | "checklist"
  | "social-post"
  | "video-script"
  | "email";

export interface ExtractedKeyword {
  term: string;
  source: "title" | "meta" | "heading" | "body" | "context" | "link" | "cta";
  weight: number;
}

export interface TopicCluster {
  name: string;
  intent: SearchIntent;
  priority: "low" | "medium" | "high";
  reason: string;
  keywords: string[];
  suggestedPages: ContentIdea[];
}

export interface ContentIdea {
  title: string;
  format: ContentFormat;
  intent: SearchIntent;
  priority: "low" | "medium" | "high";
  funnelStage: "awareness" | "consideration" | "conversion" | "retention";
  targetKeyword?: string;
  angle: string;
  whyThisMatters: string;
  suggestedOutline: string[];
}

export interface ContentGap {
  type: "seo" | "trust" | "conversion" | "authority" | "context" | "education";
  severity: "low" | "medium" | "high";
  title: string;
  evidence: string;
  recommendation: string;
}

export interface FAQIdea {
  question: string;
  intent: SearchIntent;
  answerAngle: string;
}

export interface DistributionIdea {
  channel: "blog" | "linkedin" | "x" | "reddit" | "email" | "youtube" | "short-video" | "community";
  contentType: string;
  angle: string;
  reason: string;
}

export interface CalendarItem {
  day: number;
  title: string;
  format: ContentFormat;
  intent: SearchIntent;
  priority: "low" | "medium" | "high";
  goal: string;
}

export interface ContentStrategy {
  generatedAt: string;
  url: string;
  context: string;
  summary: string;
  extractedKeywords: ExtractedKeyword[];
  topicClusters: TopicCluster[];
  contentGaps: ContentGap[];
  landingPageIdeas: ContentIdea[];
  blogIdeas: ContentIdea[];
  faqIdeas: FAQIdea[];
  distributionIdeas: DistributionIdea[];
  calendar30Days: CalendarItem[];
  nextSteps: string[];
}
