"use server";

import { redirect } from "next/navigation";
import {
  OrderRepositoryError,
  shipOrder
} from "@/db/repositories/order.repository";
import { sendOrderTransactionalEmail } from "@/features/email/send-order-transactional-email";
import { validateShipmentInput } from "@/entities/order/shipment-input";

function normalizeNumericId(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export async function shipOrderAction(formData: FormData): Promise<void> {
  const orderId = normalizeNumericId(formData.get("orderId"));
  const shipmentInput = validateShipmentInput(formData);

  if (orderId === null || !shipmentInput.ok) {
    redirect("/admin/orders?error=invalid_order_action");
  }

  try {
    const updatedStatus = await shipOrder({
      id: orderId,
      trackingReference: shipmentInput.data.trackingReference
    });

    if (updatedStatus === null) {
      redirect("/admin/orders?error=missing_order");
    }

    await sendOrderTransactionalEmail({
      orderId,
      eventType: "order_shipped"
    });
  } catch (error) {
    if (
      error instanceof OrderRepositoryError &&
      error.code === "missing_order"
    ) {
      redirect("/admin/orders?error=missing_order");
    }

    if (
      error instanceof OrderRepositoryError &&
      error.code === "invalid_status_transition"
    ) {
      redirect(`/admin/orders/${orderId}?order_error=invalid_transition`);
    }

    console.error(error);
    redirect(`/admin/orders/${orderId}?order_error=ship_failed`);
  }

  redirect(`/admin/orders/${orderId}?order_status=shipped`);
}
