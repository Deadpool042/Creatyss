import { describe, expect, it } from "vitest";

import { validateContactMessageInput } from "@/entities/contact/contact-message-input";

const VALID_INPUT = {
  firstName: "Marie",
  lastName: "Curie",
  email: "marie@example.com",
  subject: "sur_mesure",
  message: "Bonjour, je souhaite un renseignement.",
};

describe("validateContactMessageInput", () => {
  it("accepte une entrée complète et valide", () => {
    const result = validateContactMessageInput(VALID_INPUT);

    expect(result).toEqual({
      ok: true,
      data: {
        firstName: "Marie",
        lastName: "Curie",
        email: "marie@example.com",
        subject: "sur_mesure",
        message: "Bonjour, je souhaite un renseignement.",
      },
    });
  });

  it("accepte une entrée sans nom ni sujet", () => {
    const result = validateContactMessageInput({
      ...VALID_INPUT,
      lastName: "",
      subject: "",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.lastName).toBeNull();
      expect(result.data.subject).toBeNull();
    }
  });

  it("rejette un prénom manquant", () => {
    const result = validateContactMessageInput({ ...VALID_INPUT, firstName: "  " });

    expect(result).toEqual({ ok: false, code: "missing_first_name" });
  });

  it("rejette un email manquant", () => {
    const result = validateContactMessageInput({ ...VALID_INPUT, email: "" });

    expect(result).toEqual({ ok: false, code: "missing_email" });
  });

  it("rejette un email invalide", () => {
    const result = validateContactMessageInput({ ...VALID_INPUT, email: "pas-un-email" });

    expect(result).toEqual({ ok: false, code: "invalid_email" });
  });

  it("rejette un message manquant", () => {
    const result = validateContactMessageInput({ ...VALID_INPUT, message: "   " });

    expect(result).toEqual({ ok: false, code: "missing_message" });
  });

  it("ignore un sujet non reconnu", () => {
    const result = validateContactMessageInput({ ...VALID_INPUT, subject: "spam" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.subject).toBeNull();
    }
  });
});
