import "server-only";

import {
  Prisma,
  type DomainEvent,
  type DomainEventDelivery,
  type MarketingIntent,
  type MarketingIntentChannel,
  type MarketingIntentSubjectType,
  type MarketingIntentType,
} from "@/prisma-generated/client";
import { db, type DbTx } from "@/core/db";
import {
  resolveCommerceMarketingIntentPolicy,
  type CommerceMarketingIntentPolicyAction,
  type CommerceMarketingIntentPolicyReason,
  type CommerceMarketingIntentPolicyResult,
} from "./resolve-commerce-marketing-intent-policy";

type CommerceEventPayload = Record<string, unknown>;

type SuccessfulDeliveryStatus = "PUBLISHED";

type IgnoredProjectionReason =
  | CommerceMarketingIntentPolicyReason
  | "NO_OPEN_PROPOSED_INTENT"
  | "AMBIGUOUS_OPEN_PROPOSED_INTENT";

type CreateProjectionPolicy = Readonly<{
  action: "CREATE_PROPOSED" | "OPTIONAL_CREATE";
  reason: CommerceMarketingIntentPolicyReason;
  intentType: MarketingIntentType;
  subjectType: MarketingIntentSubjectType;
  suggestedChannels?: readonly MarketingIntentChannel[];
}>;

type MergeProjectionPolicy = Readonly<{
  action: "MERGE_WITH_OPEN_INTENT";
  reason: CommerceMarketingIntentPolicyReason;
  intentType: MarketingIntentType;
  subjectType: MarketingIntentSubjectType;
}>;

export const COMMERCE_MARKETING_INTENT_CONSUMER_CODE = "marketing-intents.commerce.v1";

export type ProjectCommerceDomainEventToMarketingIntentInput = Readonly<{
  domainEvent: DomainEvent;
}>;

export type ProjectCommerceDomainEventToMarketingIntentResult =
  | Readonly<{
      status: "already_processed";
      delivery: DomainEventDelivery;
      marketingIntent: null;
    }>
  | Readonly<{
      status: "pending_delivery";
      delivery: DomainEventDelivery;
      marketingIntent: null;
    }>
  | Readonly<{
      status: "skipped_terminal_delivery";
      delivery: DomainEventDelivery;
      marketingIntent: null;
    }>
  | Readonly<{
      status: "ignored";
      delivery: DomainEventDelivery;
      marketingIntent: null;
      reason: IgnoredProjectionReason;
    }>
  | Readonly<{
      status: "created";
      delivery: DomainEventDelivery;
      marketingIntent: MarketingIntent;
      optional: boolean;
    }>
  | Readonly<{
      status: "merged";
      delivery: DomainEventDelivery;
      marketingIntent: MarketingIntent;
    }>
  | Readonly<{
      status: "deduplicated";
      delivery: DomainEventDelivery;
      marketingIntent: MarketingIntent;
      optional: boolean;
    }>;

function isCreateProjectionPolicy(
  policy: CommerceMarketingIntentPolicyResult
): policy is CreateProjectionPolicy {
  return (
    (policy.action === "CREATE_PROPOSED" || policy.action === "OPTIONAL_CREATE") &&
    policy.intentType !== undefined &&
    policy.subjectType !== undefined
  );
}

function isMergeProjectionPolicy(
  policy: CommerceMarketingIntentPolicyResult
): policy is MergeProjectionPolicy {
  return (
    policy.action === "MERGE_WITH_OPEN_INTENT" &&
    policy.intentType !== undefined &&
    policy.subjectType !== undefined
  );
}

function isUniqueConstraintError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2002";
  }

  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}

function serializeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function parsePayloadJson(payloadJson: string): CommerceEventPayload {
  const parsed: unknown = JSON.parse(payloadJson);

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("DomainEvent payloadJson must decode to a JSON object.");
  }

  return parsed as CommerceEventPayload;
}

function readString(payload: CommerceEventPayload, key: string): string | null {
  const value = payload[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asJsonObject(value: Prisma.JsonValue | null): Prisma.JsonObject | null {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    return null;
  }

  return value as Prisma.JsonObject;
}

function readContextString(value: Prisma.JsonValue | null, key: string): string | null {
  const objectValue = asJsonObject(value);

  if (objectValue === null) {
    return null;
  }

  const item = objectValue[key];
  return typeof item === "string" ? item : null;
}

function getPublicationCycleKey(domainEvent: DomainEvent, payload: CommerceEventPayload): string {
  const payloadStartsAt = readString(payload, "startsAt");

  if (payloadStartsAt !== null) {
    return payloadStartsAt;
  }

  if (domainEvent.occurredAt !== null) {
    return domainEvent.occurredAt.toISOString();
  }

  return domainEvent.id;
}

function buildDeduplicationKey(input: {
  domainEvent: DomainEvent;
  intentType: MarketingIntentType;
  subjectType: MarketingIntentSubjectType;
  subjectId: string;
  action: CommerceMarketingIntentPolicyAction;
  payload: CommerceEventPayload;
}): string {
  const storeKey = input.domainEvent.storeId ?? "global";
  const baseKey = [
    "marketing-intent",
    storeKey,
    input.intentType,
    input.subjectType,
    input.subjectId,
  ].join(":");

  if (input.action === "MERGE_WITH_OPEN_INTENT") {
    return `${baseKey}:open`;
  }

  return `${baseKey}:cycle:${getPublicationCycleKey(input.domainEvent, input.payload)}`;
}

function buildContextJson(input: {
  domainEvent: DomainEvent;
  payload: CommerceEventPayload;
  action: CommerceMarketingIntentPolicyAction;
  reason: CommerceMarketingIntentPolicyReason;
}): Prisma.JsonObject {
  const context: Prisma.JsonObject = {
    sourceEventType: input.domainEvent.eventType,
    lastEventType: input.domainEvent.eventType,
    policyAction: input.action,
    policyReason: input.reason,
  };

  const title = readString(input.payload, "title");
  if (title !== null) {
    context.title = title;
  }

  const slug = readString(input.payload, "slug");
  if (slug !== null) {
    context.slug = slug;
  }

  context.publicationCycleKey = getPublicationCycleKey(input.domainEvent, input.payload);

  return context;
}

function mergeContextJson(input: {
  existingContext: Prisma.JsonValue | null;
  domainEvent: DomainEvent;
  payload: CommerceEventPayload;
  reason: CommerceMarketingIntentPolicyReason;
}): Prisma.JsonObject {
  const merged: Prisma.JsonObject = {
    ...(asJsonObject(input.existingContext) ?? {}),
    lastEventType: input.domainEvent.eventType,
    policyReason: input.reason,
  };

  const title = readString(input.payload, "title");
  if (title !== null) {
    merged.title = title;
  }

  const slug = readString(input.payload, "slug");
  if (slug !== null) {
    merged.slug = slug;
  }

  const cycleKey = readString(input.payload, "startsAt");
  if (cycleKey !== null) {
    merged.publicationCycleKey = cycleKey;
  }

  return merged;
}

async function findExistingDelivery(domainEventId: string): Promise<DomainEventDelivery | null> {
  return db.domainEventDelivery.findUnique({
    where: {
      domainEventId_consumerCode: {
        domainEventId,
        consumerCode: COMMERCE_MARKETING_INTENT_CONSUMER_CODE,
      },
    },
  });
}

async function retryFailedDelivery(delivery: DomainEventDelivery): Promise<DomainEventDelivery> {
  return db.domainEventDelivery.update({
    where: { id: delivery.id },
    data: {
      status: "PENDING",
      deliveredAt: null,
      failedAt: null,
      errorCode: null,
      errorMessage: null,
      attemptCount: {
        increment: 1,
      },
    },
  });
}

async function createPendingDelivery(domainEventId: string): Promise<DomainEventDelivery | null> {
  try {
    return await db.domainEventDelivery.create({
      data: {
        domainEventId,
        consumerCode: COMMERCE_MARKETING_INTENT_CONSUMER_CODE,
        status: "PENDING",
        attemptCount: 1,
      },
    });
  } catch (error: unknown) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    return null;
  }
}

async function markDeliverySuccessful(tx: DbTx, deliveryId: string): Promise<DomainEventDelivery> {
  return tx.domainEventDelivery.update({
    where: { id: deliveryId },
    data: {
      status: "PUBLISHED" as SuccessfulDeliveryStatus,
      deliveredAt: new Date(),
      failedAt: null,
      errorCode: null,
      errorMessage: null,
    },
  });
}

async function markDeliveryFailed(deliveryId: string, error: unknown): Promise<void> {
  await db.domainEventDelivery.update({
    where: { id: deliveryId },
    data: {
      status: "FAILED",
      failedAt: new Date(),
      errorCode: "MARKETING_INTENT_PROJECTION_FAILED",
      errorMessage: serializeError(error),
    },
  });
}

async function resolveExistingDeliveryForProjection(delivery: DomainEventDelivery): Promise<
  | Readonly<{
      kind: "already_processed";
      result: Extract<
        ProjectCommerceDomainEventToMarketingIntentResult,
        { status: "already_processed" }
      >;
    }>
  | Readonly<{
      kind: "pending_delivery";
      result: Extract<
        ProjectCommerceDomainEventToMarketingIntentResult,
        { status: "pending_delivery" }
      >;
    }>
  | Readonly<{
      kind: "skipped_terminal_delivery";
      result: Extract<
        ProjectCommerceDomainEventToMarketingIntentResult,
        { status: "skipped_terminal_delivery" }
      >;
    }>
  | Readonly<{
      kind: "retry";
      delivery: DomainEventDelivery;
    }>
> {
  if (delivery.status === "PUBLISHED") {
    return {
      kind: "already_processed",
      result: {
        status: "already_processed",
        delivery,
        marketingIntent: null,
      },
    };
  }

  if (delivery.status === "FAILED") {
    return {
      kind: "retry",
      delivery: await retryFailedDelivery(delivery),
    };
  }

  if (delivery.status === "PENDING") {
    return {
      kind: "pending_delivery",
      result: {
        status: "pending_delivery",
        delivery,
        marketingIntent: null,
      },
    };
  }

  return {
    kind: "skipped_terminal_delivery",
    result: {
      status: "skipped_terminal_delivery",
      delivery,
      marketingIntent: null,
    },
  };
}

function getSubjectId(domainEvent: DomainEvent): string {
  return domainEvent.aggregateId;
}

async function findOpenIntentCandidate(
  tx: DbTx,
  input: {
    domainEvent: DomainEvent;
    payload: CommerceEventPayload;
    intentType: MarketingIntentType;
    subjectType: MarketingIntentSubjectType;
    subjectId: string;
  }
): Promise<MarketingIntent | null> {
  const openIntents = await tx.marketingIntent.findMany({
    where: {
      storeId: input.domainEvent.storeId ?? null,
      status: "PROPOSED",
      intentType: input.intentType,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
    },
    orderBy: { createdAt: "desc" },
  });

  if (openIntents.length === 0) {
    return null;
  }

  const cycleKey = readString(input.payload, "startsAt");

  if (cycleKey !== null) {
    const exactMatch = openIntents.find(
      (intent) => readContextString(intent.contextJson, "publicationCycleKey") === cycleKey
    );

    return exactMatch ?? null;
  }

  if (openIntents.length === 1) {
    return openIntents[0] ?? null;
  }

  return null;
}

async function createIntentFromPolicy(
  tx: DbTx,
  input: {
    domainEvent: DomainEvent;
    payload: CommerceEventPayload;
    policy: CreateProjectionPolicy;
  }
): Promise<
  Readonly<{
    status: "created" | "deduplicated";
    marketingIntent: MarketingIntent;
    optional: boolean;
  }>
> {
  const subjectId = getSubjectId(input.domainEvent);
  const deduplicationKey = buildDeduplicationKey({
    domainEvent: input.domainEvent,
    intentType: input.policy.intentType,
    subjectType: input.policy.subjectType,
    subjectId,
    action: input.policy.action,
    payload: input.payload,
  });

  const existingIntent = await tx.marketingIntent.findUnique({
    where: { deduplicationKey },
  });

  if (existingIntent !== null) {
    return {
      status: "deduplicated",
      marketingIntent: existingIntent,
      optional: input.policy.action === "OPTIONAL_CREATE",
    };
  }

  try {
    const marketingIntent = await tx.marketingIntent.create({
      data: {
        storeId: input.domainEvent.storeId ?? null,
        status: "PROPOSED",
        intentType: input.policy.intentType,
        subjectType: input.policy.subjectType,
        subjectId,
        suggestedChannels: [...(input.policy.suggestedChannels ?? [])],
        deduplicationKey,
        sourceDomainEventId: input.domainEvent.id,
        lastSourceDomainEventId: input.domainEvent.id,
        contextJson: buildContextJson({
          domainEvent: input.domainEvent,
          payload: input.payload,
          action: input.policy.action,
          reason: input.policy.reason,
        }),
      },
    });

    return {
      status: "created",
      marketingIntent,
      optional: input.policy.action === "OPTIONAL_CREATE",
    };
  } catch (error: unknown) {
    // Race concurrente sur deduplicationKey (contrainte unique) : un autre
    // appelant a créé l'intent entre le findUnique et ce create. On retombe
    // sur le même chemin que la déduplication anticipée plutôt que de
    // laisser l'erreur remonter (cf. correction post-revue PR #17).
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const concurrentIntent = await tx.marketingIntent.findUniqueOrThrow({
      where: { deduplicationKey },
    });

    return {
      status: "deduplicated",
      marketingIntent: concurrentIntent,
      optional: input.policy.action === "OPTIONAL_CREATE",
    };
  }
}

async function mergeWithOpenIntent(
  tx: DbTx,
  input: {
    domainEvent: DomainEvent;
    payload: CommerceEventPayload;
    policy: MergeProjectionPolicy;
  }
): Promise<
  | Readonly<{
      status: "merged";
      marketingIntent: MarketingIntent;
    }>
  | Readonly<{
      status: "ignored";
      reason: IgnoredProjectionReason;
    }>
> {
  const subjectId = getSubjectId(input.domainEvent);
  const openIntent = await findOpenIntentCandidate(tx, {
    domainEvent: input.domainEvent,
    payload: input.payload,
    intentType: input.policy.intentType,
    subjectType: input.policy.subjectType,
    subjectId,
  });

  if (openIntent === null) {
    const candidateCount = await tx.marketingIntent.count({
      where: {
        storeId: input.domainEvent.storeId ?? null,
        status: "PROPOSED",
        intentType: input.policy.intentType,
        subjectType: input.policy.subjectType,
        subjectId,
      },
    });

    return {
      status: "ignored",
      reason: candidateCount > 1 ? "AMBIGUOUS_OPEN_PROPOSED_INTENT" : "NO_OPEN_PROPOSED_INTENT",
    };
  }

  const marketingIntent = await tx.marketingIntent.update({
    where: { id: openIntent.id },
    data: {
      lastSourceDomainEventId: input.domainEvent.id,
      contextJson: mergeContextJson({
        existingContext: openIntent.contextJson,
        domainEvent: input.domainEvent,
        payload: input.payload,
        reason: input.policy.reason,
      }),
    },
  });

  return {
    status: "merged",
    marketingIntent,
  };
}

/**
 * DomainEventDelivery n'expose pas de statut "IGNORED".
 * Toute consommation réussie, y compris quand la policy décide IGNORE,
 * est donc marquée `PUBLISHED` côté delivery.
 *
 * Consumer parallèle et dédié au pipeline `editorial-marketing-intents`
 * (consumerCode distinct, module distinct) — cf. Lot 4 du cadrage marchés.
 */
export async function projectCommerceDomainEventToMarketingIntent(
  input: ProjectCommerceDomainEventToMarketingIntentInput
): Promise<ProjectCommerceDomainEventToMarketingIntentResult> {
  const existingDelivery = await findExistingDelivery(input.domainEvent.id);

  if (existingDelivery !== null) {
    const resolvedDelivery = await resolveExistingDeliveryForProjection(existingDelivery);

    if (resolvedDelivery.kind !== "retry") {
      return resolvedDelivery.result;
    }

    return runProjection(input, resolvedDelivery.delivery);
  }

  const createdDelivery = await createPendingDelivery(input.domainEvent.id);

  if (createdDelivery === null) {
    const concurrentDelivery = await findExistingDelivery(input.domainEvent.id);

    if (concurrentDelivery !== null) {
      const resolvedDelivery = await resolveExistingDeliveryForProjection(concurrentDelivery);

      if (resolvedDelivery.kind !== "retry") {
        return resolvedDelivery.result;
      }

      return runProjection(input, resolvedDelivery.delivery);
    }

    throw new Error("Unable to acquire DomainEventDelivery lock.");
  }

  return runProjection(input, createdDelivery);
}

async function runProjection(
  input: ProjectCommerceDomainEventToMarketingIntentInput,
  activeDelivery: DomainEventDelivery
): Promise<ProjectCommerceDomainEventToMarketingIntentResult> {
  try {
    const payload = parsePayloadJson(input.domainEvent.payloadJson);
    const subjectId = getSubjectId(input.domainEvent);
    const policy = resolveCommerceMarketingIntentPolicy({
      eventType: input.domainEvent.eventType,
      subjectId,
      storeId: input.domainEvent.storeId ?? null,
    });

    return await db.$transaction(async (tx) => {
      let projectionResult:
        | Omit<
            Extract<
              ProjectCommerceDomainEventToMarketingIntentResult,
              { status: "created" | "deduplicated" }
            >,
            "delivery"
          >
        | Omit<
            Extract<ProjectCommerceDomainEventToMarketingIntentResult, { status: "merged" }>,
            "delivery"
          >
        | Omit<
            Extract<ProjectCommerceDomainEventToMarketingIntentResult, { status: "ignored" }>,
            "delivery" | "marketingIntent"
          >;

      if (policy.action === "IGNORE") {
        projectionResult = {
          status: "ignored",
          reason: policy.reason,
        };
      } else if (isCreateProjectionPolicy(policy)) {
        projectionResult = await createIntentFromPolicy(tx, {
          domainEvent: input.domainEvent,
          payload,
          policy,
        });
      } else if (isMergeProjectionPolicy(policy)) {
        projectionResult = await mergeWithOpenIntent(tx, {
          domainEvent: input.domainEvent,
          payload,
          policy,
        });
      } else {
        projectionResult = {
          status: "ignored",
          reason: "UNSUPPORTED_EVENT_TYPE",
        };
      }

      const delivery = await markDeliverySuccessful(tx, activeDelivery.id);

      if (projectionResult.status === "ignored") {
        return {
          status: "ignored" as const,
          delivery,
          marketingIntent: null,
          reason: projectionResult.reason,
        };
      }

      if (projectionResult.status === "merged") {
        return {
          status: "merged" as const,
          delivery,
          marketingIntent: projectionResult.marketingIntent,
        };
      }

      return {
        status: projectionResult.status,
        delivery,
        marketingIntent: projectionResult.marketingIntent,
        optional: projectionResult.optional,
      };
    });
  } catch (error: unknown) {
    await markDeliveryFailed(activeDelivery.id, error);
    throw error;
  }
}
