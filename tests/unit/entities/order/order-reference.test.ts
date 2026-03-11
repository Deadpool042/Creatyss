import { describe, expect, it } from "vitest";
import { formatOrderReferenceFromBytes } from "@/entities/order/order-reference";

describe("formatOrderReferenceFromBytes", () => {
  it("produit une reference opaque au format attendu", () => {
    const reference = formatOrderReferenceFromBytes(
      Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    );

    expect(reference).toMatch(/^CRY-[A-Z2-9]{10}$/);
    expect(reference).toHaveLength(14);
  });

  it("complete la reference si le buffer est plus court que la longueur cible", () => {
    const reference = formatOrderReferenceFromBytes(Uint8Array.from([1, 2, 3]));

    expect(reference).toMatch(/^CRY-[A-Z2-9]{10}$/);
    expect(reference).toHaveLength(14);
  });
});
