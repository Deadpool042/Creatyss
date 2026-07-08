import {
  MarketingIntentChannel,
  MarketingIntentSubjectType,
  MarketingIntentType,
} from "@/prisma-generated/client";

export const EDITORIAL_MARKETING_EVENT_TYPES = [
  "content.blog_post.published",
  "content.blog_post.unpublished",
  "content.blog_post.updated_visible",
  "content.blog_post.archived",
  "content.homepage.published",
  "content.homepage.updated_visible",
  "content.legal_page.published",
  "content.legal_page.unpublished",
  "content.legal_page.updated",
  "content.editorial_page.published",
  "content.editorial_page.unpublished",
  "content.editorial_page.updated",
] as const;

export type EditorialMarketingEventType =
  (typeof EDITORIAL_MARKETING_EVENT_TYPES)[number];

export type EditorialMarketingIntentPolicyAction =
  | "CREATE_PROPOSED"
  | "OPTIONAL_CREATE"
  | "MERGE_WITH_OPEN_INTENT"
  | "IGNORE";

export type EditorialMarketingIntentPolicyReason =
  | "EDITORIAL_CONTENT_PUBLISHED"
  | "EDITORIAL_CONTENT_UPDATED_VISIBLE"
  | "EDITORIAL_CONTENT_UNPUBLISHED"
  | "EDITORIAL_CONTENT_ARCHIVED"
  | "EDITORIAL_CONTENT_OPTIONAL_REVIEW"
  | "LEGAL_CONTENT"
  | "UNSUPPORTED_EVENT_TYPE";

export type EditorialMarketingIntentDeduplicationScope =
  | "PUBLICATION_CYCLE"
  | "OPEN_INTENT";

export type EditorialMarketingEvent = Readonly<{
  eventType: string;
  subjectId: string;
  storeId?: string | null;
}>;

export type EditorialMarketingIntentPolicyResult = Readonly<{
  action: EditorialMarketingIntentPolicyAction;
  reason: EditorialMarketingIntentPolicyReason;
  intentType?: MarketingIntentType;
  subjectType?: MarketingIntentSubjectType;
  suggestedChannels?: readonly MarketingIntentChannel[];
  deduplicationScope?: EditorialMarketingIntentDeduplicationScope;
}>;

const BLOG_CHANNELS = [
  MarketingIntentChannel.NEWSLETTER,
  MarketingIntentChannel.SOCIAL,
] as const;

const SOCIAL_ONLY_CHANNELS = [MarketingIntentChannel.SOCIAL] as const;

function createResult(input: {
  action: "CREATE_PROPOSED" | "OPTIONAL_CREATE" | "MERGE_WITH_OPEN_INTENT";
  reason: Exclude<
    EditorialMarketingIntentPolicyReason,
    "EDITORIAL_CONTENT_UNPUBLISHED" | "EDITORIAL_CONTENT_ARCHIVED" | "LEGAL_CONTENT" | "UNSUPPORTED_EVENT_TYPE"
  >;
  subjectType: MarketingIntentSubjectType;
  suggestedChannels?: readonly MarketingIntentChannel[];
  deduplicationScope: EditorialMarketingIntentDeduplicationScope;
}): EditorialMarketingIntentPolicyResult {
  return {
    action: input.action,
    reason: input.reason,
    intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
    subjectType: input.subjectType,
    deduplicationScope: input.deduplicationScope,
    ...(input.suggestedChannels === undefined
      ? {}
      : { suggestedChannels: input.suggestedChannels }),
  };
}

function ignoreResult(
  reason:
    | "EDITORIAL_CONTENT_UNPUBLISHED"
    | "EDITORIAL_CONTENT_ARCHIVED"
    | "LEGAL_CONTENT"
    | "UNSUPPORTED_EVENT_TYPE",
): EditorialMarketingIntentPolicyResult {
  return {
    action: "IGNORE",
    reason,
  };
}

export function resolveEditorialMarketingIntentPolicy(
  event: EditorialMarketingEvent,
): EditorialMarketingIntentPolicyResult {
  switch (event.eventType) {
    case "content.blog_post.published":
      return createResult({
        action: "CREATE_PROPOSED",
        reason: "EDITORIAL_CONTENT_PUBLISHED",
        subjectType: MarketingIntentSubjectType.BLOG_POST,
        suggestedChannels: BLOG_CHANNELS,
        deduplicationScope: "PUBLICATION_CYCLE",
      });
    case "content.blog_post.updated_visible":
      return createResult({
        action: "MERGE_WITH_OPEN_INTENT",
        reason: "EDITORIAL_CONTENT_UPDATED_VISIBLE",
        subjectType: MarketingIntentSubjectType.BLOG_POST,
        suggestedChannels: BLOG_CHANNELS,
        deduplicationScope: "OPEN_INTENT",
      });
    case "content.blog_post.unpublished":
      return ignoreResult("EDITORIAL_CONTENT_UNPUBLISHED");
    case "content.blog_post.archived":
      return ignoreResult("EDITORIAL_CONTENT_ARCHIVED");
    case "content.homepage.published":
      return createResult({
        action: "OPTIONAL_CREATE",
        reason: "EDITORIAL_CONTENT_OPTIONAL_REVIEW",
        subjectType: MarketingIntentSubjectType.HOMEPAGE,
        suggestedChannels: SOCIAL_ONLY_CHANNELS,
        deduplicationScope: "PUBLICATION_CYCLE",
      });
    case "content.homepage.updated_visible":
      return createResult({
        action: "MERGE_WITH_OPEN_INTENT",
        reason: "EDITORIAL_CONTENT_UPDATED_VISIBLE",
        subjectType: MarketingIntentSubjectType.HOMEPAGE,
        suggestedChannels: SOCIAL_ONLY_CHANNELS,
        deduplicationScope: "OPEN_INTENT",
      });
    case "content.editorial_page.published":
      return createResult({
        action: "OPTIONAL_CREATE",
        reason: "EDITORIAL_CONTENT_OPTIONAL_REVIEW",
        subjectType: MarketingIntentSubjectType.EDITORIAL_PAGE,
        deduplicationScope: "PUBLICATION_CYCLE",
      });
    case "content.editorial_page.updated":
      return createResult({
        action: "MERGE_WITH_OPEN_INTENT",
        reason: "EDITORIAL_CONTENT_UPDATED_VISIBLE",
        subjectType: MarketingIntentSubjectType.EDITORIAL_PAGE,
        deduplicationScope: "OPEN_INTENT",
      });
    case "content.editorial_page.unpublished":
      return ignoreResult("EDITORIAL_CONTENT_UNPUBLISHED");
    case "content.legal_page.published":
    case "content.legal_page.unpublished":
    case "content.legal_page.updated":
      return ignoreResult("LEGAL_CONTENT");
    default:
      return ignoreResult("UNSUPPORTED_EVENT_TYPE");
  }
}
