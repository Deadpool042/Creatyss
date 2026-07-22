import {
  MarketingIntentChannel,
  MarketingIntentSubjectType,
  MarketingIntentType,
} from "@/prisma-generated/client";

/**
 * Liste fermée des `eventType` consommés par le pipeline commerce-intents.
 * Nommée volontairement générique ("commerce") pour accueillir des eventType
 * de plusieurs sous-domaines commerce sans ambiguïté : `market.*` et,
 * depuis ce lot, `product.*`.
 */
export const COMMERCE_MARKETING_EVENT_TYPES = [
  "market.created",
  "market.updated",
  "market.cancelled",
  "product.published",
  "product.updated_visible",
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
  | "PRODUCT_PUBLISHED"
  | "PRODUCT_UPDATED_VISIBLE"
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

const SUGGESTED_CHANNELS = [
  MarketingIntentChannel.NEWSLETTER,
  MarketingIntentChannel.SOCIAL,
] as const;

/**
 * Reasons couvertes par `createResult`, associées à leur `intentType` /
 * `subjectType` Prisma respectifs. Centraliser ce mapping ici évite de
 * répéter `intentType`/`subjectType` à chaque site d'appel du switch tout en
 * gardant le typage strict (chaque reason "créatrice" est associée à un
 * unique couple intentType/subjectType).
 */
const CREATE_RESULT_SUBJECT_BY_REASON = {
  MARKET_CREATED: {
    intentType: MarketingIntentType.PROMOTE_COMMERCE_EVENT,
    subjectType: MarketingIntentSubjectType.PUBLIC_EVENT,
  },
  MARKET_UPDATED: {
    intentType: MarketingIntentType.PROMOTE_COMMERCE_EVENT,
    subjectType: MarketingIntentSubjectType.PUBLIC_EVENT,
  },
  PRODUCT_PUBLISHED: {
    intentType: MarketingIntentType.PROMOTE_PRODUCT,
    subjectType: MarketingIntentSubjectType.PRODUCT,
  },
  PRODUCT_UPDATED_VISIBLE: {
    intentType: MarketingIntentType.PROMOTE_PRODUCT,
    subjectType: MarketingIntentSubjectType.PRODUCT,
  },
} as const satisfies Record<
  Exclude<CommerceMarketingIntentPolicyReason, "MARKET_CANCELLED" | "UNSUPPORTED_EVENT_TYPE">,
  { intentType: MarketingIntentType; subjectType: MarketingIntentSubjectType }
>;

function createResult(input: {
  action: "CREATE_PROPOSED" | "MERGE_WITH_OPEN_INTENT";
  reason: keyof typeof CREATE_RESULT_SUBJECT_BY_REASON;
  deduplicationScope: CommerceMarketingIntentDeduplicationScope;
}): CommerceMarketingIntentPolicyResult {
  const { intentType, subjectType } = CREATE_RESULT_SUBJECT_BY_REASON[input.reason];

  return {
    action: input.action,
    reason: input.reason,
    intentType,
    subjectType,
    suggestedChannels: SUGGESTED_CHANNELS,
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
 * Couvre deux sous-domaines commerce : les marchés (`market.*`) et,
 * depuis ce lot, les produits (`product.*`). Le fichier a été nommé
 * volontairement générique dès l'origine ("commerce", pas "market") pour
 * accueillir cette extension sans renommage ni duplication de module.
 *
 * `market.created`/`market.updated` et `product.published`/
 * `product.updated_visible` proposent tous une diffusion (newsletter +
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
    case "product.published":
      return createResult({
        action: "CREATE_PROPOSED",
        reason: "PRODUCT_PUBLISHED",
        deduplicationScope: "PUBLICATION_CYCLE",
      });
    case "product.updated_visible":
      return createResult({
        action: "MERGE_WITH_OPEN_INTENT",
        reason: "PRODUCT_UPDATED_VISIBLE",
        deduplicationScope: "OPEN_INTENT",
      });
    default:
      return ignoreResult("UNSUPPORTED_EVENT_TYPE");
  }
}
