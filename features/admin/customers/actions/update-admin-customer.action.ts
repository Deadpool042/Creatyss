"use server";

import { revalidatePath } from "next/cache";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { ADMIN_CUSTOMERS_LIST_PATH, getAdminCustomerDetailPath } from "../shared";
import {
  updateAdminCustomerSchema,
  type UpdateAdminCustomerFormState,
} from "../schemas";

export async function updateAdminCustomerAction(
  customerId: string,
  _prevState: UpdateAdminCustomerFormState,
  formData: FormData
): Promise<UpdateAdminCustomerFormState> {
  await requireAdminCapability("admin.commerce.customers.write");

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { status: "error", message: "Aucun store actif trouvé." };
  }

  const parsed = updateAdminCustomerSchema.safeParse({
    firstName: formData.get("firstName") ?? "",
    lastName: formData.get("lastName") ?? "",
    displayName: formData.get("displayName") ?? "",
    phone: formData.get("phone") ?? "",
    status: formData.get("status") ?? "",
    acceptsEmail: formData.get("acceptsEmail") === "on",
    acceptsSms: formData.get("acceptsSms") === "on",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Partial<
      Record<
        | "firstName"
        | "lastName"
        | "displayName"
        | "phone"
        | "status"
        | "acceptsEmail"
        | "acceptsSms"
        | "notes",
        string
      >
    > = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && fieldErrors[key as keyof typeof fieldErrors] === undefined) {
        fieldErrors[key as keyof typeof fieldErrors] = issue.message;
      }
    }

    return {
      status: "error",
      message: "Formulaire invalide.",
      fieldErrors,
    };
  }

  try {
    const customer = await db.customer.findFirst({
      where: {
        id: customerId,
        storeId,
        archivedAt: null,
        isGuest: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        status: true,
        activatedAt: true,
        blockedAt: true,
      },
    });

    if (customer === null) {
      return { status: "error", message: "Client introuvable." };
    }

    const data = parsed.data;
    const now = new Date();
    const nextStatus = data.status;
    const nextActivatedAt =
      nextStatus === "ACTIVE"
        ? customer.activatedAt ?? now
        : customer.activatedAt;
    const nextBlockedAt =
      nextStatus === "BLOCKED"
        ? customer.blockedAt ?? now
        : null;

    await db.customer.update({
      where: { id: customer.id },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        displayName: data.displayName || null,
        phone: data.phone || null,
        status: nextStatus,
        activatedAt: nextActivatedAt,
        blockedAt: nextBlockedAt,
        archivedAt: null,
        acceptsEmail: data.acceptsEmail,
        acceptsSms: data.acceptsSms,
        notes: data.notes || null,
      },
    });

    revalidatePath(ADMIN_CUSTOMERS_LIST_PATH);
    revalidatePath(
      getAdminCustomerDetailPath({
        ...customer,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        displayName: data.displayName || null,
      })
    );

    return {
      status: "success",
      message: "Client mis à jour.",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la sauvegarde du client.",
    };
  }
}
