"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { createAdminBlogPost } from "../services/create-admin-blog-post.service";
import { BlogPostFormSchema } from "../schemas/blog-post-form-schema";
import { AdminBlogServiceError } from "../types";

export async function createBlogPostAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();
  const parsed = BlogPostFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    redirect("/admin/content/blog/new?error=validation");
  }

  const data = parsed.data;

  try {
    const post = await createAdminBlogPost({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      primaryImagePath: data.primaryImagePath,
      coverImagePath: data.coverImagePath,
      status: "draft",
    });

    redirect(`/admin/content/blog/${post.id}`);
  } catch (error) {
    if (error instanceof AdminBlogServiceError && error.code === "slug_taken") {
      redirect("/admin/content/blog/new?error=slug_taken");
    }

    throw error;
  }
}
