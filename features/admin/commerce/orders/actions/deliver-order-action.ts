"use server";

import { redirect } from "next/navigation";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { deliverOrderSchema } from "@/features/admin/commerce/orders/schemas/deliver-order.schema";
import { deliverAdminOrder } from "@/features/admin/commerce/orders/services/deliver-admin-order.service";
import { AdminOrderServiceError } from "@/features/admin/commerce/orders/services/admin-order-service.errors";
import {
  ADMIN_ORDERS_LIST_PATH,
  getAdminOrderDetailPath,
} from "@/features/admin/commerce/orders/shared/admin-orders-routes";

export async function deliverOrderAction(formData: FormData): Promise<void> {
  const parsed = deliverOrderSchema.safeParse({
    orderId: String(formData.get("orderId") ?? ""),
  });

  if (!parsed.success) {
    redirect(`${ADMIN_ORDERS_LIST_PATH}?error=invalid_order_action`);
  }

  if (!(await meetsFeatureLevel("commerce.shipping", "delivery"))) {
    redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_error=shipping_level_insufficient`);
  }

  try {
    await deliverAdminOrder(parsed.data);
  } catch (error) {
    if (error instanceof AdminOrderServiceError && error.code === "missing_order") {
      redirect(`${ADMIN_ORDERS_LIST_PATH}?error=missing_order`);
    }

    if (error instanceof AdminOrderServiceError && error.code === "invalid_shipment_transition") {
      redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_error=invalid_transition`);
    }

    console.error(error);
    redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_error=deliver_failed`);
  }

  redirect(`${getAdminOrderDetailPath(parsed.data.orderId)}?order_status=delivered`);
}
