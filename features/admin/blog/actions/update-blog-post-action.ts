"use server";

import { redirect } from "next/navigation";
import { listAdminMediaAssets } from "@/db/admin-media";
import {
  AdminBlogRepositoryError,
  updateAdminBlogPost,
} from "@/db/repositories/admin-blog.repository";
import { normalizeBlogPostSlug } from "@/entities/blog/blog-post-input";
import { getBlogPostPublishability } from "@/entities/blog/blog-post-publishability";

import { BlogPostFormSchema, parseCoverImageSelection } from "../schemas/blog-post-form-schema";

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

function mapBlogPostFormError(field: PropertyKey | undefined): string {
  switch (field) {
    case "title":
      return "missing_title";
    case "slug":
      return "missing_slug";
    case "status":
      return "invalid_status";
    default:
      return "save_failed";
  }
}

export async function updateBlogPostAction(formData: FormData): Promise<void> {
  const blogPostId = normalizeBlogPostId(formData.get("blogPostId"));

  if (blogPostId === null) {
    redirect("/admin/blog?error=missing_blog_post");
  }

  const parsed = BlogPostFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    coverImageMediaAssetId: formData.get("coverImageMediaAssetId"),
    currentCoverImagePath: formData.get("currentCoverImagePath"),
  });

  if (!parsed.success) {
    const code = mapBlogPostFormError(parsed.error.issues[0]?.path[0]);
    redirect(`/admin/blog/${blogPostId}?error=${code}`);
  }

  const slug = normalizeBlogPostSlug(parsed.data.slug);

  if (slug.length === 0) {
    redirect(`/admin/blog/${blogPostId}?error=invalid_slug`);
  }

  if (parsed.data.status === "published") {
    const publishability = getBlogPostPublishability({
      content: parsed.data.content,
    });

    if (!publishability.ok) {
      redirect(`/admin/blog/${blogPostId}?error=${publishability.code}`);
    }
  }

  const coverImage = parseCoverImageSelection(
    parsed.data.coverImageMediaAssetId,
    parsed.data.currentCoverImagePath
  );

  if (!coverImage.ok) {
    redirect(`/admin/blog/${blogPostId}?error=invalid_cover_image`);
  }

  let coverImagePath: string | null = null;

  if (coverImage.data.kind === "keep_current") {
    coverImagePath = coverImage.data.filePath;
  } else if (coverImage.data.kind === "media_asset") {
    const mediaAssetId = coverImage.data.mediaAssetId;
    const mediaAssets = await listAdminMediaAssets();
    const mediaAsset = mediaAssets.find((asset) => asset.id === mediaAssetId);

    if (mediaAsset === undefined) {
      redirect(`/admin/blog/${blogPostId}?error=cover_media_missing`);
    }

    coverImagePath = mediaAsset.filePath;
  }

  try {
    const blogPost = await updateAdminBlogPost({
      id: blogPostId,
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      seoTitle: parsed.data.seoTitle,
      seoDescription: parsed.data.seoDescription,
      coverImagePath,
      status: parsed.data.status,
    });

    if (blogPost === null) {
      redirect("/admin/blog?error=missing_blog_post");
    }
  } catch (error) {
    if (error instanceof AdminBlogRepositoryError && error.code === "slug_taken") {
      redirect(`/admin/blog/${blogPostId}?error=slug_taken`);
    }

    console.error(error);
    redirect(`/admin/blog/${blogPostId}?error=save_failed`);
  }

  redirect(`/admin/blog/${blogPostId}?status=updated`);
}
