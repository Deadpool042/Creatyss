import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlogPostStatus } from "@/prisma-generated/client";

const { mockWithTransaction, mockRecordDomainEvent } = vi.hoisted(() => ({
  mockWithTransaction: vi.fn(),
  mockRecordDomainEvent: vi.fn(),
}));

vi.mock("@/core/db", () => ({
  withTransaction: mockWithTransaction,
}));

vi.mock("@/features/domain-events", () => ({
  recordDomainEvent: mockRecordDomainEvent,
}));

import { deleteAdminBlogPost } from "@/features/admin/blog/services/delete-admin-blog-post.service";

const ARCHIVED_AT = new Date("2026-07-08T12:00:00.000Z");
const PUBLISHED_AT = new Date("2026-07-08T10:00:00.000Z");

type DeleteTx = {
  blogPost: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

function runWithTx(tx: DeleteTx) {
  mockWithTransaction.mockImplementation(async (callback: (input: DeleteTx) => Promise<unknown>) => {
    return callback(tx);
  });
}

describe("deleteAdminBlogPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enregistre content.blog_post.archived pour un soft delete", async () => {
    const tx: DeleteTx = {
      blogPost: {
        findFirst: vi.fn().mockResolvedValue({
          id: "post_1",
          storeId: "store_1",
          slug: "article-test",
          title: "Article test",
          status: BlogPostStatus.ACTIVE,
          publishedAt: PUBLISHED_AT,
        }),
        update: vi.fn().mockResolvedValue({
          id: "post_1",
          slug: "article-test",
          title: "Article test",
          status: BlogPostStatus.ARCHIVED,
          archivedAt: ARCHIVED_AT,
        }),
      },
    };

    runWithTx(tx);

    const result = await deleteAdminBlogPost("post_1");

    expect(result).toBe(true);
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: tx,
      storeId: "store_1",
      eventType: "content.blog_post.archived",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "blog-post:post_1:archived:2026-07-08T12:00:00.000Z",
      payload: {
        postId: "post_1",
        slug: "article-test",
        title: "Article test",
        previousStatus: BlogPostStatus.ACTIVE,
        nextStatus: BlogPostStatus.ARCHIVED,
        publishedAt: "2026-07-08T10:00:00.000Z",
        archivedAt: "2026-07-08T12:00:00.000Z",
      },
    });
  });

  it("ne crée aucun événement si l'article est introuvable", async () => {
    const tx: DeleteTx = {
      blogPost: {
        findFirst: vi.fn().mockResolvedValue(null),
        update: vi.fn(),
      },
    };

    runWithTx(tx);

    const result = await deleteAdminBlogPost("post_1");

    expect(result).toBe(false);
    expect(mockRecordDomainEvent).not.toHaveBeenCalled();
  });
});
