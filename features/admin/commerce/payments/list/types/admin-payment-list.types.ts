export type AdminPaymentStatus = "pending" | "captured" | "cancelled" | "unknown";

export type AdminPaymentMethodType = "bank_transfer" | "cash_on_delivery" | "card" | "wallet" | "other";

export type AdminPaymentSummary = {
  id: string;
  orderId: string;
  orderReference: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  amountAuthorized: string;
  amountCaptured: string | null;
  currencyCode: string;
  status: AdminPaymentStatus;
  methodType: AdminPaymentMethodType;
  createdAt: string;
  capturedAt: string | null;
  cancelledAt: string | null;
};

export type AdminPaymentListFilters = {
  status?: readonly AdminPaymentStatus[];
  page?: number;
  perPage?: number;
};

export type AdminPaymentListResult = {
  items: readonly AdminPaymentSummary[];
  total: number;
  totalPages: number;
  currentPage: number;
};
