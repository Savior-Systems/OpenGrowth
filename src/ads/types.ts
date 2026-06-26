
export type AdPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "google-search"
  | "youtube-shorts"
  | "tiktok"
  | "reddit"
  | "x";

export type FunnelStage =
  | "awareness"
  | "consideration"
  | "conversion"
  | "retention";

export type AdAngleFamily =
  | "pain-point"
  | "transformation"
  | "proof"
  | "comparison"
  | "urgency"
  | "education"
  | "objection-handling"
  | "offer"
  | "founder-story"
  | "use-case";

export interface AudienceSegment {
  name: string;
  stage: FunnelStage;
  painPoint: string;
  desiredOutcome: string;
  messageFocus: string;
  suggestedPlatforms: AdPlatform[];
}

export interface ValueProposition {
  title: string;
  description: string;
  evidence: string;
  strength: "low" | "medium" | "high";
}

export interface AdHook {
  text: string;
  family: AdAngleFamily;
  platformFit: AdPlatform[];
  reason: string;
}

export interface AdCopyVariant {
  platform: AdPlatform;
  family: AdAngleFamily;
  stage: FunnelStage;
  primaryText: string;
  headline: string;
  description?: string;
  cta: string;
  creativeNote: string;
}

export interface ShortVideoConcept {
  title: string;
  hook: string;
  structure: string[];
  visualDirection: string;
  captionIdea: string;
  cta: string;
  platformFit: AdPlatform[];
}

export interface CarouselConcept {
  title: string;
  slides: Array<{
    slide: number;
    headline: string;
    body: string;
    visualDirection: string;
  }>;
  cta: string;
  platformFit: AdPlatform[];
}

export interface CreativeDirection {
  mood: string;
  visualStyle: string;
  composition: string;
  proofElements: string[];
  avoid: string[];
}

export interface AdStrategy {
  generatedAt: string;
  url: string;
  context: string;
  summary: string;
  audienceSegments: AudienceSegment[];
  valuePropositions: ValueProposition[];
  hooks: AdHook[];
  adCopyVariants: AdCopyVariant[];
  shortVideoConcepts: ShortVideoConcept[];
  carouselConcepts: CarouselConcept[];
  creativeDirections: CreativeDirection[];
  nextSteps: string[];
}

export interface AdInputData {
  primaryTopic: string;
  audienceTerms: string[];
  problemTerms: string[];
  outcomeTerms: string[];
  proofTerms: string[];
  ctaTerms: string[];
  weakAreas: string[];
}
