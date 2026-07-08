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

import { updateAdminBlogPost } from "@/features/admin/blog/services/update-admin-blog-post.service";

const PUBLISHED_AT = new Date("2026-07-08T11:00:00.000Z");

type UpdateTx = {
  blogPost: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  mediaAsset: {
    findFirst: ReturnType<typeof vi.fn>;
  };
  seoMetadata: {
    upsert: ReturnType<typeof vi.fn>;
  };
};

function runWithTx(tx: UpdateTx) {
  mockWithTransaction.mockImplementation(async (callback: (input: UpdateTx) => Promise<unknown>) => {
    return callback(tx);
  });
}

describe("updateAdminBlogPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enregistre content.blog_post.published quand update publie réellement l'article", async () => {
    const tx: UpdateTx = {
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
      mediaAsset: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
      seoMetadata: {
        upsert: vi.fn().mockResolvedValue({}),
      },
    };

    runWithTx(tx);

    const result = await updateAdminBlogPost({
      id: "post_1",
      title: "Article test",
      slug: "article-test",
      excerpt: "Résumé",
      content: "Contenu",
      seoTitle: "SEO title",
      seoDescription: "SEO description",
      primaryImagePath: null,
      coverImagePath: null,
      status: "published",
    });

    expect(result).toEqual({
      id: "post_1",
      slug: "article-test",
      title: "Article test",
      status: BlogPostStatus.ACTIVE,
      publishedAt: PUBLISHED_AT,
    });
    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: tx,
      storeId: "store_1",
      eventType: "content.blog_post.published",
      aggregateType: "BLOG_POST",
      aggregateId: "post_1",
      idempotencyKey: "blog-post:post_1:published:2026-07-08T11:00:00.000Z",
      payload: {
        postId: "post_1",
        slug: "article-test",
        title: "Article test",
        previousStatus: BlogPostStatus.DRAFT,
        nextStatus: BlogPostStatus.ACTIVE,
        publishedAt: "2026-07-08T11:00:00.000Z",
      },
    });
  });

  it("n'enregistre aucun événement si le statut ne change pas réellement", async () => {
    const tx: UpdateTx = {
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
          slug: "article-test-modifie",
          title: "Article test modifie",
          status: BlogPostStatus.DRAFT,
          publishedAt: null,
        }),
      },
      mediaAsset: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
      seoMetadata: {
        upsert: vi.fn().mockResolvedValue({}),
      },
    };

    runWithTx(tx);

    await updateAdminBlogPost({
      id: "post_1",
      title: "Article test modifie",
      slug: "article-test-modifie",
      excerpt: "Résumé",
      content: "Contenu",
      seoTitle: "SEO title",
      seoDescription: "SEO description",
      primaryImagePath: null,
      coverImagePath: null,
      status: "draft",
    });

    expect(mockRecordDomainEvent).not.toHaveBeenCalled();
  });
});
