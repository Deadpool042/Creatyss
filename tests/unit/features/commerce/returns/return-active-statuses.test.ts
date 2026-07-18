import { describe, expect, it } from "vitest";

import {
  ACTIVE_RETURN_REQUEST_STATUSES,
  isActiveReturnRequestStatus,
} from "@/features/commerce/returns/domain/return-active-statuses";

describe("ACTIVE_RETURN_REQUEST_STATUSES", () => {
  it("verrouille la liste exacte des statuts actifs utilisée par createReturnRequest", () => {
    expect([...ACTIVE_RETURN_REQUEST_STATUSES]).toEqual([
      "REQUESTED",
      "UNDER_REVIEW",
      "APPROVED",
      "RECEIVED",
      "REFUNDED",
    ]);
  });

  it("considère REQUESTED comme actif", () => {
    expect(isActiveReturnRequestStatus("REQUESTED")).toBe(true);
  });

  it("ne considère pas CANCELLED comme actif", () => {
    expect(isActiveReturnRequestStatus("CANCELLED")).toBe(false);
  });

  it("ne considère pas CLOSED comme actif", () => {
    expect(isActiveReturnRequestStatus("CLOSED")).toBe(false);
  });

  it("ne considère pas REJECTED comme actif", () => {
    expect(isActiveReturnRequestStatus("REJECTED")).toBe(false);
  });

  it("ne considère pas ARCHIVED comme actif", () => {
    expect(isActiveReturnRequestStatus("ARCHIVED")).toBe(false);
  });
});
