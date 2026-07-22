import "server-only";

import { type DbExecutor } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";

export type PublicEventDomainEventSnapshot = Readonly<{
  id: string;
  slug: string;
  title: string;
  startsAt: Date;
  updatedAt: Date;
}>;

type RecordPublicEventDomainEventInput = Readonly<{
  executor?: DbExecutor;
  storeId: string;
  publicEvent: PublicEventDomainEventSnapshot;
}>;

/**
 * Recorder dédié au consumer `marketing-intents.commerce.v1` — parallèle au
 * pipeline éditorial, `aggregateType: "public_event"`.
 *
 * Enregistre un `DomainEvent` lorsqu'un marché est créé ou modifié en admin.
 * Le rattrapage `market.cancelled` n'est pas encore câblé : le toggle de
 * statut actuel (`togglePublicEventStatusAction`) n'alterne qu'entre
 * `ACTIVE`/`INACTIVE`, aucun chemin admin ne produit `CANCELLED`
 * aujourd'hui. Le recorder ci-dessous reste prêt à être branché le jour où
 * une action d'annulation existera (hors périmètre du Lot 4).
 */
export async function recordPublicEventCreatedDomainEvent(
  input: RecordPublicEventDomainEventInput
): Promise<void> {
  await recordDomainEvent({
    ...(input.executor === undefined ? {} : { executor: input.executor }),
    storeId: input.storeId,
    eventType: "market.created",
    aggregateType: "public_event",
    aggregateId: input.publicEvent.id,
    idempotencyKey: `public-event:${input.publicEvent.id}:created`,
    payload: {
      publicEventId: input.publicEvent.id,
      slug: input.publicEvent.slug,
      title: input.publicEvent.title,
      startsAt: input.publicEvent.startsAt.toISOString(),
    },
  });
}

export async function recordPublicEventUpdatedDomainEvent(
  input: RecordPublicEventDomainEventInput
): Promise<void> {
  await recordDomainEvent({
    ...(input.executor === undefined ? {} : { executor: input.executor }),
    storeId: input.storeId,
    eventType: "market.updated",
    aggregateType: "public_event",
    aggregateId: input.publicEvent.id,
    idempotencyKey: `public-event:${input.publicEvent.id}:updated:${input.publicEvent.updatedAt.toISOString()}`,
    payload: {
      publicEventId: input.publicEvent.id,
      slug: input.publicEvent.slug,
      title: input.publicEvent.title,
      startsAt: input.publicEvent.startsAt.toISOString(),
    },
  });
}

/**
 * Non câblé actuellement — aucune action admin ne produit le statut
 * `CANCELLED` aujourd'hui (cf. note ci-dessus). Fourni pour que le futur
 * point d'entrée d'annulation n'ait qu'à l'appeler.
 */
export async function recordPublicEventCancelledDomainEvent(
  input: RecordPublicEventDomainEventInput
): Promise<void> {
  await recordDomainEvent({
    ...(input.executor === undefined ? {} : { executor: input.executor }),
    storeId: input.storeId,
    eventType: "market.cancelled",
    aggregateType: "public_event",
    aggregateId: input.publicEvent.id,
    idempotencyKey: `public-event:${input.publicEvent.id}:cancelled:${input.publicEvent.updatedAt.toISOString()}`,
    payload: {
      publicEventId: input.publicEvent.id,
      slug: input.publicEvent.slug,
      title: input.publicEvent.title,
      startsAt: input.publicEvent.startsAt.toISOString(),
    },
  });
}
