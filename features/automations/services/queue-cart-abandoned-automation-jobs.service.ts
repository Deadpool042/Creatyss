import "server-only";

import { db } from "@/core/db";
import {
  AUTOMATION_CART_ABANDONED_JOB_TYPE,
  AUTOMATION_CART_ABANDONED_PAYLOAD_SCHEMA,
  AUTOMATION_CART_SUBJECT_TYPE,
} from "@/features/automations/shared/automation-job.constants";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

/**
 * Durée d'inactivité (depuis `Cart.updatedAt`) après laquelle un panier
 * sans commande est considéré comme abandonné. Constante en dur pour ce
 * lot — pas encore configurable par boutique.
 */
const CART_ABANDONED_INACTIVITY_HOURS = 24;

function buildIdempotencyKey(input: { automationId: string; cartId: string }): string {
  return ["automation", input.automationId, "cart-abandoned", input.cartId].join(":");
}

export type QueueCartAbandonedAutomationJobsResult = Readonly<{
  carts: number;
  jobs: number;
}>;

/**
 * Scan périodique (appelé depuis un cron) : détecte les paniers actifs
 * inactifs depuis `CART_ABANDONED_INACTIVITY_HOURS`, sans commande liée,
 * avec un email connu via un `Checkout`, et met en file un job d'automation
 * par panier candidat × automation `CART_ABANDONED` active de la boutique.
 *
 * Anti-doublon : les paniers traités sont transitionnés vers
 * `status: "ABANDONED"` — les scans suivants ne portent que sur les
 * paniers `ACTIVE`, donc un panier déjà traité ne peut plus être resélectionné.
 */
export async function queueCartAbandonedAutomationJobs(
  now: Date = new Date()
): Promise<QueueCartAbandonedAutomationJobsResult> {
  const automations = await db.automation.findMany({
    where: {
      status: "ACTIVE",
      triggerType: "CART_ABANDONED",
      archivedAt: null,
    },
    select: {
      id: true,
      storeId: true,
      actionType: true,
      delayMinutes: true,
      templateCode: true,
    },
  });

  if (automations.length === 0) {
    return { carts: 0, jobs: 0 };
  }

  const automationsByStoreId = new Map<string, typeof automations>();
  for (const automation of automations) {
    const existing = automationsByStoreId.get(automation.storeId);
    if (existing) {
      existing.push(automation);
    } else {
      automationsByStoreId.set(automation.storeId, [automation]);
    }
  }

  const staleThreshold = new Date(now.getTime() - CART_ABANDONED_INACTIVITY_HOURS * 60 * 60 * 1000);

  let totalCarts = 0;
  let totalJobs = 0;

  for (const [storeId, storeAutomations] of automationsByStoreId) {
    const automationsFeatureActive = await meetsFeatureLevel("engagement.automations", "basic", {
      storeId,
    });

    if (!automationsFeatureActive) {
      continue;
    }

    const candidateCarts = await db.cart.findMany({
      where: {
        storeId,
        status: "ACTIVE",
        archivedAt: null,
        updatedAt: { lte: staleThreshold },
        orders: { none: {} },
        checkouts: { some: { email: { not: null } } },
      },
      select: { id: true },
    });

    if (candidateCarts.length === 0) {
      continue;
    }

    const jobsData = candidateCarts.flatMap((cart) =>
      storeAutomations.map((automation) => ({
        storeId,
        typeCode: AUTOMATION_CART_ABANDONED_JOB_TYPE,
        status: "PENDING" as const,
        priority: "NORMAL" as const,
        subjectType: AUTOMATION_CART_SUBJECT_TYPE,
        subjectId: cart.id,
        idempotencyKey: buildIdempotencyKey({ automationId: automation.id, cartId: cart.id }),
        deduplicationKey: buildIdempotencyKey({ automationId: automation.id, cartId: cart.id }),
        payloadJson: JSON.stringify({
          schema: AUTOMATION_CART_ABANDONED_PAYLOAD_SCHEMA,
          automationId: automation.id,
          triggerType: "CART_ABANDONED",
          actionType: automation.actionType,
          templateCode: automation.templateCode,
          cartId: cart.id,
          scheduledAt: new Date(now.getTime() + automation.delayMinutes * 60_000).toISOString(),
        }),
        scheduledAt: new Date(now.getTime() + automation.delayMinutes * 60_000),
        maxAttempts: 1,
        attemptCount: 0,
      }))
    );

    const [{ count: createdJobs }] = await Promise.all([
      db.job.createMany({ data: jobsData, skipDuplicates: true }),
      db.cart.updateMany({
        where: { id: { in: candidateCarts.map((cart) => cart.id) } },
        data: { status: "ABANDONED", abandonedAt: now },
      }),
    ]);

    totalCarts += candidateCarts.length;
    totalJobs += createdJobs;
  }

  return { carts: totalCarts, jobs: totalJobs };
}
