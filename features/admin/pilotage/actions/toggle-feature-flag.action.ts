"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { findFeatureCatalogEntry } from "@/features/admin/pilotage/catalog";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

export type ToggleFeatureFlagResult =
  | { ok: true; newStatus: string; message: string }
  | { ok: false; error: string };

export async function toggleFeatureFlagAction(flagId: string): Promise<ToggleFeatureFlagResult> {
  await requireAuthenticatedAdmin();

  const flag = await db.featureFlag.findUnique({
    where: { id: flagId },
    select: { id: true, code: true, status: true, archivedAt: true },
  });

  if (!flag || flag.archivedAt) {
    return { ok: false, error: "Feature flag introuvable." };
  }

  const catalogEntry = findFeatureCatalogEntry(flag.code);

  if (!catalogEntry) {
    return { ok: false, error: "Cette fonctionnalité n'est pas référencée dans le catalogue." };
  }

  if (
    catalogEntry.mutability !== "toggleable" &&
    catalogEntry.mutability !== "level_selectable"
  ) {
    return { ok: false, error: "Cette fonctionnalité ne peut pas être activée/désactivée manuellement." };
  }

  // DRAFT/INACTIVE → ACTIVE, ACTIVE → INACTIVE
  const nextStatus = flag.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await db.$transaction(async (tx) => {
    await tx.featureFlag.update({
      where: { id: flagId },
      data: {
        status: nextStatus as never,
        isEnabledByDefault: nextStatus === "ACTIVE",
      },
    });

    if (flag.code === LOCALIZATION_FEATURE_CODE) {
      if (nextStatus === "ACTIVE") {
        const storeScopedFlag = await tx.featureFlag.findUnique({
          where: { id: flag.id },
          select: { storeId: true },
        });

        if (storeScopedFlag?.storeId) {
          await tx.featureFlagOverride.upsert({
            where: {
              featureFlagId_scopeType_scopeId: {
                featureFlagId: flag.id,
                scopeType: "STORE",
                scopeId: storeScopedFlag.storeId,
              },
            },
            update: {
              isEnabled: true,
              archivedAt: null,
              reasonCode: "advanced-localization-enabled",
              notes:
                "Activation du module localisation depuis /admin/settings/advanced.",
            },
            create: {
              featureFlagId: flag.id,
              scopeType: "STORE",
              scopeId: storeScopedFlag.storeId,
              isEnabled: true,
              reasonCode: "advanced-localization-enabled",
              notes:
                "Activation du module localisation depuis /admin/settings/advanced.",
            },
          });
        }
      } else {
        await tx.featureFlagOverride.updateMany({
          where: {
            featureFlagId: flag.id,
            archivedAt: null,
          },
          data: {
            isEnabled: false,
            archivedAt: new Date(),
          },
        });
      }
    } else {
      await tx.featureFlagOverride.updateMany({
        where: {
          featureFlagId: flag.id,
          archivedAt: null,
        },
        data: {
          isEnabled: nextStatus === "ACTIVE",
        },
      });
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/settings/advanced");
  revalidatePath("/admin/settings/localization");
  revalidatePath("/admin/settings/localization/translations");
  revalidatePath("/", "layout");

  return {
    ok: true,
    newStatus: nextStatus,
    message: nextStatus === "ACTIVE" ? "Fonctionnalité activée." : "Fonctionnalité désactivée.",
  };
}
