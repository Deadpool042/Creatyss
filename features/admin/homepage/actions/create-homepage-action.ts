"use server";

import { redirect } from "next/navigation";
import { createAdminHomepage } from "../services/create-admin-homepage.service";

export async function createHomepageAction(): Promise<void> {
  try {
    await createAdminHomepage();
  } catch (error: unknown) {
    console.error(error);
    redirect("/admin/content/homepage?error=save_failed");
  }

  redirect("/admin/content/homepage?status=created");
}
