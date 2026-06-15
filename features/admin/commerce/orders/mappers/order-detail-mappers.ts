import type { OrderStatus } from "@/entities/order/order-status-transition";

import {
  type OrderDetailSearchParams,
  type AdminOrderDetail,
  type OrderEmailEventStatus,
} from "../types/order-detail-types";

const orderDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

export function readOrderDetailSearchParam(
  searchParams: OrderDetailSearchParams,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getOrderDetailStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Le statut de la commande a été mis à jour.";
    case "shipped":
      return "La commande a été marquée comme expédiée.";
    case "delivered":
      return "La commande a été marquée comme livrée.";
    default:
      return null;
  }
}

export function getOrderDetailErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "invalid_transition":
      return "Cette transition n'est pas autorisée.";
    case "ship_failed":
      return "La commande n'a pas pu être marquée comme expédiée.";
    case "deliver_failed":
      return "La commande n'a pas pu être marquée comme livrée.";
    case "update_failed":
      return "La commande n'a pas pu être mise à jour.";
    default:
      return null;
  }
}

export function formatOrderDateTime(value: string): string {
  return orderDateTimeFormatter.format(new Date(value));
}

export function formatOptionalOrderDateTime(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  return formatOrderDateTime(value);
}

export function getOrderTransitionLabel(status: OrderStatus): string {
  switch (status) {
    case "preparing":
      return "Marquer en préparation";
    case "cancelled":
      return "Annuler la commande";
    default:
      return status;
  }
}

export function getEmailEventLabel(eventType: string): string {
  switch (eventType) {
    case "payment_succeeded":
      return "Paiement réussi";
    case "order_shipped":
      return "Commande expédiée";
    case "order_created":
    default:
      return "Commande créée";
  }
}

export function getEmailEventStatusLabel(status: OrderEmailEventStatus): string {
  switch (status) {
    case "sent":
      return "Envoyé";
    case "failed":
      return "Échec";
    case "pending":
    default:
      return "En attente";
  }
}

type EmailFailurePresentation = {
  title: string;
  summary: string;
  technicalDetail: string;
};

function getEmailEventAudienceLabel(eventType: string): string {
  switch (eventType) {
    case "payment_succeeded":
      return "L'email de confirmation de paiement";
    case "order_shipped":
      return "L'email d'expédition";
    case "order_created":
    default:
      return "L'email de confirmation";
  }
}

function normalizeTechnicalDetail(lastError: string): string {
  return lastError.trim().replace(/\s+/g, " ");
}

function getProviderDiagnosticSummary(input: {
  provider: AdminOrderDetail["emailEvents"][number]["provider"];
  technicalDetail: string;
}): string {
  const normalizedDetail = input.technicalDetail.toLowerCase();

  if (
    input.provider === "brevo" &&
    (normalizedDetail.includes("authorised_ips") ||
      normalizedDetail.includes("unauthorized") ||
      normalizedDetail.includes("unrecognised ip"))
  ) {
    return "Le service d'envoi a refusé la requête. Une vérification de configuration du provider est nécessaire.";
  }

  if (input.provider === "brevo") {
    return "Le service d'envoi Brevo a rejeté l'envoi. Vérifiez la configuration technique du provider.";
  }

  if (input.provider === "resend") {
    return "Le service d'envoi Resend a rejeté l'envoi. Vérifiez la configuration technique du provider.";
  }

  return "Le service d'envoi a rejeté l'opération. Vérifiez la configuration technique du provider.";
}

export function getEmailEventFailurePresentation(
  emailEvent: AdminOrderDetail["emailEvents"][number]
): EmailFailurePresentation | null {
  if (emailEvent.lastError === null) {
    return null;
  }

  const technicalDetail = normalizeTechnicalDetail(emailEvent.lastError);
  const title = `${getEmailEventAudienceLabel(emailEvent.eventType)} n'a pas pu être envoyé.`;

  return {
    title,
    summary: getProviderDiagnosticSummary({
      provider: emailEvent.provider,
      technicalDetail,
    }),
    technicalDetail,
  };
}
