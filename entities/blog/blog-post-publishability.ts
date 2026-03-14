export type BlogPostPublishabilityErrorCode = "cannot_publish_missing_content";

type BlogPostPublishabilityResult =
  | { ok: true }
  | { ok: false; code: BlogPostPublishabilityErrorCode };

export function getBlogPostPublishability(post: {
  content: string | null;
}): BlogPostPublishabilityResult {
  if (post.content === null || post.content.trim().length === 0) {
    return { ok: false, code: "cannot_publish_missing_content" };
  }

  return { ok: true };
}
