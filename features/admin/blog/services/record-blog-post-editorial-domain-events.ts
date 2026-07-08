import { type DbExecutor } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";
import { BlogPostStatus } from "@/prisma-generated/client";

type VisibleBlogPostSnapshot = Readonly<{
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  status: BlogPostStatus;
  publishedAt: Date | null;
  primaryImageId: string | null;
  coverImageId: string | null;
  updatedAt: Date;
}>;

type ArchivedBlogPostSnapshot = Readonly<{
  id: string;
  slug: string;
  title: string;
  status: BlogPostStatus;
  publishedAt: Date | null;
  archivedAt: Date | null;
}>;

type RecordBlogPostUpdatedVisibleDomainEventInput = Readonly<{
  executor: DbExecutor;
  storeId: string;
  previous: VisibleBlogPostSnapshot;
  next: VisibleBlogPostSnapshot;
}>;

type RecordBlogPostArchivedDomainEventInput = Readonly<{
  executor: DbExecutor;
  storeId: string;
  previous: ArchivedBlogPostSnapshot;
  next: ArchivedBlogPostSnapshot;
}>;

const VISIBLE_FIELD_NAMES = [
  "title",
  "slug",
  "excerpt",
  "body",
  "primaryImageId",
  "coverImageId",
] as const;

type VisibleFieldName = (typeof VISIBLE_FIELD_NAMES)[number];

function isPublishedStatus(status: BlogPostStatus): boolean {
  return status === BlogPostStatus.ACTIVE;
}

function getChangedVisibleFields(
  previous: VisibleBlogPostSnapshot,
  next: VisibleBlogPostSnapshot,
): VisibleFieldName[] {
  return VISIBLE_FIELD_NAMES.filter((fieldName) => previous[fieldName] !== next[fieldName]);
}

export async function recordBlogPostUpdatedVisibleDomainEvent(
  input: RecordBlogPostUpdatedVisibleDomainEventInput,
): Promise<void> {
  if (!isPublishedStatus(input.previous.status) || !isPublishedStatus(input.next.status)) {
    return;
  }

  const changedFields = getChangedVisibleFields(input.previous, input.next);

  if (changedFields.length === 0) {
    return;
  }

  await recordDomainEvent({
    executor: input.executor,
    storeId: input.storeId,
    eventType: "content.blog_post.updated_visible",
    aggregateType: "BLOG_POST",
    aggregateId: input.next.id,
    idempotencyKey: `blog-post:${input.next.id}:updated-visible:${input.next.updatedAt.toISOString()}`,
    payload: {
      postId: input.next.id,
      slug: input.next.slug,
      title: input.next.title,
      changedFields,
      publishedAt: input.next.publishedAt?.toISOString() ?? null,
    },
  });
}

export async function recordBlogPostArchivedDomainEvent(
  input: RecordBlogPostArchivedDomainEventInput,
): Promise<void> {
  if (input.next.status !== BlogPostStatus.ARCHIVED || input.next.archivedAt === null) {
    return;
  }

  await recordDomainEvent({
    executor: input.executor,
    storeId: input.storeId,
    eventType: "content.blog_post.archived",
    aggregateType: "BLOG_POST",
    aggregateId: input.next.id,
    idempotencyKey: `blog-post:${input.next.id}:archived:${input.next.archivedAt.toISOString()}`,
    payload: {
      postId: input.next.id,
      slug: input.next.slug,
      title: input.next.title,
      previousStatus: input.previous.status,
      nextStatus: input.next.status,
      publishedAt: input.previous.publishedAt?.toISOString() ?? null,
      archivedAt: input.next.archivedAt.toISOString(),
    },
  });
}
