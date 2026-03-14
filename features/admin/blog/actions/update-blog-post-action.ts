"use server";

import { redirect } from "next/navigation";
import { listAdminMediaAssets } from "@/db/admin-media";
import {
  AdminBlogRepositoryError,
  updateAdminBlogPost
} from "@/db/repositories/admin-blog.repository";
import { validateBlogPostInput } from "@/entities/blog/blog-post-input";
import { getBlogPostPublishability } from "@/entities/blog/blog-post-publishability";

function normalizeBlogPostId(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export async function updateBlogPostAction(formData: FormData): Promise<void> {
  const blogPostId = normalizeBlogPostId(formData.get("blogPostId"));

  if (blogPostId === null) {
    redirect("/admin/blog?error=missing_blog_post");
  }

  const validation = validateBlogPostInput({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    currentCoverImagePath: formData.get("currentCoverImagePath"),
    coverImageMediaAssetId: formData.get("coverImageMediaAssetId")
  });

  if (!validation.ok) {
    redirect(`/admin/blog/${blogPostId}?error=${validation.code}`);
  }

  if (validation.data.status === "published") {
    const publishability = getBlogPostPublishability({
      content: validation.data.content,
    });

    if (!publishability.ok) {
      redirect(`/admin/blog/${blogPostId}?error=${publishability.code}`);
    }
  }

  let coverImagePath: string | null = null;

  if (validation.data.coverImage.kind === "keep_current") {
    coverImagePath = validation.data.coverImage.filePath;
  } else if (validation.data.coverImage.kind === "media_asset") {
    const mediaAssetId = validation.data.coverImage.mediaAssetId;
    const mediaAssets = await listAdminMediaAssets();
    const mediaAsset = mediaAssets.find(
      (asset) => asset.id === mediaAssetId
    );

    if (mediaAsset === undefined) {
      redirect(`/admin/blog/${blogPostId}?error=cover_media_missing`);
    }

    coverImagePath = mediaAsset.filePath;
  }

  try {
    const blogPost = await updateAdminBlogPost({
      id: blogPostId,
      title: validation.data.title,
      slug: validation.data.slug,
      excerpt: validation.data.excerpt,
      content: validation.data.content,
      seoTitle: validation.data.seoTitle,
      seoDescription: validation.data.seoDescription,
      coverImagePath,
      status: validation.data.status
    });

    if (blogPost === null) {
      redirect("/admin/blog?error=missing_blog_post");
    }
  } catch (error) {
    if (
      error instanceof AdminBlogRepositoryError &&
      error.code === "slug_taken"
    ) {
      redirect(`/admin/blog/${blogPostId}?error=slug_taken`);
    }

    console.error(error);
    redirect(`/admin/blog/${blogPostId}?error=save_failed`);
  }

  redirect(`/admin/blog/${blogPostId}?status=updated`);
}
