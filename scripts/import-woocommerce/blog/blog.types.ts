import type { BlogPostStatus } from "../../../src/generated/prisma/client";
import type { WooImage } from "../schemas";

export type ImportedBlogPostInput = {
  externalId: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  status: BlogPostStatus;
  publishedAt: Date | null;
  featuredImage: WooImage | null;
};
