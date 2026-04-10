import { describe, expect, it } from "vitest";

import { parseEmailFrom } from "@/core/email/from";

describe("parseEmailFrom", () => {
  it("accepts a plain email address", () => {
    expect(parseEmailFrom("noreply@example.com")).toEqual({
      email: "noreply@example.com",
    });
  });

  it("accepts a named sender address", () => {
    expect(parseEmailFrom("Creatyss <noreply@example.com>")).toEqual({
      email: "noreply@example.com",
      name: "Creatyss",
    });
  });

  it("rejects an invalid sender format", () => {
    expect(() => parseEmailFrom("Creatyss")).toThrow("Invalid EMAIL_FROM format.");
  });
});
