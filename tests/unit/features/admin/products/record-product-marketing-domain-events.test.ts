import { describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    domainEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import {
  getChangedVisibleProductFields,
  type ProductMarketingDomainEventSnapshot,
} from "@/features/admin/products/services/record-product-marketing-domain-events";

function buildSnapshot(
  overrides: Partial<ProductMarketingDomainEventSnapshot> = {}
): ProductMarketingDomainEventSnapshot {
  return {
    id: "product_1",
    slug: "vase-en-ceramique",
    name: "Vase en céramique",
    marketingHook: "Fait main",
    shortDescription: "Un vase élégant",
    description: "Description longue du vase",
    careInstructions: "Nettoyer à sec",
    updatedAt: new Date("2026-07-22T10:00:00.000Z"),
    ...overrides,
  };
}

describe("getChangedVisibleProductFields", () => {
  it("ne retourne aucun champ quand rien n'a changé", () => {
    const previous = buildSnapshot();
    const next = buildSnapshot();

    expect(getChangedVisibleProductFields(previous, next)).toEqual([]);
  });

  it("ignore les champs hors whitelist (ex: updatedAt seul)", () => {
    const previous = buildSnapshot();
    const next = buildSnapshot({ updatedAt: new Date("2026-07-22T11:00:00.000Z") });

    expect(getChangedVisibleProductFields(previous, next)).toEqual([]);
  });

  it("détecte un changement de nom", () => {
    const previous = buildSnapshot();
    const next = buildSnapshot({ name: "Vase en céramique — édition limitée" });

    expect(getChangedVisibleProductFields(previous, next)).toEqual(["name"]);
  });

  it("détecte plusieurs champs éditoriaux modifiés simultanément", () => {
    const previous = buildSnapshot();
    const next = buildSnapshot({
      slug: "vase-en-ceramique-v2",
      description: "Nouvelle description longue",
      careInstructions: null,
    });

    expect(getChangedVisibleProductFields(previous, next)).toEqual([
      "slug",
      "description",
      "careInstructions",
    ]);
  });
});
