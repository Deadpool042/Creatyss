"use server";

import { redirect } from "next/navigation";
import { updateOrderStatusSchema } from "@/features/admin/orders/schemas/update-order-status.schema";
import { updateAdminOrderStatus } from "@/features/admin/orders/services/update-admin-order-status.service";
import { AdminOrderServiceError } from "@/features/admin/orders/services/admin-order-service.errors";

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  const parsed = updateOrderStatusSchema.safeParse({
    orderId: String(formData.get("orderId") ?? ""),
    nextStatus: String(formData.get("nextStatus") ?? ""),
  });

  if (!parsed.success) {
    redirect("/admin/commerce/orders?error=invalid_order_action");
  }

  try {
    await updateAdminOrderStatus(parsed.data);
  } catch (error) {
    if (error instanceof AdminOrderServiceError && error.code === "missing_order") {
      redirect("/admin/commerce/orders?error=missing_order");
    }

    if (error instanceof AdminOrderServiceError && error.code === "invalid_status_transition") {
      redirect(`/admin/commerce/orders/${parsed.data.orderId}?order_error=invalid_transition`);
    }

    console.error(error);
    redirect(`/admin/commerce/orders/${parsed.data.orderId}?order_error=update_failed`);
  }

  redirect(`/admin/commerce/orders/${parsed.data.orderId}?order_status=updated`);
}
