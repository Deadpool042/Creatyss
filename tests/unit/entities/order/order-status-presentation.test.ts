import { describe, expect, it } from "vitest";
import {
  getOrderPaymentNotice,
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel,
} from "@/entities/order/order-status-presentation";

describe("order-status-presentation", () => {
  it("retourne des libellés lisibles pour les statuts commande et paiement", () => {
    expect(getOrderStatusLabel("pending")).toBe("En attente");
    expect(getOrderStatusLabel("shipped")).toBe("Expédiée");
    expect(getPaymentStatusLabel("pending")).toBe("Paiement en attente");
    expect(getPaymentStatusLabel("succeeded")).toBe("Paiement réussi");
  });

  it("retourne une synthèse claire pour une commande en attente de paiement", () => {
    expect(
      getOrderStatusSummary({
        orderStatus: "pending",
        paymentStatus: "pending",
      })
    ).toEqual({
      title: "Commande en attente de paiement",
      description: "La commande est créée, mais le paiement doit encore être confirmé.",
      nextStep: "Finalisez le paiement pour lancer le traitement de la commande.",
    });
  });

  it("retourne une synthèse claire pour une commande expédiée", () => {
    expect(
      getOrderStatusSummary({
        orderStatus: "shipped",
        paymentStatus: "succeeded",
      })
    ).toEqual({
      title: "Commande expédiée",
      description: "La commande a quitté l'atelier et est en cours d'acheminement.",
      nextStep:
        "Consultez la date d'expédition et la référence de suivi si elles sont disponibles.",
    });
  });

  it("retourne une alerte utile pour un paiement interrompu ou échoué", () => {
    expect(
      getOrderPaymentNotice({
        orderStatus: "pending",
        paymentStatus: "pending",
        paymentParam: "cancelled",
      })
    ).toEqual({
      kind: "alert",
      text: "Le paiement a été interrompu. Vous pouvez le relancer.",
    });

    expect(
      getOrderPaymentNotice({
        orderStatus: "pending",
        paymentStatus: "failed",
      })
    ).toEqual({
      kind: "alert",
      text: "Le paiement n'a pas abouti. Vous pouvez le relancer.",
    });
  });
});
