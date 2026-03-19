"use server";

import { redirect } from "next/navigation";
import {
  AdminBlogRepositoryError,
  deleteAdminBlogPost,
  findAdminBlogPostById,
} from "@/db/repositories/admin-blog.repository";

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

export async function deleteBlogPostAction(formData: FormData): Promise<void> {
  const blogPostId = normalizeBlogPostId(formData.get("blogPostId"));

  if (blogPostId === null) {
    redirect("/admin/blog?error=missing_blog_post");
  }

  const blogPost = await findAdminBlogPostById(blogPostId);

  if (blogPost === null) {
    redirect("/admin/blog?error=missing_blog_post");
  }

  try {
    const wasDeleted = await deleteAdminBlogPost(blogPostId);

    if (!wasDeleted) {
      redirect("/admin/blog?error=missing_blog_post");
    }
  } catch (error) {
    if (error instanceof AdminBlogRepositoryError && error.code === "blog_post_referenced") {
      redirect(`/admin/blog/${blogPostId}?error=referenced`);
    }

    console.error(error);
    redirect(`/admin/blog/${blogPostId}?error=delete_failed`);
  }

  redirect("/admin/blog?status=deleted");
}
