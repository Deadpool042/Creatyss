import type { ReturnRequestStatus } from "@/prisma-generated/client";

export type OrderLineForReturn = {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
};

export type AdminReturnItem = {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
};

export type AdminReturnSummary = {
  id: string;
  returnNumber: string;
  status: ReturnRequestStatus;
  createdAtLabel: string;
  items: ReadonlyArray<AdminReturnItem>;
};

const STATUS_LABELS: Record<ReturnRequestStatus, string> = {
  REQUESTED: "Demandé",
  UNDER_REVIEW: "En examen",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
  RECEIVED: "Reçu",
  REFUNDED: "Remboursé",
  CLOSED: "Clôturé",
  CANCELLED: "Annulé",
  ARCHIVED: "Archivé",
};

export function getReturnStatusLabel(status: ReturnRequestStatus): string {
  return STATUS_LABELS[status];
}
