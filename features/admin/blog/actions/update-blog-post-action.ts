"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { updateAdminBlogPost } from "../services/update-admin-blog-post.service";
import { BlogPostFormSchema } from "../schemas/blog-post-form-schema";
import { AdminBlogServiceError } from "../types";

export async function updateBlogPostAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();
  const raw = formData.get("postId");

  if (typeof raw !== "string" || !raw.trim()) {
    redirect("/admin/content/blog?error=missing_blog_post");
  }

  const id = raw.trim();

  const parsed = BlogPostFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirect(`/admin/content/blog/${id}?error=validation`);
  }

  const data = parsed.data;

  try {
    const result = await updateAdminBlogPost({
      id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      primaryImagePath: data.primaryImagePath,
      coverImagePath: data.coverImagePath,
      status: data.status,
    });

    if (result === null) {
      redirect("/admin/content/blog?error=missing_blog_post");
    }

    redirect(`/admin/content/blog/${id}`);
  } catch (error) {
    if (error instanceof AdminBlogServiceError && error.code === "slug_taken") {
      redirect(`/admin/content/blog/${id}?error=slug_taken`);
    }

    throw error;
  }
}
