import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomepageSectionType, HomepageStatus } from "@/prisma-generated/client";

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

import { updateAdminHomepage } from "@/features/admin/homepage/services/update-admin-homepage.service";

const PUBLISHED_AT = new Date("2026-07-08T12:00:00.000Z");
const UPDATED_AT = new Date("2026-07-08T13:15:00.000Z");

type HomepageSnapshotRecord = {
  id: string;
  title: string | null;
  status: HomepageStatus;
  publishedAt: Date | null;
  updatedAt: Date;
  sections: Array<{
    code: string;
    type: HomepageSectionType;
    title: string | null;
    body: string | null;
    primaryImage: {
      storageKey: string;
    } | null;
    featuredProducts: Array<{
      productId: string;
      sortOrder: number;
    }>;
    featuredCategories: Array<{
      categoryId: string;
      sortOrder: number;
    }>;
    featuredPosts: Array<{
      blogPostId: string;
      sortOrder: number;
    }>;
  }>;
};

type UpdateTx = {
  homepage: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  product: {
    findMany: ReturnType<typeof vi.fn>;
  };
  category: {
    findMany: ReturnType<typeof vi.fn>;
  };
  blogPost: {
    findMany: ReturnType<typeof vi.fn>;
  };
  homepageSection: {
    findMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  mediaAsset: {
    findFirst: ReturnType<typeof vi.fn>;
  };
  store: {
    update: ReturnType<typeof vi.fn>;
  };
  homepageFeaturedProduct: {
    deleteMany: ReturnType<typeof vi.fn>;
    createMany: ReturnType<typeof vi.fn>;
  };
  homepageFeaturedCategory: {
    deleteMany: ReturnType<typeof vi.fn>;
    createMany: ReturnType<typeof vi.fn>;
  };
  homepageFeaturedBlogPost: {
    deleteMany: ReturnType<typeof vi.fn>;
    createMany: ReturnType<typeof vi.fn>;
  };
};

function buildSnapshot(
  overrides: Partial<HomepageSnapshotRecord> = {},
): HomepageSnapshotRecord {
  return {
    id: "homepage_1",
    title: "Accueil",
    status: HomepageStatus.ACTIVE,
    publishedAt: PUBLISHED_AT,
    updatedAt: new Date("2026-07-08T12:30:00.000Z"),
    sections: [
      {
        code: "hero",
        type: HomepageSectionType.HERO,
        title: "Titre hero",
        body: "Texte hero",
        primaryImage: {
          storageKey: "hero.jpg",
        },
        featuredProducts: [],
        featuredCategories: [],
        featuredPosts: [],
      },
      {
        code: "editorial",
        type: HomepageSectionType.EDITORIAL,
        title: "Titre éditorial",
        body: "Texte éditorial",
        primaryImage: null,
        featuredProducts: [],
        featuredCategories: [],
        featuredPosts: [],
      },
      {
        code: "featured-products",
        type: HomepageSectionType.FEATURED_PRODUCTS,
        title: null,
        body: null,
        primaryImage: null,
        featuredProducts: [{ productId: "prod_1", sortOrder: 0 }],
        featuredCategories: [],
        featuredPosts: [],
      },
      {
        code: "featured-categories",
        type: HomepageSectionType.FEATURED_CATEGORIES,
        title: null,
        body: null,
        primaryImage: null,
        featuredProducts: [],
        featuredCategories: [{ categoryId: "cat_1", sortOrder: 0 }],
        featuredPosts: [],
      },
      {
        code: "featured-blog-posts",
        type: HomepageSectionType.BLOG_POSTS,
        title: null,
        body: null,
        primaryImage: null,
        featuredProducts: [],
        featuredCategories: [],
        featuredPosts: [{ blogPostId: "post_1", sortOrder: 0 }],
      },
    ],
    ...overrides,
  };
}

function buildTx(snapshotSequence: readonly HomepageSnapshotRecord[]): UpdateTx {
  return {
    homepage: {
      findFirst: vi
        .fn()
        .mockResolvedValueOnce({
          id: "homepage_1",
          storeId: "store_1",
        })
        .mockResolvedValueOnce(snapshotSequence[0])
        .mockResolvedValueOnce(snapshotSequence[1]),
      update: vi.fn().mockResolvedValue({
        id: "homepage_1",
      }),
    },
    product: {
      findMany: vi.fn().mockResolvedValue([{ id: "prod_1" }]),
    },
    category: {
      findMany: vi.fn().mockResolvedValue([{ id: "cat_1" }]),
    },
    blogPost: {
      findMany: vi.fn().mockResolvedValue([{ id: "post_1" }]),
    },
    homepageSection: {
      findMany: vi.fn().mockResolvedValue([
        { id: "hero_section", code: "hero", type: HomepageSectionType.HERO },
        { id: "editorial_section", code: "editorial", type: HomepageSectionType.EDITORIAL },
        {
          id: "featured_products_section",
          code: "featured-products",
          type: HomepageSectionType.FEATURED_PRODUCTS,
        },
        {
          id: "featured_categories_section",
          code: "featured-categories",
          type: HomepageSectionType.FEATURED_CATEGORIES,
        },
        {
          id: "featured_blog_posts_section",
          code: "featured-blog-posts",
          type: HomepageSectionType.BLOG_POSTS,
        },
      ]),
      update: vi.fn().mockResolvedValue({}),
      create: vi.fn(),
    },
    mediaAsset: {
      findFirst: vi.fn().mockResolvedValue({
        id: "media_1",
      }),
    },
    store: {
      update: vi.fn().mockResolvedValue({
        id: "store_1",
      }),
    },
    homepageFeaturedProduct: {
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    homepageFeaturedCategory: {
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    homepageFeaturedBlogPost: {
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
  };
}

function runWithTx(tx: UpdateTx) {
  mockWithTransaction.mockImplementation(async (callback: (input: UpdateTx) => Promise<unknown>) => {
    return callback(tx);
  });
}

const defaultInput = {
  id: "homepage_1",
  shippingReturnsPolicy: "Livraison soignée",
  heroTitle: "Titre hero",
  heroText: "Texte hero",
  heroImagePath: "hero.jpg",
  editorialTitle: "Titre éditorial",
  editorialText: "Texte éditorial",
  featuredProducts: [{ productId: "prod_1", sortOrder: 0 }],
  featuredCategories: [{ categoryId: "cat_1", sortOrder: 0 }],
  featuredBlogPosts: [{ blogPostId: "post_1", sortOrder: 0 }],
} as const;

describe("updateAdminHomepage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enregistre content.homepage.updated_visible quand une homepage publiée change visiblement", async () => {
    const previous = buildSnapshot();
    const next = buildSnapshot({
      updatedAt: UPDATED_AT,
      sections: buildSnapshot().sections.map((section) =>
        section.code === "hero"
          ? { ...section, title: "Titre hero modifié" }
          : section
      ),
    });
    const tx = buildTx([previous, next]);

    runWithTx(tx);

    await updateAdminHomepage({
      ...defaultInput,
      heroTitle: "Titre hero modifié",
    });

    expect(mockRecordDomainEvent).toHaveBeenCalledWith({
      executor: tx,
      storeId: "store_1",
      eventType: "content.homepage.updated_visible",
      aggregateType: "HOMEPAGE",
      aggregateId: "homepage_1",
      idempotencyKey: "homepage:homepage_1:updated-visible:2026-07-08T13:15:00.000Z",
      payload: {
        homepageId: "homepage_1",
        changedFields: ["hero"],
        publishedAt: "2026-07-08T12:00:00.000Z",
        updatedAt: "2026-07-08T13:15:00.000Z",
      },
    });
  });

  it("n'enregistre aucun événement quand la homepage n'est pas publiée", async () => {
    const previous = buildSnapshot({
      status: HomepageStatus.DRAFT,
      publishedAt: null,
    });
    const next = buildSnapshot({
      status: HomepageStatus.DRAFT,
      publishedAt: null,
      updatedAt: UPDATED_AT,
      sections: buildSnapshot().sections.map((section) =>
        section.code === "hero"
          ? { ...section, title: "Titre hero modifié" }
          : section
      ),
    });
    const tx = buildTx([previous, next]);

    runWithTx(tx);

    await updateAdminHomepage({
      ...defaultInput,
      heroTitle: "Titre hero modifié",
    });

    expect(mockRecordDomainEvent).not.toHaveBeenCalled();
  });

  it("n'enregistre aucun événement si aucun champ public significatif ne change", async () => {
    const previous = buildSnapshot();
    const next = buildSnapshot({
      updatedAt: UPDATED_AT,
    });
    const tx = buildTx([previous, next]);

    runWithTx(tx);

    await updateAdminHomepage({
      ...defaultInput,
      shippingReturnsPolicy: "Livraison ajustée",
    });

    expect(mockRecordDomainEvent).not.toHaveBeenCalled();
  });
});
