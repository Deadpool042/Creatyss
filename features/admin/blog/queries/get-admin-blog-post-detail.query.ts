import { db } from "@/core/db";

export async function getAdminBlogPostDetail(input: { postId: string }) {
  const post = await db.blogPost.findFirst({
    where: {
      id: input.postId,
      archivedAt: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      status: true,
      primaryImageId: true,
      coverImageId: true,
    },
  });

  if (post === null) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: null,
    status: post.status,
    primaryImageMediaAssetId: post.primaryImageId,
    coverImageMediaAssetId: post.coverImageId,
    seoTitle: null,
    seoDescription: null,
  };
}
