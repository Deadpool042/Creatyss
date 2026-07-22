import { describe, expect, it } from "vitest";

import {
  MarketingIntentChannel,
  MarketingIntentSubjectType,
  MarketingIntentType,
} from "@/prisma-generated/client";
import { resolveCommerceMarketingIntentPolicy } from "@/features/marketing/commerce-intents/resolve-commerce-marketing-intent-policy";

const SUBJECT_ID = "public_event_1";

describe("resolveCommerceMarketingIntentPolicy", () => {
  it("retient CREATE_PROPOSED NEWSLETTER + SOCIAL pour market.created", () => {
    expect(
      resolveCommerceMarketingIntentPolicy({
        eventType: "market.created",
        subjectId: SUBJECT_ID,
      })
    ).toEqual({
      action: "CREATE_PROPOSED",
      reason: "MARKET_CREATED",
      intentType: MarketingIntentType.PROMOTE_COMMERCE_EVENT,
      subjectType: MarketingIntentSubjectType.PUBLIC_EVENT,
      suggestedChannels: [MarketingIntentChannel.NEWSLETTER, MarketingIntentChannel.SOCIAL],
      deduplicationScope: "PUBLICATION_CYCLE",
    });
  });

  it("retient MERGE_WITH_OPEN_INTENT NEWSLETTER + SOCIAL pour market.updated", () => {
    expect(
      resolveCommerceMarketingIntentPolicy({
        eventType: "market.updated",
        subjectId: SUBJECT_ID,
      })
    ).toEqual({
      action: "MERGE_WITH_OPEN_INTENT",
      reason: "MARKET_UPDATED",
      intentType: MarketingIntentType.PROMOTE_COMMERCE_EVENT,
      subjectType: MarketingIntentSubjectType.PUBLIC_EVENT,
      suggestedChannels: [MarketingIntentChannel.NEWSLETTER, MarketingIntentChannel.SOCIAL],
      deduplicationScope: "OPEN_INTENT",
    });
  });

  it("ignore market.cancelled sans proposer de diffusion", () => {
    expect(
      resolveCommerceMarketingIntentPolicy({
        eventType: "market.cancelled",
        subjectId: SUBJECT_ID,
      })
    ).toEqual({
      action: "IGNORE",
      reason: "MARKET_CANCELLED",
    });
  });

  it("ignore un eventType inconnu", () => {
    expect(
      resolveCommerceMarketingIntentPolicy({
        eventType: "market.something_else",
        subjectId: SUBJECT_ID,
      })
    ).toEqual({
      action: "IGNORE",
      reason: "UNSUPPORTED_EVENT_TYPE",
    });
  });
});
