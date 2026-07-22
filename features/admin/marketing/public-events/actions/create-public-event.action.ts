"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { slugifyLabel } from "@/entities/shared/slug/slugify-label";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createPublicEventSchema } from "@/features/admin/marketing/public-events/schemas/create-public-event.schema";
import { ADMIN_PUBLIC_EVENTS_PATH } from "@/features/admin/marketing/public-events/shared/admin-public-events-routes";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

/**
 * Crée un `PublicEvent` (marché) — module `engagement.public-events`,
 * feature flag non gradué.
 */
export async function createPublicEventAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  const titleRaw = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const shortDescriptionRaw = String(formData.get("shortDescription") ?? "").trim();
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const startsAtRaw = String(formData.get("startsAt") ?? "").trim();
  const endsAtRaw = String(formData.get("endsAt") ?? "").trim();
  const locationNameRaw = String(formData.get("locationName") ?? "").trim();
  const locationAddressRaw = String(formData.get("locationAddress") ?? "").trim();
  const hasSpecialConditions = formData.get("hasSpecialConditions") === "on";
  const specialConditionsNoteRaw = String(formData.get("specialConditionsNote") ?? "").trim();

  const resolvedSlug = slugifyLabel(slugRaw.length > 0 ? slugRaw : titleRaw);

  const parsed = createPublicEventSchema.safeParse({
    title: titleRaw,
    slug: resolvedSlug,
    shortDescription: shortDescriptionRaw.length > 0 ? shortDescriptionRaw : null,
    description: descriptionRaw.length > 0 ? descriptionRaw : null,
    startsAt: startsAtRaw.length > 0 ? new Date(startsAtRaw) : new Date(NaN),
    endsAt: endsAtRaw.length > 0 ? new Date(endsAtRaw) : null,
    locationName: locationNameRaw,
    locationAddress: locationAddressRaw.length > 0 ? locationAddressRaw : null,
    hasSpecialConditions,
    specialConditionsNote: specialConditionsNoteRaw.length > 0 ? specialConditionsNoteRaw : null,
  });

  if (!parsed.success || Number.isNaN(parsed.data.startsAt.getTime())) {
    redirect(`${ADMIN_PUBLIC_EVENTS_PATH}?public_event_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    redirect(`${ADMIN_PUBLIC_EVENTS_PATH}?public_event_error=missing_store`);
  }

  const data = parsed.data;

  try {
    // Créé en DRAFT (défaut Prisma) : pas de diffusion marketing tant que le
    // marché n'est pas publié via togglePublicEventStatusAction (ACTIVE).
    await db.publicEvent.create({
      data: {
        storeId,
        code: data.slug,
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        locationName: data.locationName,
        locationAddress: data.locationAddress,
        hasSpecialConditions: data.hasSpecialConditions,
        specialConditionsNote: data.specialConditionsNote,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_PUBLIC_EVENTS_PATH}?public_event_error=duplicate_slug`);
    }

    console.error(error);
    redirect(`${ADMIN_PUBLIC_EVENTS_PATH}?public_event_error=create_failed`);
  }

  revalidatePath(ADMIN_PUBLIC_EVENTS_PATH);
  redirect(`${ADMIN_PUBLIC_EVENTS_PATH}?public_event_created=1`);
}
