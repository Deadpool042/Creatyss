import {
  MarketingIntentChannel,
  MarketingIntentSubjectType,
  MarketingIntentType,
} from "@/prisma-generated/client";

/**
 * Liste fermée des `eventType` consommés par le pipeline commerce-intents.
 * Nommée volontairement générique ("commerce") pour accueillir plus tard des
 * eventType `product.*` sans ambiguïté, mais ne contient aujourd'hui que les
 * eventType marché (`market.*`).
 */
export const COMMERCE_MARKETING_EVENT_TYPES = [
  "market.created",
  "market.updated",
  "market.cancelled",
] as const;

export type CommerceMarketingEventType = (typeof COMMERCE_MARKETING_EVENT_TYPES)[number];

export type CommerceMarketingIntentPolicyAction =
  | "CREATE_PROPOSED"
  | "OPTIONAL_CREATE"
  | "MERGE_WITH_OPEN_INTENT"
  | "IGNORE";

export type CommerceMarketingIntentPolicyReason =
  | "MARKET_CREATED"
  | "MARKET_UPDATED"
  | "MARKET_CANCELLED"
  | "UNSUPPORTED_EVENT_TYPE";

export type CommerceMarketingIntentDeduplicationScope = "PUBLICATION_CYCLE" | "OPEN_INTENT";

export type CommerceMarketingEvent = Readonly<{
  eventType: string;
  subjectId: string;
  storeId?: string | null;
}>;

export type CommerceMarketingIntentPolicyResult = Readonly<{
  action: CommerceMarketingIntentPolicyAction;
  reason: CommerceMarketingIntentPolicyReason;
  intentType?: MarketingIntentType;
  subjectType?: MarketingIntentSubjectType;
  suggestedChannels?: readonly MarketingIntentChannel[];
  deduplicationScope?: CommerceMarketingIntentDeduplicationScope;
}>;

const MARKET_CHANNELS = [MarketingIntentChannel.NEWSLETTER, MarketingIntentChannel.SOCIAL] as const;

function createResult(input: {
  action: "CREATE_PROPOSED" | "MERGE_WITH_OPEN_INTENT";
  reason: Exclude<
    CommerceMarketingIntentPolicyReason,
    "MARKET_CANCELLED" | "UNSUPPORTED_EVENT_TYPE"
  >;
  deduplicationScope: CommerceMarketingIntentDeduplicationScope;
}): CommerceMarketingIntentPolicyResult {
  return {
    action: input.action,
    reason: input.reason,
    intentType: MarketingIntentType.PROMOTE_COMMERCE_EVENT,
    subjectType: MarketingIntentSubjectType.PUBLIC_EVENT,
    suggestedChannels: MARKET_CHANNELS,
    deduplicationScope: input.deduplicationScope,
  };
}

function ignoreResult(
  reason: "MARKET_CANCELLED" | "UNSUPPORTED_EVENT_TYPE"
): CommerceMarketingIntentPolicyResult {
  return {
    action: "IGNORE",
    reason,
  };
}

/**
 * `market.created`/`market.updated` proposent une diffusion (newsletter +
 * social) sur le même modèle que `content.blog_post.published` /
 * `updated_visible` côté éditorial : création d'un intent PROPOSED au
 * premier événement du cycle, puis fusion avec l'intent ouvert pour les
 * mises à jour suivantes tant qu'aucune revue admin n'a eu lieu.
 *
 * `market.cancelled` : IGNORE délibéré. Proposer une diffusion positive
 * (newsletter/social) pour un marché annulé n'a pas de sens produit — ce
 * serait promouvoir un événement qui n'aura pas lieu. Aucun intent n'est créé
 * ni fusionné pour cet eventType.
 */
export function resolveCommerceMarketingIntentPolicy(
  event: CommerceMarketingEvent
): CommerceMarketingIntentPolicyResult {
  switch (event.eventType) {
    case "market.created":
      return createResult({
        action: "CREATE_PROPOSED",
        reason: "MARKET_CREATED",
        deduplicationScope: "PUBLICATION_CYCLE",
      });
    case "market.updated":
      return createResult({
        action: "MERGE_WITH_OPEN_INTENT",
        reason: "MARKET_UPDATED",
        deduplicationScope: "OPEN_INTENT",
      });
    case "market.cancelled":
      return ignoreResult("MARKET_CANCELLED");
    default:
      return ignoreResult("UNSUPPORTED_EVENT_TYPE");
  }
}
