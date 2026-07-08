import { recordDomainEvent } from "@/features/domain-events";
import type { DbExecutor } from "@/core/db";
import { PageStatus } from "@/prisma-generated/client";

type PageKind = "legal" | "editorial";

type PageStatusSnapshot = Readonly<{
  id: string;
  storeId: string;
  title: string;
  slug: string;
  status: PageStatus;
  publishedAt: Date | null;
  isSystemPage: boolean;
}>;

type PageVisibleSnapshot = PageStatusSnapshot &
  Readonly<{
    shortDescription: string | null;
    body: string | null;
    updatedAt: Date;
  }>;

type ChangedPageField = "title" | "slug" | "shortDescription" | "body";

function getPageKind(isSystemPage: boolean): PageKind {
  return isSystemPage ? "legal" : "editorial";
}

function isPublishedStatus(status: PageStatus): boolean {
  return status === PageStatus.ACTIVE;
}

function getTransitionPublishedAt(
  previous: PageStatusSnapshot,
  next: PageStatusSnapshot,
): Date | null {
  return isPublishedStatus(next.status) ? next.publishedAt : previous.publishedAt;
}

function getChangedVisibleFields(
  previous: PageVisibleSnapshot,
  next: PageVisibleSnapshot,
): ChangedPageField[] {
  const changedFields: ChangedPageField[] = [];

  if (previous.title !== next.title) {
    changedFields.push("title");
  }

  if (previous.slug !== next.slug) {
    changedFields.push("slug");
  }

  if (previous.shortDescription !== next.shortDescription) {
    changedFields.push("shortDescription");
  }

  if (previous.body !== next.body) {
    changedFields.push("body");
  }

  return changedFields;
}

export async function recordPagePublishedOrUnpublishedDomainEvent(input: Readonly<{
  executor: DbExecutor;
  previous: PageStatusSnapshot;
  next: PageStatusSnapshot;
}>): Promise<void> {
  const wasPublished = isPublishedStatus(input.previous.status);
  const isPublished = isPublishedStatus(input.next.status);

  if (wasPublished === isPublished) {
    return;
  }

  const pageKind = getPageKind(input.next.isSystemPage);
  const eventName = isPublished ? "published" : "unpublished";
  const transitionPublishedAt = getTransitionPublishedAt(input.previous, input.next);
  const transitionToken = transitionPublishedAt?.toISOString() ?? `${input.previous.status}-to-${input.next.status}`;

  await recordDomainEvent({
    executor: input.executor,
    storeId: input.next.storeId,
    eventType: `content.${pageKind}_page.${eventName}`,
    aggregateType: "PAGE",
    aggregateId: input.next.id,
    idempotencyKey: `page:${input.next.id}:${eventName}:${transitionToken}`,
    payload: {
      pageId: input.next.id,
      slug: input.next.slug,
      title: input.next.title,
      pageKind,
      previousStatus: input.previous.status,
      nextStatus: input.next.status,
      publishedAt: transitionPublishedAt?.toISOString() ?? null,
    },
  });
}

export async function recordPageUpdatedDomainEvent(input: Readonly<{
  executor: DbExecutor;
  previous: PageVisibleSnapshot;
  next: PageVisibleSnapshot;
}>): Promise<void> {
  if (!isPublishedStatus(input.previous.status) || !isPublishedStatus(input.next.status)) {
    return;
  }

  const changedFields = getChangedVisibleFields(input.previous, input.next);

  if (changedFields.length === 0) {
    return;
  }

  const pageKind = getPageKind(input.next.isSystemPage);

  await recordDomainEvent({
    executor: input.executor,
    storeId: input.next.storeId,
    eventType: `content.${pageKind}_page.updated`,
    aggregateType: "PAGE",
    aggregateId: input.next.id,
    idempotencyKey: `page:${input.next.id}:updated:${input.next.updatedAt.toISOString()}`,
    payload: {
      pageId: input.next.id,
      slug: input.next.slug,
      title: input.next.title,
      pageKind,
      changedFields,
      status: input.next.status,
      updatedAt: input.next.updatedAt.toISOString(),
    },
  });
}
