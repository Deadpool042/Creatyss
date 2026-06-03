import { describe, expect, it } from "vitest";

import { createEmailSender } from "@/core/email/from";

describe("createEmailSender", () => {
  it("accepts a plain email address", () => {
    expect(createEmailSender("noreply@example.com")).toEqual({
      email: "noreply@example.com",
    });
  });

  it("accepts a named sender address", () => {
    expect(createEmailSender("noreply@example.com", "Creatyss")).toEqual({
      email: "noreply@example.com",
      name: "Creatyss",
    });
  });

  it("rejects an invalid sender format", () => {
    expect(() => createEmailSender("Creatyss")).toThrow("Invalid email sender address.");
  });
});
