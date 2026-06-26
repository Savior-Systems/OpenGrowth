import type { TopicCluster, ContentIdea, FAQIdea, ContentGap, CalendarItem } from "./types.js";

/**
 * Generate a structured 30-day content calendar.
 *
 * Balance:
 *   - Week 1: Foundation and awareness content (landing pages, awareness blogs)
 *   - Week 2: SEO/topic authority content (educational blogs, cluster topics)
 *   - Week 3: Conversion and trust content (comparison blogs, FAQs, trust-building)
 *   - Week 4: Distribution and repurposing (LinkedIn posts, X threads, newsletters)
 *   - Days 29-30: Optimization and review (metadata updates, internal link audit)
 */
export function generateContentCalendar(input: {
  clusters: TopicCluster[];
  blogIdeas: ContentIdea[];
  landingPageIdeas: ContentIdea[];
  faqIdeas: FAQIdea[];
  gaps: ContentGap[];
}): CalendarItem[] {
  const { blogIdeas, landingPageIdeas, faqIdeas } = input;
  const calendar: CalendarItem[] = [];

  // Index trackers for ideas
  let lpIdx = 0;
  let blogIdx = 0;
  let faqIdx = 0;

  for (let day = 1; day <= 30; day++) {
    let item: CalendarItem;

    if (day >= 1 && day <= 7) {
      // Week 1: Foundation and Awareness
      if (day % 3 === 1 && lpIdx < landingPageIdeas.length) {
        const lp = landingPageIdeas[lpIdx++];
        item = {
          day,
          title: `Launch Landing Page: ${lp.title}`,
          format: "landing-page",
          intent: lp.intent,
          priority: lp.priority,
          goal: `Establish foundational conversion path for search term: "${lp.targetKeyword ?? ""}".`,
        };
      } else if (blogIdx < blogIdeas.length) {
        const blog = blogIdeas[blogIdx++];
        item = {
          day,
          title: `Publish Blog: ${blog.title}`,
          format: "blog",
          intent: "informational",
          priority: blog.priority,
          goal: `Drive awareness and establish initial search engine visibility.`,
        };
      } else {
        item = {
          day,
          title: "Define core brand messaging guidelines",
          format: "guide",
          intent: "trust-building",
          priority: "high",
          goal: "Align page structure with key user search intentions.",
        };
      }
    } else if (day >= 8 && day <= 14) {
      // Week 2: SEO and Topic Authority
      if (blogIdx < blogIdeas.length) {
        const blog = blogIdeas[blogIdx++];
        item = {
          day,
          title: `Publish Blog: ${blog.title}`,
          format: "blog",
          intent: blog.intent,
          priority: blog.priority,
          goal: `Build topical authority for cluster key terms. Target keyword: "${blog.targetKeyword ?? ""}".`,
        };
      } else {
        item = {
          day,
          title: "Draft comprehensive industry glossary",
          format: "guide",
          intent: "informational",
          priority: "medium",
          goal: "Cover topical content gaps and capture long-tail keywords.",
        };
      }
    } else if (day >= 15 && day <= 21) {
      // Week 3: Conversion and Trust
      if (day % 2 === 1 && faqIdx < faqIdeas.length) {
        const faq = faqIdeas[faqIdx++];
        item = {
          day,
          title: `Add FAQ Section: ${faq.question}`,
          format: "faq",
          intent: faq.intent,
          priority: "medium",
          goal: `Address friction: answer "${faq.question}" with trust-building copy.`,
        };
      } else if (lpIdx < landingPageIdeas.length) {
        const lp = landingPageIdeas[lpIdx++];
        item = {
          day,
          title: `Optimize CTA on: ${lp.title}`,
          format: "landing-page",
          intent: "transactional",
          priority: "high",
          goal: "Refine form fields and button verbs to minimize checkout friction.",
        };
      } else if (blogIdx < blogIdeas.length) {
        const blog = blogIdeas[blogIdx++];
        item = {
          day,
          title: `Publish Comparison Blog: ${blog.title}`,
          format: "comparison-page",
          intent: "comparison",
          priority: "high",
          goal: `Target buyers evaluating alternatives. Target: "${blog.targetKeyword ?? ""}".`,
        };
      } else {
        item = {
          day,
          title: "Implement customer testimonial widget in footer",
          format: "case-study",
          intent: "trust-building",
          priority: "high",
          goal: "Establish structural trust and display direct social proof.",
        };
      }
    } else if (day >= 22 && day <= 28) {
      // Week 4: Distribution and Repurposing
      const prevBlogTitle = blogIdeas[Math.max(0, blogIdx - 3)]?.title || "recent articles";
      if (day % 2 === 0) {
        item = {
          day,
          title: `Write LinkedIn Thread: Repurpose "${prevBlogTitle}"`,
          format: "social-post",
          intent: "commercial",
          priority: "medium",
          goal: `Drive social referral traffic to key blog posts.`,
        };
      } else {
        item = {
          day,
          title: `Create X/Twitter thread outlining core lessons from "${prevBlogTitle}"`,
          format: "social-post",
          intent: "informational",
          priority: "medium",
          goal: "Establish micro-authority and build referral backlinks.",
        };
      }
    } else {
      // Days 29-30: Optimization and Review
      if (day === 29) {
        item = {
          day,
          title: "Audit metadata titles and meta descriptions",
          format: "checklist",
          intent: "navigational",
          priority: "low",
          goal: "Ensure search engine snippet optimization (title under 60 chars, meta under 160 chars).",
        };
      } else {
        item = {
          day,
          title: "Establish internal link connections between Week 1 and Week 2 posts",
          format: "checklist",
          intent: "informational",
          priority: "medium",
          goal: "Improve SEO indexing score by establishing proper semantic link loops.",
        };
      }
    }

    calendar.push(item);
  }

  return calendar;
}
