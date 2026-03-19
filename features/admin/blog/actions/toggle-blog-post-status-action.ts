"use server";

import { redirect } from "next/navigation";
import {
  findAdminBlogPostById,
  toggleAdminBlogPostStatus,
} from "@/db/repositories/admin-blog.repository";
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

export async function toggleBlogPostStatusAction(formData: FormData): Promise<void> {
  const postId = normalizeBlogPostId(formData.get("postId"));

  if (postId === null) {
    redirect("/admin/blog?error=missing_blog_post");
  }

  const post = await findAdminBlogPostById(postId);

  if (post === null) {
    redirect("/admin/blog?error=missing_blog_post");
  }

  // If toggling draft → published, validate publishability first
  if (post.status === "draft") {
    const publishability = getBlogPostPublishability({ content: post.content });

    if (!publishability.ok) {
      redirect(`/admin/blog/${postId}?error=${publishability.code}`);
    }
  }

  const newStatus = await toggleAdminBlogPostStatus(postId);

  if (newStatus === null) {
    redirect("/admin/blog?error=missing_blog_post");
  }

  redirect(`/admin/blog/${postId}?status=updated`);
}
