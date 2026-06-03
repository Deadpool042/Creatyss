"use server";

import { redirect } from "next/navigation";
import { sendOrderTransactionalEmail } from "@/features/email";
import { shipOrderSchema } from "@/features/admin/commerce/orders/schemas/ship-order.schema";
import { shipAdminOrder } from "@/features/admin/commerce/orders/services/ship-admin-order.service";
import { AdminOrderServiceError } from "@/features/admin/commerce/orders/services/admin-order-service.errors";
import {
  ADMIN_ORDERS_LIST_PATH,
  getAdminOrderDetailPath,
} from "@/features/admin/commerce/orders/shared/admin-orders-routes";

export async function shipOrderAction(formData: FormData): Promise<void> {
  const trackingReferenceValue = String(formData.get("trackingReference") ?? "").trim();
  const parsed = shipOrderSchema.safeParse({
    orderId: String(formData.get("orderId") ?? ""),
    trackingReference: trackingReferenceValue.length > 0 ? trackingReferenceValue : null,
  });

  if (!parsed.success) {
    redirect(`${ADMIN_ORDERS_LIST_PATH}?error=invalid_order_action`);
  }

  try {
    await shipAdminOrder(parsed.data);

    await sendOrderTransactionalEmail({
      orderId: parsed.data.orderId,
      eventType: "order_shipped",
    });
  } catch (error) {
    if (error instanceof AdminOrderServiceError && error.code === "missing_order") {
      redirect(`${ADMIN_ORDERS_LIST_PATH}?error=missing_order`);
    }

    if (error instanceof AdminOrderServiceError && error.code === "invalid_status_transition") {
      redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_error=invalid_transition`);
    }

    console.error(error);
    redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_error=ship_failed`);
  }

  redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_status=shipped`);
}
