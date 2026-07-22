"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { slugifyLabel } from "@/entities/shared/slug/slugify-label";
import { createPublicEventSchema } from "@/features/admin/marketing/public-events/schemas/create-public-event.schema";
import {
  ADMIN_PUBLIC_EVENTS_PATH,
  getAdminPublicEventDetailPath,
} from "@/features/admin/marketing/public-events/shared/admin-public-events-routes";
import { recordPublicEventUpdatedDomainEvent } from "@/features/admin/marketing/public-events/services/record-public-event-domain-events";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

/**
 * Met à jour un `PublicEvent` (marché) existant.
 */
export async function updatePublicEventAction(
  publicEventId: string,
  formData: FormData
): Promise<void> {
  await requireAuthenticatedAdmin();

  const detailPath = getAdminPublicEventDetailPath(publicEventId);

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
    redirect(`${detailPath}?public_event_error=invalid_input`);
  }

  const existing = await db.publicEvent.findUnique({
    where: { id: publicEventId },
    select: { id: true, storeId: true, archivedAt: true },
  });

  if (!existing || existing.archivedAt) {
    redirect(`${ADMIN_PUBLIC_EVENTS_PATH}?public_event_error=not_found`);
  }

  const data = parsed.data;

  try {
    const updated = await db.publicEvent.update({
      where: { id: publicEventId },
      data: {
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

    await recordPublicEventUpdatedDomainEvent({
      storeId: existing.storeId,
      publicEvent: {
        id: updated.id,
        slug: updated.slug,
        title: updated.title,
        startsAt: updated.startsAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${detailPath}?public_event_error=duplicate_slug`);
    }

    console.error(error);
    redirect(`${detailPath}?public_event_error=update_failed`);
  }

  revalidatePath(ADMIN_PUBLIC_EVENTS_PATH);
  revalidatePath(detailPath);
  redirect(`${detailPath}?public_event_updated=1`);
}
