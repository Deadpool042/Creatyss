import type { FulfillmentStatus } from "@/prisma-generated/client";

export type AdminFulfillmentItem = {
  id: string;
  orderLineId: string;
  productName: string;
  quantity: number;
};

export type AdminFulfillmentSummary = {
  id: string;
  status: FulfillmentStatus;
  fulfilledAtLabel: string | null;
  createdAtLabel: string;
  items: ReadonlyArray<AdminFulfillmentItem>;
};

const STATUS_LABELS: Record<FulfillmentStatus, string> = {
  PENDING: "À préparer",
  READY: "Prête",
  PARTIALLY_FULFILLED: "Partiellement préparée",
  FULFILLED: "Préparée",
  CANCELLED: "Annulée",
  ARCHIVED: "Archivée",
};

export function getFulfillmentStatusLabel(status: FulfillmentStatus): string {
  return STATUS_LABELS[status];
}
