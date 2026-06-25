import { describe, expect, it } from "vitest";
import { csvTaxRuleRowSchema } from "@/features/admin/commerce/taxation/schemas/import-tax-rule.schema";

const VALID_ROW = {
  code: "FR-STD-METRO",
  name: "TVA standard métropole",
  countryCode: "FR",
  regionCode: "",
  ratePercent: "20",
  startsAt: "",
  endsAt: "",
  status: "ACTIVE",
};

describe("csvTaxRuleRowSchema", () => {
  it("valide une ligne complète correcte", () => {
    const result = csvTaxRuleRowSchema.safeParse(VALID_ROW);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.code).toBe("FR-STD-METRO");
    expect(result.data.ratePercent).toBe(20);
    expect(result.data.status).toBe("ACTIVE");
    expect(result.data.regionCode).toBeNull();
  });

  describe("regionCode", () => {
    it("chaîne vide → null", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, regionCode: "" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.regionCode).toBeNull();
    });

    it("undefined (colonne absente) → null", () => {
      const { regionCode: _, ...rowWithoutRegion } = VALID_ROW;
      const result = csvTaxRuleRowSchema.safeParse(rowWithoutRegion);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.regionCode).toBeNull();
    });

    it("null explicite → null", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, regionCode: null });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.regionCode).toBeNull();
    });

    it("code DOM valide 971 → conservé", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, regionCode: "971" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.regionCode).toBe("971");
    });

    it("code DOM invalide → erreur", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, regionCode: "999" });
      expect(result.success).toBe(false);
    });
  });

  describe("ratePercent", () => {
    it("chaîne '20' → nombre 20", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, ratePercent: "20" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.ratePercent).toBe(20);
    });

    it("chaîne '8.5' → nombre 8.5", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, ratePercent: "8.5" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.ratePercent).toBe(8.5);
    });

    it("taux négatif → erreur", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, ratePercent: "-1" });
      expect(result.success).toBe(false);
    });

    it("taux > 100 → erreur", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, ratePercent: "150" });
      expect(result.success).toBe(false);
    });
  });

  describe("status", () => {
    it("absent → default DRAFT", () => {
      const { status: _, ...rowWithoutStatus } = VALID_ROW;
      const result = csvTaxRuleRowSchema.safeParse(rowWithoutStatus);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.status).toBe("DRAFT");
    });

    it("ACTIVE conservé", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, status: "ACTIVE" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.status).toBe("ACTIVE");
    });

    it("valeur invalide → erreur", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, status: "PUBLISHED" });
      expect(result.success).toBe(false);
    });
  });

  describe("code", () => {
    it("caractères invalides → erreur", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, code: "FR TVA METRO" });
      expect(result.success).toBe(false);
    });

    it("trop court → erreur", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, code: "F" });
      expect(result.success).toBe(false);
    });
  });

  describe("startsAt / endsAt", () => {
    it("vide → undefined", () => {
      const result = csvTaxRuleRowSchema.safeParse({ ...VALID_ROW, startsAt: "", endsAt: "" });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.startsAt).toBeUndefined();
      expect(result.data.endsAt).toBeUndefined();
    });

    it("date ISO valide conservée comme string", () => {
      const result = csvTaxRuleRowSchema.safeParse({
        ...VALID_ROW,
        startsAt: "2026-01-01T00:00:00.000Z",
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.startsAt).toBe("2026-01-01T00:00:00.000Z");
    });
  });
});
