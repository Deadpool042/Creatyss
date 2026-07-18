import { describe, expect, it } from "vitest";

import { calculateReturnableQuantities } from "@/features/commerce/returns/domain/calculate-return-quantities";

describe("calculateReturnableQuantities", () => {
  it("retourne la quantité intégrale disponible en l'absence de demande existante", () => {
    const result = calculateReturnableQuantities([{ orderLineId: "line-1", quantity: 3 }], []);

    expect(result).toEqual({
      status: "OK",
      remainingByLineId: new Map([["line-1", 3]]),
    });
  });

  it("retranche la quantité déjà consommée par une demande non terminale", () => {
    const result = calculateReturnableQuantities(
      [{ orderLineId: "line-1", quantity: 3 }],
      [
        {
          status: "CLOSED",
          items: [{ orderLineId: "line-1", quantity: 1 }],
        },
      ]
    );

    expect(result).toEqual({
      status: "OK",
      remainingByLineId: new Map([["line-1", 2]]),
    });
  });

  it("ne retranche pas la quantité d'une demande annulée", () => {
    const result = calculateReturnableQuantities(
      [{ orderLineId: "line-1", quantity: 3 }],
      [
        {
          status: "CANCELLED",
          items: [{ orderLineId: "line-1", quantity: 3 }],
        },
      ]
    );

    expect(result).toEqual({
      status: "OK",
      remainingByLineId: new Map([["line-1", 3]]),
    });
  });

  it("ne retranche pas la quantité d'une demande refusée", () => {
    const result = calculateReturnableQuantities(
      [{ orderLineId: "line-1", quantity: 3 }],
      [
        {
          status: "REJECTED",
          items: [{ orderLineId: "line-1", quantity: 3 }],
        },
      ]
    );

    expect(result).toEqual({
      status: "OK",
      remainingByLineId: new Map([["line-1", 3]]),
    });
  });

  it("retourne UNCERTAIN si un article existant n'est plus rattaché à une ligne", () => {
    const result = calculateReturnableQuantities(
      [{ orderLineId: "line-1", quantity: 3 }],
      [
        {
          status: "CLOSED",
          items: [{ orderLineId: null, quantity: 1 }],
        },
      ]
    );

    expect(result).toEqual({
      status: "UNCERTAIN",
      remainingByLineId: new Map([["line-1", 3]]),
      uncertainLineIds: new Set(["line-1"]),
    });
  });

  it("marque incertaines toutes les lignes de la commande quand l'article orphelin ne peut être circonscrit à aucune ligne plausible", () => {
    const result = calculateReturnableQuantities(
      [
        { orderLineId: "line-1", quantity: 3 },
        { orderLineId: "line-2", quantity: 1 },
      ],
      [
        {
          status: "CLOSED",
          items: [{ orderLineId: null, quantity: 1 }],
        },
      ]
    );

    expect(result.status).toBe("UNCERTAIN");
    if (result.status === "UNCERTAIN") {
      expect(result.uncertainLineIds).toEqual(new Set(["line-1", "line-2"]));
      // Les quantités restantes exactes des lignes non touchées par l'article
      // orphelin restent calculées : le résultat "structuré" n'est jamais un
      // simple booléen opaque, même si aucune ligne ne peut ici être exclue.
      expect(result.remainingByLineId).toEqual(
        new Map([
          ["line-1", 3],
          ["line-2", 1],
        ])
      );
    }
  });

  it("n'affecte pas les lignes d'une commande différente par un article orphelin (item historique lié à une autre ligne : aucune incidence)", () => {
    const result = calculateReturnableQuantities(
      [
        { orderLineId: "line-1", quantity: 2 },
        { orderLineId: "line-2", quantity: 2 },
      ],
      [
        {
          status: "CLOSED",
          items: [{ orderLineId: "line-1", quantity: 1 }],
        },
      ]
    );

    expect(result).toEqual({
      status: "OK",
      remainingByLineId: new Map([
        ["line-1", 1],
        ["line-2", 2],
      ]),
    });
  });

  it("cumule les quantités de plusieurs articles consommant la même ligne", () => {
    const result = calculateReturnableQuantities(
      [{ orderLineId: "line-1", quantity: 5 }],
      [
        { status: "CLOSED", items: [{ orderLineId: "line-1", quantity: 2 }] },
        { status: "RECEIVED", items: [{ orderLineId: "line-1", quantity: 1 }] },
      ]
    );

    expect(result).toEqual({
      status: "OK",
      remainingByLineId: new Map([["line-1", 2]]),
    });
  });

  it("est pure : mêmes entrées, même résultat, sans mutation des entrées", () => {
    const orderLines = [{ orderLineId: "line-1", quantity: 3 }];
    const existingReturnRequests = [
      { status: "CLOSED" as const, items: [{ orderLineId: "line-1", quantity: 1 }] },
    ];

    const first = calculateReturnableQuantities(orderLines, existingReturnRequests);
    const second = calculateReturnableQuantities(orderLines, existingReturnRequests);

    expect(first).toEqual(second);
    expect(orderLines).toEqual([{ orderLineId: "line-1", quantity: 3 }]);
  });
});
