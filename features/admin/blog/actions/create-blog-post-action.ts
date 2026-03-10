"use server";

import { redirect } from "next/navigation";
import { listAdminMediaAssets } from "@/db/admin-media";
import {
  AdminBlogRepositoryError,
  createAdminBlogPost
} from "@/db/repositories/admin-blog.repository";
import { validateBlogPostInput } from "@/entities/blog/blog-post-input";

export async function createBlogPostAction(formData: FormData): Promise<void> {
  const validation = validateBlogPostInput({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    currentCoverImagePath: null,
    coverImageMediaAssetId: formData.get("coverImageMediaAssetId")
  });

  if (!validation.ok) {
    redirect(`/admin/blog/new?error=${validation.code}`);
  }

  let coverImagePath: string | null = null;

  if (validation.data.coverImage.kind === "media_asset") {
    const mediaAssetId = validation.data.coverImage.mediaAssetId;
    const mediaAssets = await listAdminMediaAssets();
    const mediaAsset = mediaAssets.find(
      (asset) => asset.id === mediaAssetId
    );

    if (mediaAsset === undefined) {
      redirect("/admin/blog/new?error=cover_media_missing");
    }

    coverImagePath = mediaAsset.filePath;
  }

  let createdBlogPostId: string | null = null;

  try {
    const blogPost = await createAdminBlogPost({
      title: validation.data.title,
      slug: validation.data.slug,
      excerpt: validation.data.excerpt,
      content: validation.data.content,
      seoTitle: validation.data.seoTitle,
      seoDescription: validation.data.seoDescription,
      coverImagePath,
      status: validation.data.status
    });
    createdBlogPostId = blogPost.id;
  } catch (error) {
    if (
      error instanceof AdminBlogRepositoryError &&
      error.code === "slug_taken"
    ) {
      redirect("/admin/blog/new?error=slug_taken");
    }

    console.error(error);
    redirect("/admin/blog/new?error=save_failed");
  }

  if (createdBlogPostId === null) {
    redirect("/admin/blog/new?error=save_failed");
  }

  redirect(`/admin/blog/${createdBlogPostId}?status=created`);
}
