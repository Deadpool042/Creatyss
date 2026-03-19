"use server";

import { redirect } from "next/navigation";
import { updateOrderStatus } from "@/db/repositories/order.repository";
import { OrderRepositoryError } from "@/db/repositories/order.types";
import type { OrderStatus } from "@/entities/order/order-status-transition";

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

function normalizeOrderStatus(value: FormDataEntryValue | null): OrderStatus | null {
  if (typeof value !== "string") {
    return null;
  }

  switch (value.trim()) {
    case "pending":
    case "paid":
    case "preparing":
    case "cancelled":
      return value.trim() as OrderStatus;
    default:
      return null;
  }
}

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  const orderId = normalizeNumericId(formData.get("orderId"));
  const nextStatus = normalizeOrderStatus(formData.get("nextStatus"));

  if (orderId === null || nextStatus === null) {
    redirect("/admin/orders?error=invalid_order_action");
  }

  try {
    const updatedStatus = await updateOrderStatus({
      id: orderId,
      nextStatus,
    });

    if (updatedStatus === null) {
      redirect("/admin/orders?error=missing_order");
    }
  } catch (error) {
    if (error instanceof OrderRepositoryError && error.code === "missing_order") {
      redirect("/admin/orders?error=missing_order");
    }

    if (error instanceof OrderRepositoryError && error.code === "invalid_status_transition") {
      redirect(`/admin/orders/${orderId}?order_error=invalid_transition`);
    }

    console.error(error);
    redirect(`/admin/orders/${orderId}?order_error=update_failed`);
  }

  redirect(`/admin/orders/${orderId}?order_status=updated`);
}
