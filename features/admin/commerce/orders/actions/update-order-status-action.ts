"use server";

import { redirect } from "next/navigation";
import { updateOrderStatusSchema } from "@/features/admin/commerce/orders/schemas/update-order-status.schema";
import { updateAdminOrderStatus } from "@/features/admin/commerce/orders/services/update-admin-order-status.service";
import { AdminOrderServiceError } from "@/features/admin/commerce/orders/services/admin-order-service.errors";
import {
  ADMIN_ORDERS_LIST_PATH,
  getAdminOrderDetailPath,
} from "@/features/admin/commerce/orders/shared/admin-orders-routes";

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  const parsed = updateOrderStatusSchema.safeParse({
    orderId: String(formData.get("orderId") ?? ""),
    nextStatus: String(formData.get("nextStatus") ?? ""),
  });

  if (!parsed.success) {
    redirect(`${ADMIN_ORDERS_LIST_PATH}?error=invalid_order_action`);
  }

  try {
    await updateAdminOrderStatus(parsed.data);
  } catch (error) {
    if (error instanceof AdminOrderServiceError && error.code === "missing_order") {
      redirect(`${ADMIN_ORDERS_LIST_PATH}?error=missing_order`);
    }

    if (error instanceof AdminOrderServiceError && error.code === "invalid_status_transition") {
      redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_error=invalid_transition`);
    }

    console.error(error);
    redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_error=update_failed`);
  }

  redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_status=updated`);
}
