import { describe, expect, it } from "vitest";
import {
  getOrderPaymentNotice,
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel
} from "@/entities/order/order-status-presentation";

describe("order-status-presentation", () => {
  it("retourne des libelles lisibles pour les statuts commande et paiement", () => {
    expect(getOrderStatusLabel("pending")).toBe("En attente");
    expect(getOrderStatusLabel("shipped")).toBe("Expediee");
    expect(getPaymentStatusLabel("pending")).toBe("Paiement en attente");
    expect(getPaymentStatusLabel("succeeded")).toBe("Paiement reussi");
  });

  it("retourne une synthese claire pour une commande en attente de paiement", () => {
    expect(
      getOrderStatusSummary({
        orderStatus: "pending",
        paymentStatus: "pending"
      })
    ).toEqual({
      title: "Commande en attente de paiement",
      description:
        "La commande est creee, mais le paiement doit encore etre confirme.",
      nextStep: "Finalisez le paiement pour lancer le traitement de la commande."
    });
  });

  it("retourne une synthese claire pour une commande expediee", () => {
    expect(
      getOrderStatusSummary({
        orderStatus: "shipped",
        paymentStatus: "succeeded"
      })
    ).toEqual({
      title: "Commande expediee",
      description:
        "La commande a quitte l'atelier et est en cours d'acheminement.",
      nextStep:
        "Consultez la date d'expedition et la reference de suivi si elles sont disponibles."
    });
  });

  it("retourne une alerte utile pour un paiement interrompu ou echoue", () => {
    expect(
      getOrderPaymentNotice({
        orderStatus: "pending",
        paymentStatus: "pending",
        paymentParam: "cancelled"
      })
    ).toEqual({
      kind: "alert",
      text: "Le paiement a ete interrompu. Vous pouvez le relancer."
    });

    expect(
      getOrderPaymentNotice({
        orderStatus: "pending",
        paymentStatus: "failed"
      })
    ).toEqual({
      kind: "alert",
      text: "Le paiement n'a pas abouti. Vous pouvez le relancer."
    });
  });
});
