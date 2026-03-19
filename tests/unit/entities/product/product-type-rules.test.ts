import { describe, expect, it } from "vitest";
import {
  canChangeProductTypeToSimple,
  canCreateVariantForProductType,
  canDeleteVariantForProductType,
  isProductType,
} from "@/entities/product/product-type-rules";

describe("isProductType", () => {
  it("accepts only simple and variable", () => {
    expect(isProductType("simple")).toBe(true);
    expect(isProductType("variable")).toBe(true);
    expect(isProductType("configurable")).toBe(false);
  });
});

describe("canChangeProductTypeToSimple", () => {
  it("allows switching to simple when at most one variant exists", () => {
    expect(canChangeProductTypeToSimple(0)).toBe(true);
    expect(canChangeProductTypeToSimple(1)).toBe(true);
  });

  it("rejects switching to simple when more than one variant exists", () => {
    expect(canChangeProductTypeToSimple(2)).toBe(false);
  });
});

describe("canCreateVariantForProductType", () => {
  it("allows only one sellable variant for a simple product", () => {
    expect(canCreateVariantForProductType("simple", 0)).toBe(true);
    expect(canCreateVariantForProductType("simple", 1)).toBe(false);
  });

  it("keeps the current behavior for variable products", () => {
    expect(canCreateVariantForProductType("variable", 0)).toBe(true);
    expect(canCreateVariantForProductType("variable", 3)).toBe(true);
  });
});

describe("canDeleteVariantForProductType", () => {
  it("refuses deleting the only sellable variant of a simple product", () => {
    expect(canDeleteVariantForProductType("simple", 1)).toBe(false);
  });

  it("allows deleting a variant when a simple product still has more than one", () => {
    expect(canDeleteVariantForProductType("simple", 2)).toBe(true);
  });

  it("keeps the current behavior for variable products", () => {
    expect(canDeleteVariantForProductType("variable", 1)).toBe(true);
    expect(canDeleteVariantForProductType("variable", 3)).toBe(true);
  });
});
