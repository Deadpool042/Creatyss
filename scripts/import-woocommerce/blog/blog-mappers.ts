import { BlogPostStatus } from "../../../src/generated/prisma/client";
import type { WooImage, WordPressMedia, WordPressPost } from "../schemas";
import { slugify } from "../normalizers/slug";
import { toNullableText } from "../normalizers/text";
import type { ImportedBlogPostInput } from "./blog.types";

function stripHtmlTags(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeBlogPostStatus(value: string): BlogPostStatus {
  if (value === "publish") {
    return BlogPostStatus.ACTIVE;
  }

  if (value === "draft" || value === "pending" || value === "private") {
    return BlogPostStatus.DRAFT;
  }

  return BlogPostStatus.ARCHIVED;
}

function mapWordPressMediaToWooImage(media: WordPressMedia | null): WooImage | null {
  if (!media) {
    return null;
  }

  return {
    id: media.id,
    src: media.source_url,
    alt: toNullableText(media.alt_text) ?? undefined,
    name: undefined,
  };
}

export function mapWordPressPostToImportedBlogPost(
  post: WordPressPost,
  featuredMedia: WordPressMedia | null
): ImportedBlogPostInput {
  const status = normalizeBlogPostStatus(post.status);
  const baseSlug = slugify(post.slug || post.title.rendered || `post-${post.id}`);

  return {
    externalId: `wp_post:${post.id}`,
    slug: `wp-${baseSlug}`,
    title: stripHtmlTags(post.title.rendered).trim(),
    excerpt: toNullableText(stripHtmlTags(post.excerpt.rendered)),
    content: toNullableText(post.content.rendered),
    status,
    publishedAt: status === BlogPostStatus.ACTIVE && post.date ? new Date(post.date) : null,
    featuredImage: mapWordPressMediaToWooImage(featuredMedia),
  };
}
