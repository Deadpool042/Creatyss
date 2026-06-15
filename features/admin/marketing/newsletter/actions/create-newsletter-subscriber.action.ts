"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createNewsletterSubscriberSchema } from "@/features/admin/marketing/newsletter/schemas/create-newsletter-subscriber.schema";
import { ADMIN_NEWSLETTER_PATH } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

/**
 * Crée un `NewsletterSubscriber` (niveau `basic`, ajout manuel depuis
 * l'admin, statut initial SUBSCRIBED). Cf.
 * `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`.
 *
 * Aucune `NewsletterCampaign` n'est créée ou envoyée — référentiel
 * uniquement.
 */
export async function createNewsletterSubscriberAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  const firstNameRaw = String(formData.get("firstName") ?? "").trim();
  const lastNameRaw = String(formData.get("lastName") ?? "").trim();

  const parsed = createNewsletterSubscriberSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    firstName: firstNameRaw.length > 0 ? firstNameRaw : null,
    lastName: lastNameRaw.length > 0 ? lastNameRaw : null,
  });

  if (!parsed.success) {
    redirect(`${ADMIN_NEWSLETTER_PATH}?newsletter_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    redirect(`${ADMIN_NEWSLETTER_PATH}?newsletter_error=missing_store`);
  }

  const data = parsed.data;

  try {
    await db.newsletterSubscriber.create({
      data: {
        storeId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        status: "SUBSCRIBED",
        source: "admin",
        subscribedAt: new Date(),
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_NEWSLETTER_PATH}?newsletter_error=duplicate_email`);
    }

    console.error(error);
    redirect(`${ADMIN_NEWSLETTER_PATH}?newsletter_error=create_failed`);
  }

  revalidatePath(ADMIN_NEWSLETTER_PATH);
  redirect(`${ADMIN_NEWSLETTER_PATH}?newsletter_created=1`);
}
