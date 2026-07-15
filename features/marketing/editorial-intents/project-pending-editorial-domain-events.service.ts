"use server";

import "server-only";

import { db } from "@/core/db";
import { EDITORIAL_MARKETING_EVENT_TYPES } from "./resolve-editorial-marketing-intent-policy";
import {
  EDITORIAL_MARKETING_INTENT_CONSUMER_CODE,
  projectEditorialDomainEventToMarketingIntent,
} from "./project-editorial-domain-event-to-marketing-intent.service";

const DEFAULT_BATCH_SIZE = 50;

export type ProjectPendingEditorialDomainEventsInput = Readonly<{
  batchSize?: number;
}>;

export type ProjectPendingEditorialDomainEventsResult = Readonly<{
  scanned: number;
  created: number;
  merged: number;
  deduplicated: number;
  ignored: number;
  skipped: number;
  failed: number;
}>;

/**
 * Projection pull : rattrape les DomainEvents éditoriaux non encore consommés
 * (aucune delivery PUBLISHED pour le consumer) et rejoue les FAILED.
 * Déclenchée depuis la revue admin, jamais depuis le flux éditorial.
 */
export async function projectPendingEditorialDomainEvents(
  input: ProjectPendingEditorialDomainEventsInput = {}
): Promise<ProjectPendingEditorialDomainEventsResult> {
  const batchSize = input.batchSize ?? DEFAULT_BATCH_SIZE;

  const pendingEvents = await db.domainEvent.findMany({
    where: {
      eventType: { in: [...EDITORIAL_MARKETING_EVENT_TYPES] },
      deliveries: {
        none: {
          consumerCode: EDITORIAL_MARKETING_INTENT_CONSUMER_CODE,
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
      const result = await projectEditorialDomainEventToMarketingIntent({
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
