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
      return "Expediee";
    case "preparing":
      return "En preparation";
    case "paid":
      return "Payee";
    case "cancelled":
      return "Annulee";
    case "pending":
    default:
      return "En attente";
  }
}

export function getPaymentStatusLabel(status: OrderPaymentStatus): string {
  switch (status) {
    case "succeeded":
      return "Paiement reussi";
    case "failed":
      return "Paiement echoue";
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
        title: "Commande annulee",
        description: "La commande a ete annulee et n'est plus en cours de traitement.",
        nextStep: "Aucune autre action n'est disponible pour cette commande."
      };
    case "shipped":
      return {
        title: "Commande expediee",
        description: "La commande a quitte l'atelier et est en cours d'acheminement.",
        nextStep:
          "Consultez la date d'expedition et la reference de suivi si elles sont disponibles."
      };
    case "preparing":
      return {
        title: "Commande en preparation",
        description: "Le paiement est confirme et la commande est en cours de preparation.",
        nextStep: "Prochaine etape : expedition de la commande."
      };
    case "paid":
      return {
        title: "Commande payee",
        description: "Le paiement a bien ete confirme pour cette commande.",
        nextStep: "Prochaine etape : preparation de la commande."
      };
    case "pending":
    default:
      if (input.paymentStatus === "failed") {
        return {
          title: "Paiement a relancer",
          description: "La commande existe toujours, mais le paiement n'a pas abouti.",
          nextStep: "Vous pouvez relancer le paiement depuis cette page."
        };
      }

      return {
        title: "Commande en attente de paiement",
        description: "La commande est creee, mais le paiement doit encore etre confirme.",
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
      text: "Cette commande a ete annulee."
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
        text: "Le paiement a ete interrompu. Vous pouvez le relancer."
      };
    case "return":
      return {
        kind: "alert",
        text: "Le paiement est en cours de confirmation. Rechargez la page dans quelques instants si besoin."
      };
    case "already_paid":
      return {
        kind: "success",
        text: "Cette commande est deja payee."
      };
    case "unavailable":
      return {
        kind: "alert",
        text: "Cette commande ne peut pas etre payee dans son etat actuel."
      };
    default:
      return null;
  }
}
