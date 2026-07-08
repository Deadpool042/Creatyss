import { type DbExecutor } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";
import { BlogPostStatus } from "@/prisma-generated/client";

type RecordBlogPostPublicationDomainEventInput = Readonly<{
  executor: DbExecutor;
  storeId: string;
  postId: string;
  slug: string;
  title: string;
  previousStatus: BlogPostStatus;
  nextStatus: BlogPostStatus;
  previousPublishedAt: Date | null;
  nextPublishedAt: Date | null;
}>;

function isPublishedStatus(status: BlogPostStatus): boolean {
  return status === BlogPostStatus.ACTIVE;
}

function getTransitionPublishedAt(
  input: RecordBlogPostPublicationDomainEventInput,
): Date | null {
  return isPublishedStatus(input.nextStatus) ? input.nextPublishedAt : input.previousPublishedAt;
}

function buildTransitionToken(input: RecordBlogPostPublicationDomainEventInput): string {
  const publishedAt = getTransitionPublishedAt(input);

  if (publishedAt !== null) {
    return publishedAt.toISOString();
  }

  return `${input.previousStatus}-to-${input.nextStatus}`;
}

export async function recordBlogPostPublicationDomainEvent(
  input: RecordBlogPostPublicationDomainEventInput,
): Promise<void> {
  const wasPublished = isPublishedStatus(input.previousStatus);
  const isPublished = isPublishedStatus(input.nextStatus);

  if (wasPublished === isPublished) {
    return;
  }

  const eventName = isPublished ? "published" : "unpublished";
  const transitionPublishedAt = getTransitionPublishedAt(input);

  await recordDomainEvent({
    executor: input.executor,
    storeId: input.storeId,
    eventType: `content.blog_post.${eventName}`,
    aggregateType: "BLOG_POST",
    aggregateId: input.postId,
    idempotencyKey: `blog-post:${input.postId}:${eventName}:${buildTransitionToken(input)}`,
    payload: {
      postId: input.postId,
      slug: input.slug,
      title: input.title,
      previousStatus: input.previousStatus,
      nextStatus: input.nextStatus,
      publishedAt: transitionPublishedAt?.toISOString() ?? null,
    },
  });
}
