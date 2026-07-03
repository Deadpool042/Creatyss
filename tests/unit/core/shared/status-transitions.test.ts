import { describe, expect, it } from "vitest";

import { isTransitionAllowed, type StatusTransitionMap } from "@/core/shared/status-transitions";

type Status = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

const TRANSITIONS: StatusTransitionMap<Status> = {
  DRAFT: ["ACTIVE", "ARCHIVED"],
  ACTIVE: ["INACTIVE", "ARCHIVED"],
  INACTIVE: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: [],
};

describe("isTransitionAllowed", () => {
  it("autorise une transition listée", () => {
    expect(isTransitionAllowed(TRANSITIONS, "DRAFT", "ACTIVE")).toBe(true);
    expect(isTransitionAllowed(TRANSITIONS, "ACTIVE", "INACTIVE")).toBe(true);
  });

  it("refuse une transition non listée", () => {
    expect(isTransitionAllowed(TRANSITIONS, "DRAFT", "INACTIVE")).toBe(false);
  });

  it("refuse toute transition depuis un statut terminal (tableau vide)", () => {
    expect(isTransitionAllowed(TRANSITIONS, "ARCHIVED", "ACTIVE")).toBe(false);
    expect(isTransitionAllowed(TRANSITIONS, "ARCHIVED", "DRAFT")).toBe(false);
  });

  it("refuse une transition depuis un statut absent de la table (clé manquante)", () => {
    const partial: StatusTransitionMap<Status> = { ACTIVE: ["INACTIVE"] };
    expect(isTransitionAllowed(partial, "DRAFT", "ACTIVE")).toBe(false);
  });

  it("refuse le statu quo s'il n'est pas explicitement listé", () => {
    expect(isTransitionAllowed(TRANSITIONS, "ACTIVE", "ACTIVE")).toBe(false);
  });
});
