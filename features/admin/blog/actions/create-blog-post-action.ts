"use server";

import { redirect } from "next/navigation";
import { listAdminMediaAssets } from "@/db/repositories/admin-media.repository";
import {
  AdminBlogRepositoryError,
  createAdminBlogPost,
} from "@/db/repositories/admin-blog.repository";
import { normalizeBlogPostSlug } from "@/entities/blog/blog-post-input";

import { BlogPostFormSchema, parseCoverImageSelection } from "../schemas/blog-post-form-schema";

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

export async function createBlogPostAction(formData: FormData): Promise<void> {
  const parsed = BlogPostFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    coverImageMediaAssetId: formData.get("coverImageMediaAssetId"),
    currentCoverImagePath: null,
  });

  if (!parsed.success) {
    const code = mapBlogPostFormError(parsed.error.issues[0]?.path[0]);
    redirect(`/admin/blog/new?error=${code}`);
  }

  const slug = normalizeBlogPostSlug(parsed.data.slug);

  if (slug.length === 0) {
    redirect("/admin/blog/new?error=invalid_slug");
  }

  const coverImage = parseCoverImageSelection(
    parsed.data.coverImageMediaAssetId,
    parsed.data.currentCoverImagePath
  );

  if (!coverImage.ok) {
    redirect("/admin/blog/new?error=invalid_cover_image");
  }

  let coverImagePath: string | null = null;

  if (coverImage.data.kind === "media_asset") {
    const mediaAssetId = coverImage.data.mediaAssetId;
    const mediaAssets = await listAdminMediaAssets();
    const mediaAsset = mediaAssets.find((asset) => asset.id === mediaAssetId);

    if (mediaAsset === undefined) {
      redirect("/admin/blog/new?error=cover_media_missing");
    }

    coverImagePath = mediaAsset.filePath;
  }

  let createdBlogPostId: string | null = null;

  try {
    const blogPost = await createAdminBlogPost({
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      seoTitle: parsed.data.seoTitle,
      seoDescription: parsed.data.seoDescription,
      coverImagePath,
      status: parsed.data.status,
    });
    createdBlogPostId = blogPost.id;
  } catch (error) {
    if (error instanceof AdminBlogRepositoryError && error.code === "slug_taken") {
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
