"use server";

import { redirect } from "next/navigation";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { AdminHomepageServiceError } from "../types";
import { publishAdminHomepage } from "../services/publish-admin-homepage.service";

export async function publishHomepageAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  const homepageId = formData.get("homepageId");

  if (typeof homepageId !== "string" || homepageId.trim().length === 0) {
    redirect("/admin/content/homepage?error=save_failed");
  }

  try {
    await publishAdminHomepage({
      id: homepageId,
    });
  } catch (error: unknown) {
    if (error instanceof AdminHomepageServiceError && error.code === "homepage_missing") {
      redirect("/admin/content/homepage?error=missing_homepage");
    }

    console.error(error);
    redirect("/admin/content/homepage?error=save_failed");
  }

  redirect("/admin/content/homepage?status=published");
}
