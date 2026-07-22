import { describe, expect, it } from "vitest";

import { resolveAdminErrorMessage } from "@/features/admin/commerce/shared/resolve-admin-error-message";

describe("resolveAdminErrorMessage", () => {
  const messages = {
    duplicate_code: "Une règle avec ce code existe déjà.",
    invalid_input: "Formulaire invalide — vérifiez les champs.",
  };

  it("retourne le message associé au code connu", () => {
    expect(resolveAdminErrorMessage("duplicate_code", messages, "Échec.")).toBe(
      "Une règle avec ce code existe déjà."
    );
  });

  it("retourne le fallback pour un code inconnu", () => {
    expect(resolveAdminErrorMessage("unknown_code", messages, "Échec.")).toBe("Échec.");
  });

  it("retourne le fallback pour une chaîne vide", () => {
    expect(resolveAdminErrorMessage("", messages, "Échec.")).toBe("Échec.");
  });
});
