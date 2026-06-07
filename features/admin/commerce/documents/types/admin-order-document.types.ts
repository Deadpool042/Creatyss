export type AdminOrderDocumentTypeCode =
  | "INVOICE"
  | "ORDER_CONFIRMATION"
  | "CREDIT_NOTE"
  | "DELIVERY_NOTE"
  | "RECEIPT"
  | "OTHER";

export type AdminOrderDocumentStatus =
  | "DRAFT"
  | "GENERATED"
  | "ISSUED"
  | "SENT"
  | "CANCELLED"
  | "ARCHIVED";

export type AdminOrderDocumentSummary = {
  id: string;
  typeCode: AdminOrderDocumentTypeCode;
  status: AdminOrderDocumentStatus;
  documentNumber: string | null;
  issuedAt: Date | null;
  createdAt: Date;
};

const DOCUMENT_TYPE_LABELS: Record<AdminOrderDocumentTypeCode, string> = {
  INVOICE: "Facture",
  ORDER_CONFIRMATION: "Confirmation de commande",
  CREDIT_NOTE: "Avoir",
  DELIVERY_NOTE: "Bon de préparation",
  RECEIPT: "Reçu",
  OTHER: "Document",
};

const DOCUMENT_STATUS_LABELS: Record<AdminOrderDocumentStatus, string> = {
  DRAFT: "Brouillon",
  GENERATED: "Généré",
  ISSUED: "Émis",
  SENT: "Envoyé",
  CANCELLED: "Annulé",
  ARCHIVED: "Archivé",
};

export function getDocumentTypeLabel(typeCode: AdminOrderDocumentTypeCode): string {
  return DOCUMENT_TYPE_LABELS[typeCode];
}

export function getDocumentStatusLabel(status: AdminOrderDocumentStatus): string {
  return DOCUMENT_STATUS_LABELS[status];
}
