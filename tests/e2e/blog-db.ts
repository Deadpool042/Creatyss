import { BlogPostStatus } from "@/prisma-generated/client";
import { createScriptPrismaClient } from "../../scripts/helpers/prisma-client";

const prisma = createScriptPrismaClient();

function assertValidBlogPostSlug(slug: string): void {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid blog post slug: ${slug}`);
  }
}

async function readDefaultStore(): Promise<{ id: string }> {
  const store = await prisma.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (store === null) {
    throw new Error("No store available for blog E2E fixture setup.");
  }

  return store;
}

export async function createBlogPostDraftWithoutContent(input: {
  slug: string;
  title: string;
}): Promise<void> {
  assertValidBlogPostSlug(input.slug);
  const store = await readDefaultStore();

  await prisma.blogPost.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: input.slug,
      },
    },
    update: {
      title: input.title,
      body: null,
      status: BlogPostStatus.DRAFT,
      publishedAt: null,
      archivedAt: null,
    },
    create: {
      storeId: store.id,
      slug: input.slug,
      title: input.title,
      body: null,
      status: BlogPostStatus.DRAFT,
    },
  });
}

export async function deleteBlogPostBySlug(slug: string): Promise<void> {
  assertValidBlogPostSlug(slug);
  const store = await readDefaultStore();

  await prisma.blogPost.deleteMany({
    where: {
      storeId: store.id,
      slug,
    },
  });
}
