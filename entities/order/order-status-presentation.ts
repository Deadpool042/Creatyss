import type { OrderStatus } from "@/entities/order/order-status-transition";

export type OrderPaymentStatus = "pending" | "succeeded" | "failed";

export type OrderStatusSummary = {
  title: string;
  description: string;
  nextStep: string;
};

export type OrderStatusNotice =
  | {
      kind: "success" | "alert";
      text: string;
    }
  | null;

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "shipped":
      return "Expédiée";
    case "preparing":
      return "En préparation";
    case "paid":
      return "Payée";
    case "cancelled":
      return "Annulée";
    case "pending":
    default:
      return "En attente";
  }
}

export function getPaymentStatusLabel(status: OrderPaymentStatus): string {
  switch (status) {
    case "succeeded":
      return "Paiement réussi";
    case "failed":
      return "Paiement échoué";
    case "pending":
    default:
      return "Paiement en attente";
  }
}

export function getOrderStatusSummary(input: {
  orderStatus: OrderStatus;
  paymentStatus: OrderPaymentStatus;
}): OrderStatusSummary {
  switch (input.orderStatus) {
    case "cancelled":
      return {
        title: "Commande annulée",
        description: "La commande a été annulée et n'est plus en cours de traitement.",
        nextStep: "Aucune autre action n'est disponible pour cette commande."
      };
    case "shipped":
      return {
        title: "Commande expédiée",
        description: "La commande a quitté l'atelier et est en cours d'acheminement.",
        nextStep:
          "Consultez la date d'expédition et la référence de suivi si elles sont disponibles."
      };
    case "preparing":
      return {
        title: "Commande en préparation",
        description: "Le paiement est confirmé et la commande est en cours de préparation.",
        nextStep: "Prochaine étape : expédition de la commande."
      };
    case "paid":
      return {
        title: "Commande payée",
        description: "Le paiement a bien été confirmé pour cette commande.",
        nextStep: "Prochaine étape : préparation de la commande."
      };
    case "pending":
    default:
      if (input.paymentStatus === "failed") {
        return {
          title: "Paiement à relancer",
          description: "La commande existe toujours, mais le paiement n'a pas abouti.",
          nextStep: "Vous pouvez relancer le paiement depuis cette page."
        };
      }

      return {
        title: "Commande en attente de paiement",
        description: "La commande est créée, mais le paiement doit encore être confirmé.",
        nextStep: "Finalisez le paiement pour lancer le traitement de la commande."
      };
  }
}

export function getOrderPaymentNotice(input: {
  orderStatus: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentParam?: string | undefined;
}): OrderStatusNotice {
  if (input.orderStatus === "cancelled") {
    return {
      kind: "alert",
      text: "Cette commande a été annulée."
    };
  }

  if (input.paymentStatus === "failed" || input.paymentParam === "failed") {
    return {
      kind: "alert",
      text: "Le paiement n'a pas abouti. Vous pouvez le relancer."
    };
  }

  switch (input.paymentParam) {
    case "cancelled":
      return {
        kind: "alert",
        text: "Le paiement a été interrompu. Vous pouvez le relancer."
      };
    case "return":
      return {
        kind: "alert",
        text: "Le paiement est en cours de confirmation. Rechargez la page dans quelques instants si besoin."
      };
    case "already_paid":
      return {
        kind: "success",
        text: "Cette commande est déjà payée."
      };
    case "unavailable":
      return {
        kind: "alert",
        text: "Cette commande ne peut pas être payée dans son état actuel."
      };
    default:
      return null;
  }
}
