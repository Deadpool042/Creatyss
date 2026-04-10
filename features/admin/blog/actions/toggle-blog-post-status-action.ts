"use server";

import { redirect } from "next/navigation";
import { getAdminBlogPostById } from "../queries";
import { toggleAdminBlogPostStatus } from "../services";
import { getBlogPostPublishability } from "@/entities/blog/blog-post-publishability";

function normalizeBlogPostId(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export async function toggleBlogPostStatusAction(formData: FormData): Promise<void> {
  const postId = normalizeBlogPostId(formData.get("postId"));

  if (postId === null) {
    redirect("/admin/content/blog?error=missing_blog_post");
  }

  const post = await getAdminBlogPostById(postId);

  if (post === null) {
    redirect("/admin/content/blog?error=missing_blog_post");
  }

  if (post.status === "draft") {
    const publishability = getBlogPostPublishability({ content: post.content });

    if (!publishability.ok) {
      redirect(`/admin/content/blog/${postId}?error=${publishability.code}`);
    }
  }

  const newStatus = await toggleAdminBlogPostStatus(postId);

  if (newStatus === null) {
    redirect("/admin/content/blog?error=missing_blog_post");
  }

  redirect(`/admin/content/blog/${postId}?status=updated`);
}
