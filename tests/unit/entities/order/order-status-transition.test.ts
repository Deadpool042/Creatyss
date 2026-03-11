import { describe, expect, it } from "vitest";
import {
  getAllowedOrderStatusTransitions,
  resolveOrderStatusTransition
} from "@/entities/order/order-status-transition";

describe("getAllowedOrderStatusTransitions", () => {
  it("retourne les transitions admin autorisees pour chaque statut", () => {
    expect(getAllowedOrderStatusTransitions("pending")).toEqual(["cancelled"]);
    expect(getAllowedOrderStatusTransitions("paid")).toEqual([
      "preparing",
      "cancelled"
    ]);
    expect(getAllowedOrderStatusTransitions("preparing")).toEqual([
      "shipped",
      "cancelled"
    ]);
    expect(getAllowedOrderStatusTransitions("shipped")).toEqual([]);
    expect(getAllowedOrderStatusTransitions("cancelled")).toEqual([]);
  });
});

describe("resolveOrderStatusTransition", () => {
  it("autorise le passage de paid a preparing sans restock", () => {
    expect(
      resolveOrderStatusTransition({
        currentStatus: "paid",
        nextStatus: "preparing"
      })
    ).toEqual({
      ok: true,
      shouldRestock: false
    });

    expect(
      resolveOrderStatusTransition({
        currentStatus: "preparing",
        nextStatus: "shipped"
      })
    ).toEqual({
      ok: true,
      shouldRestock: false
    });
  });

  it("autorise l'annulation d'une commande non annulee avec restock", () => {
    expect(
      resolveOrderStatusTransition({
        currentStatus: "pending",
        nextStatus: "cancelled"
      })
    ).toEqual({
      ok: true,
      shouldRestock: true
    });

    expect(
      resolveOrderStatusTransition({
        currentStatus: "preparing",
        nextStatus: "cancelled"
      })
    ).toEqual({
      ok: true,
      shouldRestock: true
    });
  });

  it("refuse les transitions manuelles non autorisees", () => {
    expect(
      resolveOrderStatusTransition({
        currentStatus: "pending",
        nextStatus: "paid"
      })
    ).toEqual({ ok: false });

    expect(
      resolveOrderStatusTransition({
        currentStatus: "cancelled",
        nextStatus: "preparing"
      })
    ).toEqual({ ok: false });

    expect(
      resolveOrderStatusTransition({
        currentStatus: "paid",
        nextStatus: "paid"
      })
    ).toEqual({ ok: false });

    expect(
      resolveOrderStatusTransition({
        currentStatus: "shipped",
        nextStatus: "cancelled"
      })
    ).toEqual({ ok: false });
  });
});
