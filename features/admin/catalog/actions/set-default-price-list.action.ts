"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { withTransaction } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_PRICING_PATH } from "@/features/admin/catalog/shared/admin-pricing-routes";

export async function setDefaultPriceListAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=invalid_input`);
  }

  const priceList = await db.priceList.findUnique({
    where: { id },
    select: { status: true, storeId: true, isDefault: true },
  });

  if (priceList === null) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=not_found`);
  }

  if (priceList.status !== "ACTIVE") {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=not_active`);
  }

  if (priceList.isDefault) {
    // Déjà par défaut, rien à faire
    redirect(ADMIN_PRICING_PATH);
  }

  try {
    await withTransaction(async (tx) => {
      // Retirer isDefault de toutes les listes du même store
      await tx.priceList.updateMany({
        where: { storeId: priceList.storeId, isDefault: true },
        data: { isDefault: false },
      });
      // Définir la nouvelle liste par défaut
      await tx.priceList.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  } catch (error) {
    console.error(error);
    redirect(`${ADMIN_PRICING_PATH}?pl_error=update_failed`);
  }

  revalidatePath(ADMIN_PRICING_PATH);
  redirect(`${ADMIN_PRICING_PATH}?pl_updated=1`);
}
