import "server-only";

import { type DbExecutor } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";

export type ProductMarketingDomainEventSnapshot = Readonly<{
  id: string;
  slug: string;
  name: string;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
  careInstructions: string | null;
  updatedAt: Date;
}>;

type RecordProductMarketingDomainEventInput = Readonly<{
  executor?: DbExecutor;
  storeId: string;
  product: ProductMarketingDomainEventSnapshot;
}>;

const VISIBLE_PRODUCT_FIELD_NAMES = [
  "name",
  "slug",
  "marketingHook",
  "shortDescription",
  "description",
  "careInstructions",
] as const;

type VisibleProductFieldName = (typeof VISIBLE_PRODUCT_FIELD_NAMES)[number];

/**
 * Compare les champs éditoriaux whitelistés entre deux snapshots produit.
 * Calquée sur `getChangedVisibleFields` du pipeline éditorial blog
 * (`features/admin/blog/services/record-blog-post-editorial-domain-events.ts`).
 */
export function getChangedVisibleProductFields(
  previous: ProductMarketingDomainEventSnapshot,
  next: ProductMarketingDomainEventSnapshot
): VisibleProductFieldName[] {
  return VISIBLE_PRODUCT_FIELD_NAMES.filter((fieldName) => previous[fieldName] !== next[fieldName]);
}

/**
 * Recorder dédié au consumer `marketing-intents.commerce.v1` — parallèle au
 * pipeline éditorial, `aggregateType: "product"`.
 *
 * `product.published` est déclenché à la première transition réelle vers
 * `ACTIVE` (jamais sur la simple mutation Prisma) — symétrique de
 * `market.created`. `product.updated_visible` n'est déclenché que si le
 * produit est déjà `ACTIVE` avant ET après la modification, et qu'au moins
 * un champ éditorial whitelisté a changé — symétrique de `market.updated`.
 * Ces deux gardes sont appliquées par l'appelant (`updateProductGeneral`),
 * pas par ce recorder.
 */
export async function recordProductPublishedDomainEvent(
  input: RecordProductMarketingDomainEventInput
): Promise<void> {
  await recordDomainEvent({
    ...(input.executor === undefined ? {} : { executor: input.executor }),
    storeId: input.storeId,
    eventType: "product.published",
    aggregateType: "product",
    aggregateId: input.product.id,
    idempotencyKey: `product:${input.product.id}:published`,
    payload: {
      productId: input.product.id,
      slug: input.product.slug,
      name: input.product.name,
    },
  });
}

export async function recordProductUpdatedVisibleDomainEvent(
  input: RecordProductMarketingDomainEventInput
): Promise<void> {
  await recordDomainEvent({
    ...(input.executor === undefined ? {} : { executor: input.executor }),
    storeId: input.storeId,
    eventType: "product.updated_visible",
    aggregateType: "product",
    aggregateId: input.product.id,
    idempotencyKey: `product:${input.product.id}:updated-visible:${input.product.updatedAt.toISOString()}`,
    payload: {
      productId: input.product.id,
      slug: input.product.slug,
      name: input.product.name,
    },
  });
}
