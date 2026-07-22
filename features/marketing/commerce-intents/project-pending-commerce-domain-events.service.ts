"use server";

import "server-only";

import { db } from "@/core/db";
import { COMMERCE_MARKETING_EVENT_TYPES } from "./resolve-commerce-marketing-intent-policy";
import {
  COMMERCE_MARKETING_INTENT_CONSUMER_CODE,
  projectCommerceDomainEventToMarketingIntent,
} from "./project-commerce-domain-event-to-marketing-intent.service";

const DEFAULT_BATCH_SIZE = 50;

export type ProjectPendingCommerceDomainEventsInput = Readonly<{
  batchSize?: number;
}>;

export type ProjectPendingCommerceDomainEventsResult = Readonly<{
  scanned: number;
  created: number;
  merged: number;
  deduplicated: number;
  ignored: number;
  skipped: number;
  failed: number;
}>;

/**
 * Projection pull : rattrape les DomainEvents marché (`market.*`) non encore
 * consommés (aucune delivery PUBLISHED pour le consumer commerce) et rejoue
 * les FAILED. Déclenchée depuis la revue admin, jamais depuis le flux marché.
 *
 * Équivalent de `projectPendingEditorialDomainEvents`, scope filtré sur
 * `COMMERCE_MARKETING_EVENT_TYPES` / `marketing-intents.commerce.v1`.
 */
export async function projectPendingCommerceDomainEvents(
  input: ProjectPendingCommerceDomainEventsInput = {}
): Promise<ProjectPendingCommerceDomainEventsResult> {
  const batchSize = input.batchSize ?? DEFAULT_BATCH_SIZE;

  const pendingEvents = await db.domainEvent.findMany({
    where: {
      eventType: { in: [...COMMERCE_MARKETING_EVENT_TYPES] },
      deliveries: {
        none: {
          consumerCode: COMMERCE_MARKETING_INTENT_CONSUMER_CODE,
          status: "PUBLISHED",
        },
      },
    },
    orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
    take: batchSize,
  });

  const summary = {
    scanned: pendingEvents.length,
    created: 0,
    merged: 0,
    deduplicated: 0,
    ignored: 0,
    skipped: 0,
    failed: 0,
  };

  for (const domainEvent of pendingEvents) {
    try {
      const result = await projectCommerceDomainEventToMarketingIntent({
        domainEvent,
      });

      switch (result.status) {
        case "created":
          summary.created += 1;
          break;
        case "merged":
          summary.merged += 1;
          break;
        case "deduplicated":
          summary.deduplicated += 1;
          break;
        case "ignored":
          summary.ignored += 1;
          break;
        default:
          summary.skipped += 1;
          break;
      }
    } catch {
      summary.failed += 1;
    }
  }

  return summary;
}
