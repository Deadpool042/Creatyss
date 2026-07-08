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

import { toggleAdminBlogPostStatus } from "@/features/admin/blog/services/toggle-admin-blog-post-status.service";

const PUBLISHED_AT = new Date("2026-07-08T10:00:00.000Z");

type ToggleTx = {
  blogPost: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

function runWithTx(tx: ToggleTx) {
  mockWithTransaction.mockImplementation(async (callback: (input: ToggleTx) => Promise<unknown>) => {
    return callback(tx);
  });
}

describe("toggleAdminBlogPostStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enregistre content.blog_post.published avec une clé idempotente stable", async () => {
    const tx: ToggleTx = {
      blogPost: {
        findFirst: vi.fn().mockResolvedValue({
          id: "post_1",
          storeId: "store_1",
          slug: "article-test",
          title: "Article test",
          status: BlogPostStatus.DRAFT,
          publishedAt: null,
        }),
        update: vi.fn().mockResolvedValue({
          id: "post_1",
          slug: "article-test",
          title: "Article test",
          status: BlogPostStatus.ACTIVE,
          publishedAt: PUBLISHED_AT,
        }),
      },
    };

    runWithTx(tx);

    const result = await toggleAdminBlogPostStatus("post_1");

    expect(result).toBe("published");
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: tx,
      storeId: "store_1",
      eventType: "content.blog_post.published",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "blog-post:post_1:published:2026-07-08T10:00:00.000Z",
      payload: {
        postId: "post_1",
        slug: "article-test",
        title: "Article test",
        previousStatus: BlogPostStatus.DRAFT,
        nextStatus: BlogPostStatus.ACTIVE,
        publishedAt: "2026-07-08T10:00:00.000Z",
      },
    });
  });

  it("enregistre content.blog_post.unpublished avec publishedAt du cycle publié", async () => {
    const tx: ToggleTx = {
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
          status: BlogPostStatus.DRAFT,
          publishedAt: null,
        }),
      },
    };

    runWithTx(tx);

    const result = await toggleAdminBlogPostStatus("post_1");

    expect(result).toBe("draft");
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: tx,
      storeId: "store_1",
      eventType: "content.blog_post.unpublished",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "blog-post:post_1:unpublished:2026-07-08T10:00:00.000Z",
      payload: {
        postId: "post_1",
        slug: "article-test",
        title: "Article test",
        previousStatus: BlogPostStatus.ACTIVE,
        nextStatus: BlogPostStatus.DRAFT,
        publishedAt: "2026-07-08T10:00:00.000Z",
      },
    });
  });
});
