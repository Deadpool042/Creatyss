"use server";

import { redirect } from "next/navigation";
import { deleteAdminBlogPost } from "../services";
import { getAdminBlogPostById } from "../queries";

function normalizeBlogPostId(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export async function deleteBlogPostAction(formData: FormData): Promise<void> {
  const blogPostId = normalizeBlogPostId(formData.get("blogPostId"));

  if (blogPostId === null) {
    redirect("/admin/content/blog?error=missing_blog_post");
  }

  const blogPost = await getAdminBlogPostById(blogPostId);

  if (blogPost === null) {
    redirect("/admin/content/blog?error=missing_blog_post");
  }

  try {
    const wasDeleted = await deleteAdminBlogPost(blogPostId);

    if (!wasDeleted) {
      redirect("/admin/content/blog?error=missing_blog_post");
    }
  } catch (error: unknown) {
    console.error(error);
    redirect(`/admin/content/blog/${blogPostId}?error=delete_failed`);
  }

  redirect("/admin/content/blog?status=deleted");
}
