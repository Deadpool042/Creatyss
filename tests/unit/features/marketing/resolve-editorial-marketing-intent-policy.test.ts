import { describe, expect, it } from "vitest";

import {
  MarketingIntentChannel,
  MarketingIntentSubjectType,
  MarketingIntentType,
} from "@/prisma-generated/client";
import { resolveEditorialMarketingIntentPolicy } from "@/features/marketing/editorial-intents/resolve-editorial-marketing-intent-policy";

const SUBJECT_ID = "subject_1";

describe("resolveEditorialMarketingIntentPolicy", () => {
  it("retient CREATE_PROPOSED pour content.blog_post.published", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.blog_post.published",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "CREATE_PROPOSED",
      reason: "EDITORIAL_CONTENT_PUBLISHED",
      intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
      subjectType: MarketingIntentSubjectType.BLOG_POST,
      suggestedChannels: [
        MarketingIntentChannel.NEWSLETTER,
        MarketingIntentChannel.SOCIAL,
      ],
      deduplicationScope: "PUBLICATION_CYCLE",
    });
  });

  it("retient MERGE_WITH_OPEN_INTENT pour content.blog_post.updated_visible", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.blog_post.updated_visible",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "MERGE_WITH_OPEN_INTENT",
      reason: "EDITORIAL_CONTENT_UPDATED_VISIBLE",
      intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
      subjectType: MarketingIntentSubjectType.BLOG_POST,
      suggestedChannels: [
        MarketingIntentChannel.NEWSLETTER,
        MarketingIntentChannel.SOCIAL,
      ],
      deduplicationScope: "OPEN_INTENT",
    });
  });

  it("ignore content.blog_post.unpublished", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.blog_post.unpublished",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "IGNORE",
      reason: "EDITORIAL_CONTENT_UNPUBLISHED",
    });
  });

  it("ignore content.blog_post.archived", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.blog_post.archived",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "IGNORE",
      reason: "EDITORIAL_CONTENT_ARCHIVED",
    });
  });

  it("retient OPTIONAL_CREATE social-only pour content.homepage.published", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.homepage.published",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "OPTIONAL_CREATE",
      reason: "EDITORIAL_CONTENT_OPTIONAL_REVIEW",
      intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
      subjectType: MarketingIntentSubjectType.HOMEPAGE,
      suggestedChannels: [MarketingIntentChannel.SOCIAL],
      deduplicationScope: "PUBLICATION_CYCLE",
    });
  });

  it("retient MERGE_WITH_OPEN_INTENT social-only pour content.homepage.updated_visible", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.homepage.updated_visible",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "MERGE_WITH_OPEN_INTENT",
      reason: "EDITORIAL_CONTENT_UPDATED_VISIBLE",
      intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
      subjectType: MarketingIntentSubjectType.HOMEPAGE,
      suggestedChannels: [MarketingIntentChannel.SOCIAL],
      deduplicationScope: "OPEN_INTENT",
    });
  });

  it("retient OPTIONAL_CREATE sans canal obligatoire pour content.editorial_page.published", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.editorial_page.published",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "OPTIONAL_CREATE",
      reason: "EDITORIAL_CONTENT_OPTIONAL_REVIEW",
      intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
      subjectType: MarketingIntentSubjectType.EDITORIAL_PAGE,
      deduplicationScope: "PUBLICATION_CYCLE",
    });
  });

  it("retient MERGE_WITH_OPEN_INTENT pour content.editorial_page.updated", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.editorial_page.updated",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "MERGE_WITH_OPEN_INTENT",
      reason: "EDITORIAL_CONTENT_UPDATED_VISIBLE",
      intentType: MarketingIntentType.PROMOTE_EDITORIAL_CONTENT,
      subjectType: MarketingIntentSubjectType.EDITORIAL_PAGE,
      deduplicationScope: "OPEN_INTENT",
    });
  });

  it("ignore content.editorial_page.unpublished", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.editorial_page.unpublished",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "IGNORE",
      reason: "EDITORIAL_CONTENT_UNPUBLISHED",
    });
  });

  it("ignore explicitement content.legal_page.published", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.legal_page.published",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "IGNORE",
      reason: "LEGAL_CONTENT",
    });
  });

  it("ignore explicitement content.legal_page.unpublished", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.legal_page.unpublished",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "IGNORE",
      reason: "LEGAL_CONTENT",
    });
  });

  it("ignore explicitement content.legal_page.updated", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.legal_page.updated",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "IGNORE",
      reason: "LEGAL_CONTENT",
    });
  });

  it("ignore un eventType inconnu", () => {
    expect(
      resolveEditorialMarketingIntentPolicy({
        eventType: "content.unknown.changed",
        subjectId: SUBJECT_ID,
      }),
    ).toEqual({
      action: "IGNORE",
      reason: "UNSUPPORTED_EVENT_TYPE",
    });
  });
});
