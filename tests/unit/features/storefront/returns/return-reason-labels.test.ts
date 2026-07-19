import { describe, expect, it } from "vitest";

import { RETURN_REASON_CATEGORY_VALUES } from "@/features/commerce/returns/domain/return-eligibility.types";
import {
  RETURN_REASON_CATEGORY_LABELS,
  RETURN_REASON_CATEGORY_OPTIONS,
} from "@/features/storefront/returns/lib/return-reason-labels";

describe("RETURN_REASON_CATEGORY_LABELS", () => {
  it("fournit un libellé non vide pour chaque valeur de RETURN_REASON_CATEGORY_VALUES", () => {
    for (const value of RETURN_REASON_CATEGORY_VALUES) {
      const label = RETURN_REASON_CATEGORY_LABELS[value];
      expect(typeof label).toBe("string");
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });

  it("ne définit aucun libellé pour une catégorie qui n'existe pas dans le domaine", () => {
    const labelKeys = Object.keys(RETURN_REASON_CATEGORY_LABELS).sort();
    const domainValues = [...RETURN_REASON_CATEGORY_VALUES].sort();

    expect(labelKeys).toEqual(domainValues);
  });
});

describe("RETURN_REASON_CATEGORY_OPTIONS", () => {
  it("expose une option par valeur du domaine, dans l'ordre canonique", () => {
    expect(RETURN_REASON_CATEGORY_OPTIONS.map((option) => option.value)).toEqual(
      RETURN_REASON_CATEGORY_VALUES
    );
  });

  it("associe à chaque option le libellé correspondant", () => {
    for (const option of RETURN_REASON_CATEGORY_OPTIONS) {
      expect(option.label).toBe(RETURN_REASON_CATEGORY_LABELS[option.value]);
    }
  });
});
